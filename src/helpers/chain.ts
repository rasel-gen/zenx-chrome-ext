export type BackendChain =
  | 'bitcoin'
  | 'ethereum'
  | 'tron'
  | 'bsc'
  | 'usdt-trc20'

export function symbolToChain(symbol: string): BackendChain {
  const s = symbol.toUpperCase()
  if (s === 'BTC') return 'bitcoin'
  if (s === 'ETH') return 'ethereum'
  if (s === 'TRX') return 'tron'
  if (s === 'BNB') return 'bsc'
  if (s === 'USDT') return 'usdt-trc20'
  // default to ethereum
  return 'ethereum'
}

export function chainToSymbol(chain: BackendChain): string {
  if (chain === 'bitcoin') return 'BTC'
  if (chain === 'ethereum') return 'ETH'
  if (chain === 'tron') return 'TRX'
  if (chain === 'bsc') return 'BNB'
  return 'USDT'
}
