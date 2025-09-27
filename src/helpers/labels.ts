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

export function getAssetDisplayName(id: string, symbol: string, name: string): string {
  if (id === 'usdt' || symbol?.toUpperCase() === 'USDT') {
    return 'USDT (TRC20)';
  }
  return name;
}

export function getSymbolWithNetwork(symbol: string): string {
  if (String(symbol || '').toUpperCase() === 'USDT') {
    return 'USDT (TRC20)';
  }
  return symbol;
}


