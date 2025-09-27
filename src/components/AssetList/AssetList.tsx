/**
 * AssetList Component
 *
 * Usage:
 * - Displays list of crypto assets with balances and prices
 * - Shows/hides zero balance assets based on toggle
 * - Includes price change indicators with colors
 * - Asset icons and formatted balance display
 * - Click handlers for individual assets
 *
 * Props:
 * - assets: Array of crypto assets to display
 * - hideZeroBalances: Whether to hide assets with zero balance
 * - onAssetClick?: Callback for asset selection
 * - onToggleZeroBalances?: Callback for hide/show toggle
 */

import { FIAT_SYMBOLS } from "@/config/fiats"
import { useWalletStore } from "@/stores/wallet"
import { CryptoAsset } from "@/types/wallet"
import React from "react"

interface AssetListProps {
  assets: CryptoAsset[]
  hideZeroBalances: boolean
  onAssetClick?: (asset: CryptoAsset) => void
  onToggleZeroBalances?: () => void
}

export const AssetList: React.FC<AssetListProps> = ({
  assets,
  hideZeroBalances,
  onAssetClick,
  onToggleZeroBalances
}) => {
  const baseCurrency = useWalletStore((s) => s.baseCurrency)
  const currencySymbol = FIAT_SYMBOLS[baseCurrency] ?? ""
  const filteredAssets = hideZeroBalances
    ? assets.filter((asset) => asset.balance > 0)
    : assets

  const formatBalance = (balance: number, symbol: string) => {
    return `${balance.toFixed(8).replace(/\.?0+$/, "")} ${symbol}`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price)
  }

  const formatBaseBalance = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatPriceChange = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(2)}%`
  }

  return (
    <div className="pb-5">
      <div className="flex justify-between items-center mb-4">
        <h2
          className="m-0 text-lg font-semibold"
          style={{ color: "var(--color-text)" }}>
          Your Assets
        </h2>
        <button
          className="bg-transparent border-none text-sm cursor-pointer px-2 py-1 rounded-md transition-all"
          style={{ color: "var(--color-accent)" }}
          onClick={onToggleZeroBalances}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--color-secondary-bg)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }>
          {hideZeroBalances ? "Show" : "Hide"} 0 Balance
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filteredAssets.map((asset) => {
          const base = formatBaseBalance(asset.balanceUSD)
          const [baseInt, baseDecRaw] = base.split(".") as [string, string?]
          const baseDec = baseDecRaw ?? "00"
          return (
            <div
              key={asset.id}
              className="self-stretch p-4 rounded-2xl border-[1.5px] inline-flex flex-col justify-start items-start gap-6 cursor-pointer transition-all hover:opacity-80 active:scale-[0.99]"
              onClick={() => onAssetClick?.(asset)}
              style={{
                backgroundColor: "rgba(18, 21, 26, 0.88)",
                borderColor: "var(--Stock, #25282F)",
                backdropFilter: "blur(6px)"
              }}>
              <div className="inline-flex items-center gap-3">
                <img
                  src={asset.icon}
                  alt={asset.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="inline-flex flex-col items-start">
                  <div className="text-gray-100 text-base font-semibold leading-snug">
                    {asset.name}
                  </div>
                  <div className="text-neutral-400 text-base font-semibold leading-snug">
                    {formatBalance(asset.balance, asset.symbol)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2">
                <div className="justify-center">
                  <span className="text-gray-100 text-2xl font-bold leading-relaxed tracking-wide">
                    {currencySymbol}
                    {baseInt}
                  </span>
                  <span className="text-neutral-400 text-2xl font-medium leading-relaxed tracking-wide">
                    .{baseDec}
                  </span>
                </div>
                <div className="inline-flex items-start gap-2">
                  <div className="text-neutral-400 text-sm font-medium leading-tight">
                    {currencySymbol}
                    {formatPrice(asset.price)}
                  </div>
                  <div
                    className={`text-sm font-medium leading-tight ${asset.priceChange24h >= 0 ? "text-green-500" : "text-rose-500"}`}>
                    {formatPriceChange(asset.priceChange24h)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {filteredAssets.length === 0 && (
          <div
            className="col-span-2 text-center py-10"
            style={{ color: "var(--color-hint)" }}>
            <p className="m-0 mb-4 text-base">No assets to display</p>
            {hideZeroBalances && (
              <button
                className="border-none rounded-xl px-4 py-2 text-sm cursor-pointer transition-all text-white"
                style={{ backgroundColor: "var(--color-accent)" }}
                onClick={onToggleZeroBalances}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                Show all assets
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
