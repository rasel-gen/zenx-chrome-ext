import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '@/components/Page.tsx';

export const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Page back={true}>
      <div className="min-h-screen relative bg-zinc-950 overflow-hidden">
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
            <div className="text-gray-100 text-base font-bold">Privacy Policy</div>
            <div className="w-12 h-12 p-2.5 rounded-[50px]" />
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="flex flex-col gap-3 text-neutral-300 text-sm leading-relaxed">
            <p>
              We respect your privacy. ZenX Wallet does not sell your data. We only use your Telegram account
              identifier to create and manage wallets for supported networks, and to provide basic app features.
            </p>
            <p>
              We do not store private keys in this app. Addresses and balances may be queried from public blockchain
              APIs solely to display your wallet information.
            </p>
            <p>
              If you have questions about this policy, contact us via the Telegram bot.
            </p>
          </div>
        </div>
      </div>
    </Page>
  );
};


