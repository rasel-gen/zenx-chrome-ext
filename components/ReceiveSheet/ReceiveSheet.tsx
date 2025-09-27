import React from 'react';
import { CryptoAsset } from '@/types/wallet';
import { ReceiveAssetSheet } from '@/components/ReceiveAssetSheet/ReceiveAssetSheet.tsx';
import { getAssetDisplayName } from '@/helpers/labels';

interface ReceiveSheetProps {
  assets: CryptoAsset[];
  onClose: () => void;
}

export const ReceiveSheet: React.FC<ReceiveSheetProps> = ({ assets, onClose }) => {
  const [selected, setSelected] = React.useState<CryptoAsset | null>(null);
  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/95 overflow-hidden">
      {/* Blue glows */}
      <div className="pointer-events-none fixed right-6 top-10 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-500" />
      <div className="pointer-events-none fixed right-0 top-2 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-300 opacity-50" />

      {/* Header */}
      <div className="w-full px-4 pt-4 flex justify-between items-center">
        <button
          className="flex w-12 h-12 p-2.5 justify-center items-center rounded-[50px] border border-[color:var(--Radial,#252B31)]"
          style={{ background: 'radial-gradient(232.26% 131.83% at 4.47% 1.52%, #252B31 0%, rgba(27,32,37,0.50) 100%)' }}
          onClick={onClose}
          aria-label="Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0" style={{ aspectRatio: '1 / 1' }}>
            <path d="M3.33318 10H16.6665" stroke="#EBEFF0" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.4997 14.1667C7.4997 14.1667 3.33307 11.098 3.33305 10C3.33305 8.90204 7.49972 5.83337 7.49972 5.83337" stroke="#EBEFF0" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="text-gray-100 text-base font-bold">Receive Fund</div>
        <div className="w-12 h-12 p-2.5 rounded-[50px]" />
      </div>

      {/* List */}
      <div className="px-4 mt-6 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
        {assets.map((a) => (
          <button
            key={a.id}
            className="w-full p-4 rounded-2xl border-[1.5px] flex justify-between items-center text-left"
            style={{ backgroundColor: 'var(--Shading, #12151A)', borderColor: 'var(--Stock, #25282F)' }}
            onClick={() => setSelected(a)}
          >
            <div className="flex items-center gap-3">
              <img
                src={a.icon}
                alt={a.name}
                className="rounded-full"
                style={{ width: '42px', height: '42px', aspectRatio: '1 / 1' }}
              />
              <div className="inline-flex flex-col items-start">
                <div className="text-gray-100 text-base font-semibold leading-snug">{getAssetDisplayName(a.id, a.symbol, a.name)}</div>
                <div className="text-neutral-400 text-sm font-medium leading-tight">{a.symbol}</div>
              </div>
            </div>
            <div className="w-10 h-10 bg-neutral-800 rounded-[50px] outline outline-1 outline-offset-[-1px] outline-zinc-800 flex justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none" className="flex-shrink-0" style={{ aspectRatio: '1 / 1' }}>
                <path d="M7.50004 5.5C7.50004 5.5 12.5 9.18242 12.5 10.5C12.5 11.8177 7.5 15.5 7.5 15.5" stroke="#EBEFF0" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom gradient */}
      <div className="pointer-events-none fixed bottom-0 left-0 w-full h-28 bg-gradient-to-b from-zinc-950/0 to-zinc-950 backdrop-blur-[2px]" />

      {selected && <ReceiveAssetSheet asset={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};


