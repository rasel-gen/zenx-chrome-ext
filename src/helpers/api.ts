const API_BASE = process.env.PLASMO_PUBLIC_API_BASE || '/'

const DUMMY_TG_DATA =
  'auth_date=1757926370&hash=some-hash&signature=some-signature&user=%7B%22first_name%22%3A%22Vladislav%22%2C%22id%22%3A1%7D'

function getLaunchData(): string {
  try {
    const lp = {}
    // Prefer v4 'tgWebAppData'. It may be a string or an object-like map.
    const data = (lp as any)?.tgWebAppData ?? (lp as any)?.initDataRaw
    if (typeof data === 'string' && data.length > 0) return data
    if (data && typeof data === 'object') {
      try {
        const usp = new URLSearchParams()
        Object.entries(data as Record<string, unknown>).forEach(
          ([key, value]) => {
            let v: string = ''
            if (key === 'auth_date') {
              if (value instanceof Date) {
                v = String(Math.floor(value.getTime() / 1000))
              } else if (typeof value === 'number') {
                v = String(Math.floor(value))
              } else if (typeof value === 'string') {
                // Use numeric seconds if provided; otherwise, try to parse into Unix seconds
                const asNum = Number(value)
                if (!Number.isNaN(asNum) && asNum > 0) {
                  v = String(Math.floor(asNum))
                } else {
                  const ms = Date.parse(value)
                  v = Number.isNaN(ms) ? '' : String(Math.floor(ms / 1000))
                }
              }
            } else if (key === 'user') {
              v = typeof value === 'string' ? value : JSON.stringify(value)
            } else {
              v = typeof value === 'string' ? value : JSON.stringify(value)
            }
            if (v !== '') usp.append(key, v)
          }
        )
        const str = usp.toString()
        if (str) return str
      } catch {}
    }
  } catch {}
  // fallback to global Telegram object if SDK not initialized yet
  // @ts-ignore
  const tg = (window as any)?.Telegram?.WebApp
  return typeof tg?.initData === 'string' ? tg.initData : ''
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'Telegram-Launch-Data': DUMMY_TG_DATA,
    },
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`GET ${path} ${res.status}`)
  return res.json()
}

export async function apiPost<T>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Telegram-Launch-Data': DUMMY_TG_DATA,
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let errorMessage = `POST ${path} ${res.status}`
    try {
      const data = await res.json()
      if (data && (data.message || data.error)) {
        errorMessage = data.message || data.error
      }
      console.log('API Error Response:', {
        status: res.status,
        data,
        errorMessage,
      })
    } catch (parseErr) {
      console.log('API Error Parse Failed:', { status: res.status, parseErr })
    }
    throw new Error(errorMessage)
  }
  return res.json()
}

// Convenience endpoints
export const api = {
  register: () => apiPost('/api/v1/telegram/register', {}),
  wallets: (opts?: { keyringId?: string }) =>
    apiGet<{ wallets: { chain: string; address: string; balance?: string }[] }>(
      `/api/v1/telegram/wallets${opts?.keyringId ? `?keyringId=${encodeURIComponent(opts.keyringId)}` : ''}`
    ),
  transfer: (payload: {
    chain: string
    toAddress: string
    amount: string
    passcode?: string
    keyringId?: string
  }) => apiPost('/api/v1/transactions/transfer', payload),
  transactions: (params: {
    address?: string
    chain?: string
    keyringId?: string
  }) =>
    apiGet<{ transactions: any[] }>(
      `/api/v1/transactions${
        params && (params.address || params.chain || params.keyringId)
          ? `?${new URLSearchParams({
              ...(params.address ? { address: params.address } : {}),
              ...(params.chain ? { chain: params.chain } : {}),
              ...(params.keyringId ? { keyringId: params.keyringId } : {}),
            }).toString()}`
          : ''
      }`
    ),
  preferences: () =>
    apiGet<{
      preferredCurrency: string
      backupEmail?: string | null
      passcodeEnabled?: boolean
    }>('/api/v1/telegram/preferences'),
  updatePreferences: (payload: {
    preferredCurrency?: string
    backupEmail?: string | null
    activeKeyringId?: string
    setPasscode?: { newPasscode: string; currentPasscode?: string }
    disablePasscode?: { currentPasscode?: string }
  }) => apiPost('/api/v1/telegram/preferences', payload),
  exportSeed: (passcode?: string) =>
    apiPost<{ mnemonic: string }>(
      '/api/v1/user-seed/export',
      passcode ? { passcode } : {}
    ),
  importSeed: (mnemonic: string) =>
    apiPost<{ addresses: Record<string, string>; custody: string }>(
      '/api/v1/user-seed/import',
      { mnemonic }
    ),
  createSeedAndWallets: () =>
    apiPost<{ wallets: { chain: string; address: string }[] }>(
      '/api/v1/user-seed/create',
      {}
    ),
  // Keyrings (multi-wallet)
  listKeyrings: () =>
    apiGet<{ keyrings: { id: string; label: string; createdAt: string }[] }>(
      '/api/v1/keyrings'
    ),
  createKeyring: (payload: { label: string }) =>
    apiPost<{
      keyring: { id: string; label: string }
      wallets: { chain: string; address: string }[]
    }>('/api/v1/keyrings/create', payload),
  importKeyring: (payload: { label: string; mnemonic: string }) =>
    apiPost<{
      keyring: { id: string; label: string }
      wallets: { chain: string; address: string }[]
    }>('/api/v1/keyrings/import', payload),
  renameKeyring: (id: string, payload: { label: string }) =>
    apiPost<{ ok: true }>(
      `/api/v1/keyrings/${encodeURIComponent(id)}`,
      payload
    ),
  exportKeyring: (id: string, passcode?: string) =>
    apiPost<{ mnemonic: string }>(
      `/api/v1/keyrings/${encodeURIComponent(id)}/export`,
      passcode ? { passcode } : {}
    ),
}

// Public endpoints (no Telegram headers)
export const publicApi = {
  xrpInfo: (address?: string) =>
    apiGet<{
      reserveBaseXrp: number
      reserveIncXrp: number
      ownerCount: number
      balanceXrp: number
      minReserveXrp: number
      feeXrp: number
      spendableXrp: number
    }>(
      `/api/v1/public/xrp-info${address ? `?address=${encodeURIComponent(address)}` : ''}`
    ),
}
