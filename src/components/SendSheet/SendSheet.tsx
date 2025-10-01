import { SendAssetSheet } from '@/components/SendAssetSheet/SendAssetSheet'
import { getAssetDisplayName, getAssetNetworkLabel } from '@/helpers/labels'
import { CryptoAsset } from '@/types/wallet'
import arrowSendIcon from 'data-base64:@assets/public/arrow-send.png'
import React from 'react'

interface SendSheetProps {
  assets: CryptoAsset[]
  onClose: () => void
}

export const SendSheet: React.FC<SendSheetProps> = ({ assets, onClose }) => {
  const [selected, setSelected] = React.useState<CryptoAsset | null>(null)
  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/95">
      {/* Blue glows */}
      <div className="pointer-events-none fixed right-6 top-10 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-500 opacity-90" />
      <div className="pointer-events-none fixed right-0 top-2 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-300 opacity-50" />

      {/* Header */}
      <div className="w-full px-4 pt-4 flex justify-between items-center">
        <button
          className="flex w-12 h-12 p-2.5 justify-center items-center rounded-[50px] border border-[color:var(--Radial,#252B31)]"
          style={{
            background:
              'radial-gradient(232.26% 131.83% at 4.47% 1.52%, #252B31 0%, rgba(27,32,37,0.50) 100%)',
          }}
          onClick={onClose}
          aria-label="Back">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="flex-shrink-0"
            style={{ aspectRatio: '1 / 1' }}>
            <path
              d="M3.33318 10H16.6665"
              stroke="#EBEFF0"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.4997 14.1667C7.4997 14.1667 3.33307 11.098 3.33305 10C3.33305 8.90204 7.49972 5.83337 7.49972 5.83337"
              stroke="#EBEFF0"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="text-gray-100 text-base font-bold">Send Fund</div>
        <div className="w-12 h-12 p-2.5 rounded-[50px]" />
      </div>

      {/* List */}
      <div
        className="px-4 mt-6 space-y-3 overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 140px)' }}>
        {assets.map((a) => (
          <button
            key={a.id}
            className={`w-full p-4 bg-neutral-900 rounded-2xl outline outline-[1.5px] outline-offset-[-1.5px] outline-zinc-800 flex justify-between items-center text-left hover:bg-neutral-800 transition-colors`}
            onClick={() => a.balance > 0 && setSelected(a)}
            disabled={a.balance === 0}>
            <div className="flex items-center gap-3">
              <img
                src={a.icon}
                alt={a.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="inline-flex flex-col items-start gap-2">
                <div className="text-gray-100 text-base font-semibold leading-snug">
                  {getAssetDisplayName(a.id, a.symbol, a.name)}
                </div>
                <div className="text-neutral-400 text-sm font-medium leading-tight">
                  {getAssetNetworkLabel(a.id, a.symbol)}
                </div>
              </div>
            </div>
            <div className="w-36 flex justify-between items-center">
              <div className="inline-flex flex-col items-start gap-2">
                <div className="text-gray-100 text-base font-medium leading-snug">
                  {a.balance.toFixed(4)} {a.symbol}
                </div>
                <div className="text-gray-100 text-base font-medium leading-snug">
                  ${a.balanceUSD.toFixed(2)}
                </div>
              </div>
              <div className="w-10 h-10 bg-neutral-800 rounded-[50px] outline outline-1 outline-offset-[-1px] outline-zinc-800 flex justify-center items-center">
                <img
                  src={arrowSendIcon}
                  alt=""
                  className="w-5 h-5 brightness-0 invert opacity-80"
                />
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <SendAssetSheet asset={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
