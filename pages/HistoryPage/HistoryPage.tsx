import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '@/stores/wallet';

export const HistoryPage: FC = () => {
  const navigate = useNavigate();
  
  const transactions = useWalletStore(s => s.transactions);
  const loading = useWalletStore(s => s.transactionsLoading);

  const items = useMemo(() => {
    const fmt = (timestamp: Date) => {
      if (!timestamp || isNaN(timestamp.getTime())) return { date: '', time: '' };
      const dd = timestamp.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: '2-digit' });
      const tt = timestamp.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
      return { date: dd, time: tt };
    };
    
    return transactions.map((tx) => {
      const title = `${tx.type === 'send' ? 'Sent' : tx.type === 'receive' ? 'Received' : 'Buy'} ${tx.asset}`;
      const desc = `${tx.type === 'send' ? '-' : '+'}${tx.amount.toFixed(8).replace(/\.?0+$/, '')} ${tx.asset}`;
      const { date, time } = fmt(tx.timestamp);
      return { id: tx.id, title, desc, date, time, raw: tx };
    });
  }, [transactions]);

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
          <div className="text-gray-100 text-base font-bold">Transaction History</div>
          <div className="w-12 h-12 p-2.5 rounded-[50px]" />
        </div>
      </div>

      {/* List */}
      <div className="px-4 pb-28">
        <div className="w-full inline-flex flex-col gap-2">
          {(!loading && items.length === 0) && (
            <div className="text-neutral-400 text-sm px-2 py-6 text-center">No transactions yet</div>
          )}
          {items.map((item) => (
            <button onClick={() => navigate(`/transaction/${item.id}`, { state: item.raw })} key={item.id} className="text-left self-stretch px-4 py-3 bg-neutral-900 rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-800 flex flex-col gap-2.5">
              <div className="self-stretch inline-flex justify-between items-start">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 p-2.5 bg-neutral-800 rounded-[50px] flex justify-center items-center overflow-hidden">
                    {(() => {
                      const t = item.raw.type;
                      const src = t === 'send' ? '/send-icon.png' : t === 'receive' ? '/receive-icon.png' : '/transaction-history.png';
                      return <img src={src} alt={t} className="w-5 h-5" />;
                    })()}
                  </div>
                  <div className="inline-flex flex-col items-start gap-1 min-w-0">
                    <div className="text-gray-100 text-base font-medium leading-snug truncate max-w-[65vw]">{item.title}</div>
                    <div className="text-neutral-400 text-sm font-medium leading-tight truncate max-w-[60vw]">{item.desc}</div>
                  </div>
                </div>
                <div className="inline-flex flex-col items-end gap-1 shrink-0">
                  <div className="text-right text-neutral-400 text-xs sm:text-sm font-medium leading-tight whitespace-nowrap">{item.date}</div>
                  <div className="text-right text-neutral-400 text-xs sm:text-sm font-medium leading-tight whitespace-nowrap">{item.time}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Glows */}
      <div className="pointer-events-none fixed right-6 top-44 w-20 h-72 rotate-[-36.73deg] bg-blue-500 blur-3xl" />
      <div className="pointer-events-none fixed right-0 top-24 w-20 h-72 rotate-[-36.73deg] bg-blue-300 blur-3xl opacity-50" />
    </div>
  );
};


