import { SecureStorage } from '@plasmohq/storage/secure'

const API_BASE = process.env.PLASMO_PUBLIC_API_BASE || '/'

function getOrCreateBrowserId(): string {
  try {
    const key = 'zenx_browser_id'
    const existing = localStorage.getItem(key)
    if (existing && existing.length > 10) return existing
    // RFC4122 v4-like simple generator
    const rnd = (n = 16) => Array.from(crypto.getRandomValues(new Uint8Array(n))).map((b) => b.toString(16).padStart(2, '0')).join('')
    const uuid = `${rnd(4)}-${rnd(2)}-${rnd(2)}-${rnd(2)}-${rnd(6)}`
    localStorage.setItem(key, uuid)
    return uuid
  } catch {
    // Fallback if storage or crypto unavailable
    return String(Math.random()).slice(2)
  }
}

// Secure storage for client secret (encrypted-at-rest by Plasmo)
const secureStorage = new SecureStorage()
let secureInit: Promise<void> | null = null

async function initSecurePassword(): Promise<void> {
  if (!secureInit) {
    secureInit = (async () => {
      // Derive a stable password from the browser id to avoid persisting plaintext
      const browserId = getOrCreateBrowserId()
      const enc = new TextEncoder()
      const salt = 'zenx-wallet-secure:v1'
      const data = enc.encode(`${salt}:${browserId}`)
      const digest = await crypto.subtle.digest('SHA-256', data)
      const hex = Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      try {
        await secureStorage.setPassword(hex)
      } catch {}
    })()
  }
  return secureInit
}

async function getOrCreateSecret(): Promise<string> {
  await initSecurePassword()
  const key = 'zenx_browser_secret'
  try {
    const existing = await secureStorage.get(key)
    if (typeof existing === 'string' && existing.length >= 64) {
      return existing
    }
  } catch {}
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  const secret = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
  try {
    await secureStorage.set(key, secret)
  } catch {}
  return secret
}

async function ensureBrowserRegistered(): Promise<void> {
  try {
    const secret = await getOrCreateSecret()
    await fetch(`${API_BASE}/api/v1/browser/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ browserId: getOrCreateBrowserId(), secret })
    }).catch(() => void 0)
  } catch {}
}

async function buildHmacHeaders(method: string, urlPath: string, body: any): Promise<Record<string, string>> {
  const ts = Math.floor(Date.now() / 1000).toString()
  const payload = method.toUpperCase() + '\n' + urlPath + '\n' + ts + '\n' + (body ? JSON.stringify(body) : '')
  // Ensure secret exists in secure storage
  const secret = await getOrCreateSecret()
  const keyBytes = new Uint8Array((secret || '').match(/.{1,2}/g)!.map((h) => parseInt(h, 16)))
  const enc = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sigBuf = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(payload))
  const sig = Array.from(new Uint8Array(sigBuf)).map((b) => b.toString(16).padStart(2, '0')).join('')
  return {
    'X-Browser-Id': getOrCreateBrowserId(),
    'X-Client-Timestamp': ts,
    'X-Client-Signature': sig
  }
}

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
  await ensureBrowserRegistered()
  const auth = await buildHmacHeaders('GET', path, undefined)
  const headers = {
    'Content-Type': 'application/json',
    ...auth,
  } as Record<string, string>
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      ...headers,
    },
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`GET ${path} ${res.status}`)
  return res.json()
}

export async function apiPost<T>(path: string, body?: any): Promise<T> {
  await ensureBrowserRegistered()
  const auth = await buildHmacHeaders('POST', path, body || undefined)
  const headers = {
    'Content-Type': 'application/json',
    ...auth,
  } as Record<string, string>
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      ...headers,
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
