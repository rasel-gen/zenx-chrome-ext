// Centralized minimum send amounts per asset (in asset units)
// Defaults chosen to avoid dust/fee failures. Can be overridden via env.

const env = (key: string, fallback: number): number => {
  const v = process.env[key as any]
  const n = typeof v === "string" ? Number(v) : NaN
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export const MIN_SEND = {
  BTC: env("PLASMO_PUBLIC_MIN_SEND_BTC", 0.00001),
  ETH: env("PLASMO_PUBLIC_MIN_SEND_ETH", 0.00021),
  TRX: env("PLASMO_PUBLIC_MIN_SEND_TRX", 2),
  USDT: env("PLASMO_PUBLIC_MIN_SEND_USDT_TRC20", 1)
} as const

export function getMinSendForSymbol(symbol: string): number {
  const s = (symbol || "").toUpperCase()
  if (s in MIN_SEND) return (MIN_SEND as any)[s] as number
  return 0 // unknown -> no extra floor
}
