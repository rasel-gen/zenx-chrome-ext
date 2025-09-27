/**
 * Price helper
 *
 * Usage:
 * - Call fetchPrices with asset ids and a base currency code (e.g., 'USD')
 * - Supported default mapping:
 *   - bitcoin → bitcoin
 *   - ethereum → ethereum
 *   - tron → tron
 *   - usdt → tether
 *
 * Notes:
 * - Uses CoinGecko's simple price API
 * - Currency code is case-insensitive; it will be lowercased for the API
 */

const DEFAULT_ID_MAP: Record<string, string> = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  tron: 'tron',
  usdt: 'tether',
};

export async function fetchPrices(
  assetIds: string[],
  baseCurrency: string,
  customMap?: Record<string, string>
): Promise<Record<string, number>> {
  const idMap = { ...DEFAULT_ID_MAP, ...(customMap || {}) };
  const geckoIds = Array.from(
    new Set(
      assetIds
        .map((id) => idMap[id] || id)
        .filter(Boolean)
    )
  );
  if (geckoIds.length === 0) return {};

  const vs = String(baseCurrency || 'USD').toLowerCase();
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
    geckoIds.join(',')
  )}&vs_currencies=${encodeURIComponent(vs)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Price API ${res.status}`);
    const data = (await res.json()) as Record<string, Record<string, number>>;
    // Build result keyed by our input asset ids
    const out: Record<string, number> = {};
    for (const assetId of assetIds) {
      const gid = idMap[assetId] || assetId;
      const price = data[gid]?.[vs];
      if (typeof price === 'number') out[assetId] = price;
    }
    return out;
  } catch {
    return {};
  }
}


/**
 * Fetch current prices and 24h change percentage for given assets.
 * Returns two maps keyed by the input asset ids: { prices, changes }.
 * Uses CoinGecko simple price with include_24hr_change=true.
 */
export async function fetchPricesAndChange(
  assetIds: string[],
  baseCurrency: string,
  customMap?: Record<string, string>
): Promise<{ prices: Record<string, number>; changes: Record<string, number> }> {
  const idMap = { ...DEFAULT_ID_MAP, ...(customMap || {}) };
  const geckoIds = Array.from(new Set(assetIds.map((id) => idMap[id] || id).filter(Boolean)));
  if (geckoIds.length === 0) return { prices: {}, changes: {} };

  const vs = String(baseCurrency || 'USD').toLowerCase();
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
    geckoIds.join(',')
  )}&vs_currencies=${encodeURIComponent(vs)}&include_24hr_change=true`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Price API ${res.status}`);
    const data = (await res.json()) as Record<string, Record<string, number>>;
    const prices: Record<string, number> = {};
    const changes: Record<string, number> = {};
    for (const assetId of assetIds) {
      const gid = idMap[assetId] || assetId;
      const price = data[gid]?.[vs];
      const change = data[gid]?.[`${vs}_24h_change`];
      if (typeof price === 'number') prices[assetId] = price;
      if (typeof change === 'number') changes[assetId] = change;
    }
    return { prices, changes };
  } catch {
    return { prices: {}, changes: {} };
  }
}


