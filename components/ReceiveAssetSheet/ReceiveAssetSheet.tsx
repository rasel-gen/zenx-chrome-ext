import React from 'react';
import QRCode from 'qrcode';
import { CryptoAsset } from '@/types/wallet';
import { getAssetDisplayName, getSymbolWithNetwork } from '@/helpers/labels';

interface ReceiveAssetSheetProps {
  asset: CryptoAsset;
  onClose: () => void;
}

export const ReceiveAssetSheet: React.FC<ReceiveAssetSheetProps> = ({ asset, onClose }) => {
  const address = asset.address || '';
  const [copied, setCopied] = React.useState<boolean>(false);
  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address)
      .then(() => {
        const wa: any = (window as any)?.Telegram?.WebApp;
        try { wa?.HapticFeedback?.notificationOccurred?.('success'); } catch {}
        // Inline visual feedback as reliable UX
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
        // Best-effort popup/alert for TG (won't block UI if unavailable)
        try { wa?.showPopup?.({ title: 'Copied', message: 'Address copied' }); } catch {}
        try { wa?.showAlert?.('Address copied'); } catch {}
      })
      .catch(() => void 0);
  };

  const handleShare = async () => {
    if (!address) return;
    const symbolLabel = getSymbolWithNetwork(asset.symbol);
    const title = `Receive ${symbolLabel}`;
    const text = `${symbolLabel} address:\n${address}`;

    // Try Web Share API with QR image file if supported
    try {
      let files: File[] | undefined;
      const respOk = qrDataUrl && qrDataUrl.startsWith('data:');
      if (respOk) {
        const resp = await fetch(qrDataUrl);
        const blob = await resp.blob();
        const file = new File([blob], `${symbolLabel}-address.png`, { type: 'image/png' });
        if ((navigator as any)?.canShare?.({ files: [file] })) {
          files = [file];
        }
      }
      if (navigator.share) {
        await navigator.share(files ? { title, text, files } : { title, text });
        return;
      }
    } catch {}

    // Fallback: Telegram alert with address (user can copy)
    const wa: any = (window as any)?.Telegram?.WebApp;
    try { wa?.showAlert?.(text); return; } catch {}
    try { alert(text); } catch {}
  };
  const [qrDataUrl, setQrDataUrl] = React.useState<string>('');
  React.useEffect(() => {
    let mounted = true;
    if (address) {
      QRCode.toDataURL(address, { width: 288, margin: 1, color: { dark: '#ffffff', light: '#12151A' } })
        .then((url: string) => { if (mounted) setQrDataUrl(url); })
        .catch(() => { if (mounted) setQrDataUrl(''); });
    } else {
      setQrDataUrl('');
    }
    return () => { mounted = false; };
  }, [address]);
  return (
    <div className="fixed inset-0 z-[60] bg-zinc-950/95 overflow-y-auto">
      {/* Blue glows */}
      <div className="pointer-events-none fixed right-6 top-10 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-500" />
      <div className="pointer-events-none fixed right-0 top-2 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-300 opacity-50" />

      {/* Header */}
      <div className="w-full px-4 pt-4 flex justify-between items-center sticky top-0">
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
        <div className="text-gray-100 text-base font-bold">Receive {getSymbolWithNetwork(asset.symbol)}</div>
        <div className="w-12 h-12 p-2.5 rounded-[50px]" />
      </div>

      {/* Card */}
      <div className="px-4 mt-6 pb-6">
        <div
          className="w-full flex flex-col items-center gap-6 rounded-2xl border px-4 py-6"
          style={{ backgroundColor: 'var(--Shading, #12151A)', borderColor: 'var(--Stock, #25282F)' }}
        >
          {/* Network row */}
          <div className="inline-flex justify-center items-start gap-2">
            <div className="text-neutral-400 text-sm font-medium leading-tight">Network:</div>
            <div className="text-gray-100 text-sm font-medium leading-tight">{getAssetDisplayName(asset.id, asset.symbol, asset.name)}</div>
          </div>

          {/* QR code */}
          <div className="w-72 h-72 bg-zinc-900 rounded-xl flex items-center justify-center" style={{ border: '1px solid #3F3F46' }}>
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code" className="w-64 h-64" />
            ) : (
              <div className="text-neutral-500 text-sm">No address</div>
            )}
          </div>

          {/* Divider */}
          <div className="self-stretch h-px" style={{ outline: '1px solid #3F3F46', outlineOffset: '-0.5px' }} />

          {/* Address row with copy */}
          <div className="self-stretch h-14 p-3.5 bg-neutral-800 rounded-xl border border-zinc-800 inline-flex justify-between items-center">
            <div className="text-neutral-400 text-sm font-medium leading-tight truncate">{address || 'No address available'}</div>
            <button className="w-6 h-6 flex items-center justify-center" aria-label="Copy" onClick={handleCopy} disabled={!address}>
              <img src="/copy-01.png" alt="Copy" className="w-5 h-5" />
            </button>
          </div>
          {copied && (
            <div className="self-stretch text-center text-emerald-400 text-sm font-medium leading-tight" aria-live="assertive">
              Copied to clipboard
            </div>
          )}

          {/* Info rows with alert icon */}
          <div className="self-stretch flex flex-col justify-start items-start gap-6">
            <div className="self-stretch inline-flex justify-between items-start">
              <div className="text-neutral-400 text-sm font-medium leading-tight">Minimum amount</div>
              <div className="text-gray-100 text-sm font-medium leading-tight">0.001 {asset.symbol}</div>
            </div>
            <div className="self-stretch inline-flex justify-start items-start gap-3">
              <div className="h-6 flex justify-start items-center">
                <img src="/alert-02.png" alt="Alert" className="w-5 h-5" />
              </div>
              <div className="flex-1 text-neutral-400 text-sm font-light leading-tight">
                The current address only supports receiving {getSymbolWithNetwork(asset.symbol)}. Sending other assets or networks will result in loss.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share button */}
      <div className="px-4 mt-4 pb-10">
        <button className="w-full h-14 p-3 bg-blue-500 rounded-2xl inline-flex justify-center items-center gap-2.5" onClick={handleShare} disabled={!address}>
          <div className="text-gray-100 text-base font-bold leading-snug">Share Address</div>
        </button>
      </div>

      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-3 py-2 bg-neutral-900 rounded-lg outline outline-1 outline-zinc-700 text-emerald-400 text-sm shadow-lg" aria-live="assertive">
          Copied to clipboard
        </div>
      )}
    </div>
  );
}
