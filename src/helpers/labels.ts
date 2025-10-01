/**
 * Label helpers for displaying asset names/symbols with network context
 *
 * Usage:
 * - Import from `@/helpers/labels` wherever you render asset names/symbols.
 * - Call `getAssetDisplayName(id, symbol, name)` to get a user-facing asset name.
 * - Call `getSymbolWithNetwork(symbol)` to append network e.g., "USDT (TRC20)".
 *
 * Rules:
 * - For USDT in this app, we currently support TRC20 on TRON only → display as "USDT (TRC20)".
 * - Other assets fall back to their provided names/symbols unchanged.
 */

export function getAssetDisplayName(
  id: string,
  symbol: string,
  name: string
): string {
  const up = String(symbol || '').toUpperCase()
  const tag = (suffix: string): string =>
    suffix === 'trc20'
      ? 'TRC20'
      : suffix === 'erc20'
        ? 'ERC20'
        : suffix === 'bep20'
          ? 'BEP20'
          : suffix.toUpperCase()
  // USDT variants → "USDT (NETWORK)"
  if (id === 'usdt' || up === 'USDT') return 'USDT'
  if (id.startsWith('usdt-')) {
    const suffix = id.split('-')[1] || ''
    return `USDT (${tag(suffix)})`
  }
  // USDC variants → "USDC (NETWORK)"
  if (id === 'usdc' || up === 'USDC') return 'USDC'
  if (id.startsWith('usdc-')) {
    const suffix = id.split('-')[1] || ''
    return `USDC (${tag(suffix)})`
  }
  if (id === 'bsc' || up === 'BNB') return 'BNB'
  return name
}

export function getSymbolWithNetwork(symbol: string): string {
  const up = String(symbol || '').toUpperCase()
  if (up === 'USDT') return 'USDT'
  if (up === 'USDC') return 'USDC'
  if (up === 'BNB') return 'BNB'
  return symbol
}

// Secondary label for asset cards
// - For USDT/USDC variants: returns the network (TRC20/ ERC20/ BEP20)
// - For other assets: returns the symbol (e.g., BTC)
export function getAssetNetworkLabel(id: string, symbol: string): string {
  const low = String(id || '').toLowerCase()
  if (low.startsWith('usdt-') || low.startsWith('usdc-')) {
    const suffix = low.split('-')[1] || ''
    return suffix.toUpperCase()
  }
  return String(symbol || '').toUpperCase()
}
