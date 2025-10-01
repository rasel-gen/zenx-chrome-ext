import { AssetList } from '@/components/AssetList/AssetList'
import { BalanceDisplay } from '@/components/BalanceDisplay/BalanceDisplay'
import { FloatingMenu } from '@/components/FloatingMenu/FloatingMenu'
import { Page } from '@/components/Page'
import { ReceiveSheet } from '@/components/ReceiveSheet/ReceiveSheet'
import { SendSheet } from '@/components/SendSheet/SendSheet'
import { TransactionHistory } from '@/components/TransactionHistory/TransactionHistory'
import { WalletHeader } from '@/components/WalletHeader/WalletHeader'
import { useWalletStore } from '@/stores/wallet'
import { CryptoAsset, TransactionType, WalletData } from '@/types/wallet'
import BTC from 'data-base64:../../../assets/public/bitcoin.svg'
import BSC from 'data-base64:../../../assets/public/bsc.svg'
import ETH from 'data-base64:../../../assets/public/ethereum.svg'
import SOLANA from 'data-base64:../../../assets/public/solana.svg'
import TRON from 'data-base64:../../../assets/public/tron.svg'
import USDC from 'data-base64:../../../assets/public/usdc.svg'
import USDT from 'data-base64:../../../assets/public/usdt.svg'
import XRP from 'data-base64:../../../assets/public/xrp.svg'
import { useEffect, useMemo, useState } from 'react'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'

// Note: These will be implemented when backend is ready
// import { api } from '@/helpers/api';
// import { createSocket } from '@/helpers/socket';

export const IndexPage: FC = () => {
  const navigate = useNavigate()

  // Create user data from Telegram initData or fallback to mock data
  const userData = useMemo(
    () => ({
      name: 'John Smith',
      username: 'john_smith',
      avatar: undefined,
    }),
    []
  )

  const [walletData, setWalletData] = useState<WalletData>(() => ({
    user: userData,
    totalBalanceUSD: 0,
    assets: [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        balance: 0,
        balanceUSD: 0,
        price: 0,
        priceChange24h: 0,
        icon: BTC,
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        balance: 0,
        balanceUSD: 0,
        price: 0,
        priceChange24h: 0,
        icon: ETH,
      },
      {
        id: 'usdt-trc20',
        name: 'Tether (TRC20)',
        symbol: 'USDT',
        balance: 0,
        balanceUSD: 0,
        price: 0,
        priceChange24h: 0,
        icon: USDT,
      },
      {
        id: 'usdc-erc20',
        name: 'USD Coin (ERC20)',
        symbol: 'USDC',
        balance: 0,
        balanceUSD: 0,
        price: 0,
        priceChange24h: 0,
        icon: USDC,
      },
      {
        id: 'tron',
        name: 'Tron',
        symbol: 'TRX',
        balance: 0,
        balanceUSD: 0,
        price: 0,
        priceChange24h: 0,
        icon: TRON,
      },
      {
        id: 'solana',
        name: 'Solana',
        symbol: 'SOL',
        balance: 0,
        balanceUSD: 0,
        price: 0,
        priceChange24h: 0,
        icon: SOLANA,
      },
      {
        id: 'xrp',
        name: 'XRP',
        symbol: 'XRP',
        balance: 0,
        balanceUSD: 0,
        price: 0,
        priceChange24h: 0,
        icon: XRP,
      },
      {
        id: 'usdt-erc20',
        name: 'Tether (ERC20)',
        symbol: 'USDT',
        balance: 0,
        balanceUSD: 0,
        price: 0,
        priceChange24h: 0,
        icon: USDT,
      },
      {
        id: 'usdt-bep20',
        name: 'Tether (BEP20)',
        symbol: 'USDT',
        balance: 0,
        balanceUSD: 0,
        price: 0,
        priceChange24h: 0,
        icon: USDT,
      },
      {
        id: 'usdc-bep20',
        name: 'USD Coin (BEP20)',
        symbol: 'USDC',
        balance: 0,
        balanceUSD: 0,
        price: 0,
        priceChange24h: 0,
        icon: USDC,
      },
      {
        id: 'bsc',
        name: 'BNB Smart Chain',
        symbol: 'BNB',
        balance: 0,
        balanceUSD: 0,
        price: 0,
        priceChange24h: 0,
        icon: BSC,
      },
    ],
    hideZeroBalances: false,
  }))

  // Update user data when Telegram initData changes
  useEffect(() => {
    setWalletData((prev) => ({
      ...prev,
      user: userData,
    }))
  }, [userData])

  const [balanceVisible, setBalanceVisible] = useState(true)
  const storeBase = useWalletStore((s) => s.baseCurrency)
  const setBase = useWalletStore((s) => s.setBaseCurrency)
  const [selectedCurrency, setSelectedCurrency] = useState(storeBase)
  const [isBalanceLoading, setIsBalanceLoading] = useState(true)
  const storeTotal = useWalletStore((s) => s.total)
  const storeLoading = useWalletStore((s) => s.loading)
  const subscribeSocket = useWalletStore((s) => s.subscribeSocket)
  const bootstrap = useWalletStore((s) => s.bootstrap)
  const createKeyring = useWalletStore((s) => s.createKeyring)
  const storeWallets = useWalletStore((s) => s.wallets)
  const storeKeyrings = useWalletStore((s) => s.keyrings)
  const storePrices = useWalletStore((s) => s.prices)
  const storeTransactions = useWalletStore((s) => s.transactions)
  const unseenCount = useWalletStore((s) => s.unseenTransactionsCount)
  const markAllTransactionsSeen = useWalletStore(
    (s) => s.markAllTransactionsSeen
  )
  const changes24h = useWalletStore((s) => s.changes24h || ({} as any))

  // Subscribe to socket once mounted
  useEffect(() => {
    subscribeSocket()
    return () => {
      /* keep socket alive globally; no-op */
    }
  }, [])

  // Reflect store totals/loading in local UI state
  useEffect(() => {
    setIsBalanceLoading(storeLoading)
    setWalletData((prev) => ({ ...prev, totalBalanceUSD: storeTotal }))
  }, [storeLoading, storeTotal])

  // When store wallets or prices change, propagate address and balances into local asset list for sheets
  useEffect(() => {
    if (!storeWallets || storeWallets.length === 0) return
    // Identity mapping for addresses; keep variants distinct
    const addrById = new Map<string, string>()
    const balById = new Map<string, number>()
    storeWallets.forEach((w) => {
      const id = String(w.chain || '').toLowerCase()
      addrById.set(id, w.address)
      balById.set(id, Number(w.balance || 0))
    })
    // Fallbacks for base and token variants to base chain addresses (receive address only)
    const ethAddr = addrById.get('ethereum')
    const bscAddr = addrById.get('bsc')
    const tronAddr = addrById.get('tron')
    // If no explicit BSC wallet returned, reuse ETH address (EVM-compatible)
    if (!bscAddr && ethAddr) {
      addrById.set('bsc', ethAddr)
    }
    // ERC20 variants reuse ETH address
    if (ethAddr) {
      addrById.set('usdt-erc20', ethAddr)
      addrById.set('usdc-erc20', ethAddr)
    }
    // BEP20 variants reuse BSC address, or fallback to ETH if BSC missing
    const bscOrEth = addrById.get('bsc') || ethAddr
    if (bscOrEth) {
      addrById.set('usdt-bep20', bscOrEth)
      addrById.set('usdc-bep20', bscOrEth)
    }
    // TRC20 variants reuse TRON address
    if (tronAddr) {
      addrById.set('usdt-trc20', tronAddr)
    }
    const priceId = (id: string): string => {
      const low = String(id || '').toLowerCase()
      if (low.startsWith('usdt-')) return 'usdt'
      if (low.startsWith('usdc-')) return 'usdc'
      return id
    }
    setWalletData((prev) => ({
      ...prev,
      assets: prev.assets.map((a) => {
        const pid = priceId(a.id)
        const price = (storePrices as any)[pid] || 0
        const change = (changes24h as any)[pid] ?? a.priceChange24h ?? 0
        const balance = balById.has(a.id)
          ? Number(balById.get(a.id))
          : a.balance || 0
        const address =
          addrById.get(String(a.id || '').toLowerCase()) || a.address
        const balanceUSD = Number(balance) * Number(price || 0)
        return {
          ...a,
          address,
          balance,
          balanceUSD,
          price: price || a.price || 0,
          priceChange24h: Number(change),
        }
      }),
    }))
  }, [storeWallets, storePrices, changes24h])

  // When base currency changes, update via store
  // Keep local state in sync when store (or preferences) change
  useEffect(() => {
    if (selectedCurrency !== storeBase) {
      setSelectedCurrency(storeBase)
    }
  }, [storeBase])

  // When user changes local selection, persist to store/backend
  useEffect(() => {
    if (selectedCurrency !== storeBase) {
      setBase(selectedCurrency)
    }
  }, [selectedCurrency])

  // Get latest 5 transactions for home page display
  const recentTransactions = storeTransactions.slice(0, 5)

  const handleSend = () => {
    setSendOpen(true)
  }

  const handleReceive = () => {
    setReceiveOpen(true)
  }

  const handleHistory = () => {
    navigate('/history')
  }

  const handleHome = () => {
    navigate('/dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAssetClick = (asset: CryptoAsset) => {
    console.log('Asset clicked:', asset)
    // TODO: Navigate to asset detail page
  }

  const handleTransactionClick = (transaction: TransactionType) => {
    console.log('Transaction clicked:', transaction)
    // TODO: Navigate to transaction detail page
  }

  const [sendOpen, setSendOpen] = useState(false)
  const [receiveOpen, setReceiveOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleToggleZeroBalances = () => {
    setWalletData((prev) => ({
      ...prev,
      hideZeroBalances: !prev.hideZeroBalances,
    }))
  }

  const handleNotificationClick = () => {
    markAllTransactionsSeen()
    navigate('/history')
  }

  const handleRefresh = async () => {
    if (isRefreshing) return // Prevent multiple simultaneous refreshes

    setIsRefreshing(true)
    try {
      // Skip preferences fetch on manual refresh; preferences load elsewhere on demand
      await bootstrap({ skipPreferences: true })

      // Brief success feedback
      setTimeout(() => {
        setIsRefreshing(false)
      }, 800) // Keep spinner for at least 800ms for visual feedback
    } catch (error) {
      console.error('Refresh failed:', error)
      setIsRefreshing(false)
    }
  }

  return (
    <Page back={false}>
      <div style={{ background: '#0A0D12', minHeight: '100vh' }}>
        <div className="px-3 sm:px-5 pb-28">
          <div className="flex items-center justify-between">
            <WalletHeader
              user={walletData.user}
              onNotificationClick={handleNotificationClick}
              notificationCount={unseenCount}
            />
            <button
              aria-label={isRefreshing ? 'Refreshing...' : 'Refresh'}
              title={isRefreshing ? 'Refreshing...' : 'Refresh'}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`ml-2 w-10 h-10 flex items-center justify-center rounded-full border border-zinc-700 transition-all duration-200 ${
                isRefreshing
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:bg-zinc-800 active:opacity-80 cursor-pointer'
              }`}
              style={{
                background:
                  'radial-gradient(232.26% 131.83% at 4.47% 1.52%, #252B31 0%, rgba(27,32,37,0.50) 100%)',
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#EBEFF0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isRefreshing ? 'animate-spin' : ''}
                style={{ transformOrigin: 'center' }}>
                <path d="M21 2v6h-6" />
                <path d="M3 22v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L21 8" />
                <path d="M20.49 15a9 9 0 0 1-14.85 3.36L3 16" />
              </svg>
            </button>
          </div>

          <BalanceDisplay
            balance={walletData.totalBalanceUSD}
            currency={selectedCurrency}
            isVisible={balanceVisible}
            onToggleVisibility={() => setBalanceVisible(!balanceVisible)}
            onCurrencyChange={setSelectedCurrency}
            onSend={handleSend}
            onReceive={handleReceive}
            onHistory={handleHistory}
            loading={isBalanceLoading}
          />

          {storeKeyrings.length === 0 ? (
            <div className="px-4 py-10 text-center text-neutral-300">
              <div className="text-lg font-semibold mb-3">
                Set up your wallet
              </div>
              <div className="text-sm opacity-80 mb-6">
                Create a new wallet or import an existing one to get started.
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-semibold"
                  onClick={async () => {
                    try {
                      await createKeyring('My Wallet')
                    } catch {}
                  }}>
                  Create
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-white text-sm font-semibold border border-zinc-700"
                  onClick={() => {
                    navigate('/settings')
                  }}>
                  Import
                </button>
              </div>
            </div>
          ) : (
            <AssetList
              assets={walletData.assets}
              hideZeroBalances={walletData.hideZeroBalances}
              onAssetClick={handleAssetClick}
              onToggleZeroBalances={handleToggleZeroBalances}
            />
          )}

          <TransactionHistory
            transactions={recentTransactions}
            onTransactionClick={handleTransactionClick}
            onSeeAllClick={() => navigate('/history')}
          />
        </div>
        <FloatingMenu
          onHome={handleHome}
          onSwap={handleSend}
          onReceive={handleReceive}
          onSettings={() => navigate('/settings')}
        />
        {sendOpen && (
          <SendSheet
            assets={walletData.assets}
            onClose={() => setSendOpen(false)}
          />
        )}
        {receiveOpen && (
          <ReceiveSheet
            assets={walletData.assets}
            onClose={() => setReceiveOpen(false)}
          />
        )}

        {/* Full Layout Overlay Spinner */}
        {isRefreshing && (
          <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-[#12151A]/90 backdrop-blur border border-zinc-700/50">
              {/* Spinner */}
              <div className="relative">
                <div className="w-12 h-12 border-4 border-zinc-600 border-t-blue-500 rounded-full animate-spin"></div>
                <div
                  className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-400/50 rounded-full animate-spin"
                  style={{
                    animationDirection: 'reverse',
                    animationDuration: '1.5s',
                  }}></div>
              </div>

              {/* Loading Text */}
              <div className="text-center">
                <p className="text-white font-medium text-base">
                  Refreshing...
                </p>
                <p className="text-zinc-400 text-sm mt-1">
                  Updating wallet data
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Page>
  )
}
