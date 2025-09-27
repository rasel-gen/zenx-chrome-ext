import { FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const TransactionDetailsPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const tx = (location.state || {}) as any;
  const isOut = tx?.direction === 'out';
  const symbol = tx?.chain === 'usdt-trc20' ? 'USDT' : (tx?.chain || '').toUpperCase();
  const amountStr = tx?.amount ? `${isOut ? '-' : '+'}${tx.amount} ${symbol}` : '';
  const statusLabel = tx?.status ? (tx.status === 'confirmed' ? 'Successful' : tx.status) : '';
  const fundsUsed = tx?.amount ? `${tx.amount} ${symbol}` : '';
  const fullHash: string = tx?.hash || tx?.txid || '';
  const hash = fullHash ? `${String(fullHash).slice(0, 6)}...${String(fullHash).slice(-4)}` : '';
  const time = tx?.timestamp ? new Date(tx.timestamp * 1000).toLocaleString() : '';
  const [copied, setCopied] = useState(false);

  const copyHash = async () => {
    if (!fullHash) return;
    let ok = false;
    try {
      await navigator.clipboard.writeText(fullHash);
      ok = true;
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = fullHash;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        ok = true;
      } catch {}
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      try {
        // @ts-ignore
        (window as any)?.Telegram?.WebApp?.showPopup?.({ title: 'Copied', message: 'Transaction hash copied' });
      } catch {}
    } else {
      try {
        // @ts-ignore
        (window as any)?.Telegram?.WebApp?.showAlert?.('Failed to copy');
      } catch {}
    }
  };

  return (
    <div className="min-h-screen relative bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="w-full sticky top-0 z-10 px-4 pt-4 pb-3 bg-zinc-950/80 backdrop-blur">
        <div className="w-full inline-flex justify-between items-center">
          <button
            className="flex w-12 h-12 p-2.5 justify-center items-center rounded-[50px] border border-[color:var(--Radial,#252B31)]"
            style={{ background: 'radial-gradient(232.26% 131.83% at 4.47% 1.52%, #252B31 0%, rgba(27,32,37,0.50) 100%)' }}
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0" style={{ aspectRatio: '1 / 1' }}>
              <path d="M3.33318 10H16.6665" stroke="#EBEFF0" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.4997 14.1667C7.4997 14.1667 3.33307 11.098 3.33305 10C3.33305 8.90204 7.49972 5.83337 7.49972 5.83337" stroke="#EBEFF0" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="text-gray-100 text-base font-bold">Payment details</div>
          <div className="w-12 h-12 p-2.5 rounded-[50px]" />
        </div>
      </div>

      {/* Card */}
      <div className="px-4 py-6">
        <div className="w-full bg-neutral-900 rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-800 inline-flex flex-col items-center gap-6 p-4">
          <div className="flex flex-col items-center gap-3">
            <div className="text-neutral-400 text-sm font-medium leading-tight">Amount</div>
            <div className="text-gray-100 text-2xl font-bold leading-loose">{amountStr}</div>
            <div className="h-8 px-3 py-2.5 bg-emerald-400/10 rounded-[50px] outline outline-1 outline-offset-[-1px] outline-emerald-400/25 inline-flex justify-center items-center gap-2 overflow-hidden">
              <div className="w-4 h-4 relative">
                <div className="w-3.5 h-3.5 left-[1.33px] top-[1.33px] absolute outline outline-1 outline-offset-[-0.50px] outline-emerald-400" />
                <div className="w-2.5 h-2 left-[5.33px] top-[3.33px] absolute outline outline-1 outline-offset-[-0.50px] outline-emerald-400" />
              </div>
              <div className="text-emerald-400 text-sm font-medium leading-tight">{statusLabel}</div>
            </div>
          </div>
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-zinc-800"></div>
          <div className="self-stretch flex flex-col items-start gap-6">
            <div className="self-stretch inline-flex justify-between items-start">
              <div className="text-neutral-400 text-sm font-medium leading-tight">Description</div>
              <div className="text-gray-100 text-sm font-medium leading-tight">{isOut ? 'Send' : 'Receive'}</div>
            </div>
            <div className="self-stretch inline-flex justify-between items-start">
              <div className="text-neutral-400 text-sm font-medium leading-tight">Time</div>
              <div className="text-gray-100 text-sm font-medium leading-tight">{time}</div>
            </div>
            <div className="self-stretch inline-flex justify-between items-start">
              <div className="text-neutral-400 text-sm font-medium leading-tight">From</div>
              <div className="text-gray-100 text-sm font-medium leading-tight truncate max-w-[60%]">{tx?.fromAddress || tx?.from || '-'}</div>
            </div>
            <div className="self-stretch inline-flex justify-between items-start">
              <div className="text-neutral-400 text-sm font-medium leading-tight">To</div>
              <div className="text-gray-100 text-sm font-medium leading-tight truncate max-w-[60%]">{tx?.toAddress || tx?.to || '-'}</div>
            </div>
            <div className="self-stretch inline-flex justify-between items-start">
              <div className="text-neutral-400 text-sm font-medium leading-tight">Funds Used</div>
              <div className="text-gray-100 text-sm font-medium leading-tight">{fundsUsed}</div>
            </div>
            <div className="self-stretch inline-flex justify-between items-start">
              <div className="text-neutral-400 text-sm font-medium leading-tight">Transaction Hash</div>
              <div className="flex items-center gap-2">
                <div className="text-gray-100 text-sm font-medium leading-tight">{hash}</div>
                <button
                  onClick={copyHash}
                  aria-label={copied ? 'Copied' : 'Copy hash'}
                  title={copied ? 'Copied' : 'Copy'}
                  className="w-8 h-8 inline-flex items-center justify-center rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-700 hover:bg-neutral-800 active:opacity-80"
                >
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A3E635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EBEFF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glows */}
      <div className="pointer-events-none fixed right-6 top-44 w-20 h-72 rotate-[-36.73deg] bg-blue-500 blur-3xl" />
      <div className="pointer-events-none fixed right-0 top-24 w-20 h-72 rotate-[-36.73deg] bg-blue-300 blur-3xl opacity-50" />
    </div>
  );
};


