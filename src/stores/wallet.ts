import { api } from "@/helpers/api"
import { fetchPricesAndChange } from "@/helpers/price"
import { createSocket } from "@/helpers/socket"
import { TransactionType } from "@/types/wallet"
import { create } from "zustand"

import { SecureStorage } from "@plasmohq/storage/secure"

type WalletItem = { chain: string; address: string; balance: number }
type KeyringItem = { id: string; label: string; createdAt: string }

type WalletState = {
  wallets: WalletItem[]
  keyrings: KeyringItem[]
  activeKeyringId?: string | null
  baseCurrency: string
  prices: Record<string, number> // key: asset id ('bitcoin','ethereum','tron','usdt')
  changes24h?: Record<string, number>
  total: number
  loading: boolean
  socketConnected: boolean
  transactions: TransactionType[]
  transactionsLoading: boolean
  transactionSeenById: Record<string, boolean>
  unseenTransactionsCount: number
  bootstrap: (opts?: { skipPreferences?: boolean }) => Promise<void>
  setBaseCurrency: (cur: string) => Promise<void>
  setActiveKeyring: (id: string) => Promise<void>
  createKeyring: (label: string) => Promise<void>
  importKeyring: (label: string, mnemonic: string) => Promise<void>
  renameKeyring: (id: string, label: string) => Promise<void>
  exportKeyring: (id: string, passcode?: string) => Promise<string>
  sendTransfer: (args: {
    chain: string
    toAddress: string
    amount: string
    passcode?: string
  }) => Promise<{ txid: string; from: string }>
  loadTransactions: () => Promise<void>
  subscribeSocket: () => void
  unsubscribeSocket: () => void
  markAllTransactionsSeen: () => Promise<void>
}

let socket: ReturnType<typeof createSocket> | null = null

// Initialize secure storage
const secureStorage = new SecureStorage()

const chainToId = (chain: string) => (chain === "usdt-trc20" ? "usdt" : chain)

const mapChainToSymbol = (chain: string): string => {
  switch (chain.toLowerCase()) {
    case "bitcoin":
      return "BTC"
    case "ethereum":
      return "ETH"
    case "tron":
      return "TRX"
    case "usdt-trc20":
      return "USDT"
    default:
      return chain.toUpperCase()
  }
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallets: [],
  keyrings: [],
  activeKeyringId: null,
  baseCurrency: "USD",
  prices: {},
  changes24h: {},
  total: 0,
  loading: true,
  socketConnected: false,
  transactions: [],
  transactionsLoading: false,
  transactionSeenById: {},
  unseenTransactionsCount: 0,

  bootstrap: async (opts?: { skipPreferences?: boolean }) => {
    set({ loading: true })
    // Initialize secure storage with a password
    try {
      await secureStorage.setPassword("zenx-wallet-secure-storage")
    } catch (error) {
      console.error("Failed to set secure storage password", error)
    }
    // Hydrate seen map from secure storage early
    try {
      const seenData = await secureStorage.get("wallet_tx_seen")
      if (seenData && typeof seenData === "object") {
        set({ transactionSeenById: seenData })
      }
    } catch (error) {
      console.error(
        "Failed to load transaction seen data from secure storage",
        error
      )
    }
    console.log("registering")
    await api.register().catch(console.log)
    // Load preferences first to set base currency unless skipped (e.g., manual refresh)
    if (!opts?.skipPreferences) {
      console.log("loading preferences")
      const prefs = await api
        .preferences()
        .catch(() => ({ preferredCurrency: "USD" }))
      if (prefs?.preferredCurrency) {
        set({ baseCurrency: (prefs.preferredCurrency || "USD").toUpperCase() })
      }
      if ((prefs as any)?.activeKeyringId !== undefined) {
        set({ activeKeyringId: (prefs as any).activeKeyringId || null })
      }
    }
    // Load keyrings
    console.log("loading keyrings")
    const list = await api
      .listKeyrings()
      .catch(() => ({ keyrings: [] as any[] }))
    set({ keyrings: (list as any).keyrings || [] })

    const active =
      get().activeKeyringId || ((list as any).keyrings?.[0]?.id ?? undefined)
    if (active && active !== get().activeKeyringId) {
      set({ activeKeyringId: active })
    }
    console.log("loading wallets")
    const { wallets } = await api
      .wallets(active ? { keyringId: active } : undefined)
      .catch(() => ({ wallets: [] as any[] }))
    const normalized: WalletItem[] = (wallets || []).map((w: any) => ({
      chain: w.chain,
      address: w.address,
      balance: Number(w.balance || 0)
    }))
    set({ wallets: normalized })
    const ids = Array.from(new Set(normalized.map((w) => chainToId(w.chain))))
    console.log("fetching prices")
    const { prices, changes } = await fetchPricesAndChange(
      ids,
      get().baseCurrency
    ).catch((err) => {
      console.log("failed to fetch prices", err)
      return { prices: {}, changes: {} }
    })
    console.log("calculating total")
    const total = normalized.reduce(
      (sum, w) =>
        sum + ((prices as any)[chainToId(w.chain)] || 0) * (w.balance || 0),
      0
    )
    set({ prices, changes24h: changes, total, loading: false })

    console.log("loading transactions")
    // Load transactions after wallet data is ready
    await get().loadTransactions()
  },

  loadTransactions: async () => {
    set({ transactionsLoading: true })
    try {
      const active = get().activeKeyringId
      const { transactions } = await api.transactions(
        active ? { keyringId: active } : ({} as any)
      )
      // Transform API response to match our TransactionType
      const formattedTransactions: TransactionType[] = (transactions || []).map(
        (tx: any) => {
          const rawTs = tx.timestamp ?? tx.createdAt ?? Date.now()
          const tsNum =
            typeof rawTs === "string"
              ? Number(rawTs) || Date.parse(rawTs)
              : Number(rawTs)
          const msTs = Number.isFinite(tsNum)
            ? tsNum < 1e12
              ? tsNum * 1000
              : tsNum // treat seconds as ms
            : Date.now()
          return {
            id: tx.id || tx._id || String(Math.random()),
            type:
              tx.type ||
              (tx.direction === "in"
                ? "receive"
                : tx.direction === "out"
                  ? "send"
                  : "send"),
            asset: mapChainToSymbol(tx.chain || "bitcoin"),
            amount: Number(tx.amount || 0),
            amountUSD: Number(tx.amountUSD || 0),
            timestamp: new Date(msTs),
            status: tx.status || "completed",
            hash: tx.hash || tx.txid || "",
            fromAddress: tx.fromAddress || tx.from || "",
            toAddress: tx.toAddress || tx.to || ""
          } as TransactionType
        }
      )

      // Sort by timestamp descending (newest first)
      formattedTransactions.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      )

      // Merge seen flags from store
      const seenMap = get().transactionSeenById || {}
      const withSeen = formattedTransactions.map((tx) => ({
        ...tx,
        seen: Boolean(seenMap[tx.id])
      }))
      const unseen = withSeen.reduce(
        (count, tx) => count + (tx.seen ? 0 : 1),
        0
      )
      set({
        transactions: withSeen,
        transactionsLoading: false,
        unseenTransactionsCount: unseen
      })
    } catch (error) {
      console.error("Failed to load transactions:", error)
      set({ transactions: [], transactionsLoading: false })
    }
  },

  setBaseCurrency: async (cur: string) => {
    // Keep prior UI visible; don't toggle global loading for currency change
    set({ baseCurrency: cur })
    // Persist preference to backend
    await api.updatePreferences({ preferredCurrency: cur }).catch(() => void 0)
    const ids = Array.from(
      new Set(get().wallets.map((w) => chainToId(w.chain)))
    )
    const { prices } = await fetchPricesAndChange(ids, cur).catch(() => ({
      prices: {},
      changes: {}
    }))
    const total = get().wallets.reduce(
      (sum, w) =>
        sum + ((prices as any)[chainToId(w.chain)] || 0) * (w.balance || 0),
      0
    )
    set({ prices, total })
  },

  setActiveKeyring: async (id: string) => {
    set({ activeKeyringId: id })
    await api.updatePreferences({ activeKeyringId: id }).catch(() => void 0)
    const { wallets } = await api
      .wallets({ keyringId: id })
      .catch(() => ({ wallets: [] as any[] }))
    const normalized: WalletItem[] = (wallets || []).map((w: any) => ({
      chain: w.chain,
      address: w.address,
      balance: Number(w.balance || 0)
    }))
    set({ wallets: normalized })
    // Recompute totals for new wallet set
    const ids = Array.from(new Set(normalized.map((w) => chainToId(w.chain))))
    const { prices } = await fetchPricesAndChange(
      ids,
      get().baseCurrency
    ).catch(() => ({ prices: {}, changes: {} }))
    const total = normalized.reduce(
      (sum, w) =>
        sum + ((prices as any)[chainToId(w.chain)] || 0) * (w.balance || 0),
      0
    )
    set({ prices, total })
    // Refresh transactions for keyring
    get().loadTransactions()
  },

  createKeyring: async (label: string) => {
    await api.createKeyring({ label }).catch(() => {
      throw new Error("Failed to create wallet")
    })
    const list = await api
      .listKeyrings()
      .catch(() => ({ keyrings: [] as any[] }))
    const latest = (list as any).keyrings || []
    set({ keyrings: latest })
    const created = latest[latest.length - 1]
    if (created?.id) {
      await get().setActiveKeyring(created.id)
    }
  },

  importKeyring: async (label: string, mnemonic: string) => {
    await api.importKeyring({ label, mnemonic }).catch(() => {
      throw new Error("Failed to import wallet")
    })
    const list = await api
      .listKeyrings()
      .catch(() => ({ keyrings: [] as any[] }))
    const latest = (list as any).keyrings || []
    set({ keyrings: latest })
    const imported = latest[latest.length - 1]
    if (imported?.id) {
      await get().setActiveKeyring(imported.id)
    }
  },

  renameKeyring: async (id: string, label: string) => {
    await api.renameKeyring(id, { label }).catch(() => {
      throw new Error("Failed to rename wallet")
    })
    const list = await api
      .listKeyrings()
      .catch(() => ({ keyrings: [] as any[] }))
    set({ keyrings: (list as any).keyrings || [] })
  },

  exportKeyring: async (id: string, passcode?: string) => {
    const res = await api.exportKeyring(id, passcode).catch((e) => {
      throw new Error(String(e?.message || "Failed to export"))
    })
    return (res as any).mnemonic as string
  },

  sendTransfer: async (args: {
    chain: string
    toAddress: string
    amount: string
    passcode?: string
  }) => {
    const active = get().activeKeyringId || undefined
    const res = await api
      .transfer({ ...args, ...(active ? { keyringId: active } : {}) } as any)
      .catch((e) => {
        throw new Error(String(e?.message || "Failed to send"))
      })
    // Optimistic refresh
    await get().loadTransactions()
    return res as any
  },

  subscribeSocket: () => {
    if (socket) return
    socket = createSocket()
    socket.on(
      "balance_update",
      (data: {
        chain: string
        address: string
        balance: string
        balanceUSD?: number
      }) => {
        const chain = data.chain
        const addr = data.address
        const balNum = Number(data.balance ?? 0)
        const currentWallets = get().wallets
        // Only apply updates for our own wallet address on that chain
        const target = currentWallets.find(
          (w) => w.chain === chain && w.address === addr
        )
        if (!target) return
        if (Number(target.balance || 0) === balNum) {
          return
        }
        const wallets = currentWallets.map((w) =>
          w.chain === chain && w.address === addr
            ? { ...w, balance: balNum }
            : w
        )
        const prices = get().prices
        const total = wallets.reduce(
          (sum, w) =>
            sum + ((prices as any)[chainToId(w.chain)] || 0) * (w.balance || 0),
          0
        )
        set({ wallets, total })
      }
    )
    set({ socketConnected: true })
  },

  unsubscribeSocket: () => {
    if (socket) {
      socket.off("balance_update")
      socket.disconnect()
      socket = null
    }
    set({ socketConnected: false })
  },

  markAllTransactionsSeen: async () => {
    const transactions = get().transactions || []
    const newSeenMap: Record<string, boolean> = {
      ...get().transactionSeenById
    }
    transactions.forEach((tx) => {
      newSeenMap[tx.id] = true
    })
    const updated = transactions.map((tx) => ({ ...tx, seen: true }))
    set({
      transactionSeenById: newSeenMap,
      transactions: updated,
      unseenTransactionsCount: 0
    })
    try {
      await secureStorage.set("wallet_tx_seen", newSeenMap)
    } catch (error) {
      console.error(
        "Failed to save transaction seen data to secure storage",
        error
      )
    }
  }
}))
