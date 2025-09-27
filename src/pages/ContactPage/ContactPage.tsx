/**
 * ContactPage Component
 *
 * Usage:
 * - Dedicated page for contacting support/community via Telegram and X (Twitter)
 * - Follows the modal page style (Send/Receive) with back header and background glows
 *
 * Links:
 * - Telegram: https://t.me/zenxchange
 * - X (Twitter): https://x.com/zenxchange
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Open an external URL from within the Telegram WebApp or a regular browser.
 * Logic:
 * - If `Telegram.WebApp.openLink` exists, use it and return
 * - Otherwise, try `window.open` in a new tab with noopener/noreferrer
 * - If pop-up is blocked, fall back to setting `window.location.href`
 */
const openLink = (url: string) => {
  // @ts-ignore
  const wa = (window as any)?.Telegram?.WebApp;
  if (wa && typeof wa.openLink === 'function') {
    try {
      wa.openLink(url, { try_instant_view: false });
      return;
    } catch {}
  }

  const newWin = window.open(url, '_blank', 'noopener,noreferrer');
  if (!newWin) {
    window.location.href = url;
  }
};

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--Background, #0A0D12)' }}>
      {/* Blue glows */}
      <div className="pointer-events-none fixed right-6 top-10 w-20 h-72 rotate-[36.73deg] blur-3xl bg-blue-500" />
      <div className="pointer-events-none fixed right-0 top-2 w-20 h-72 rotate-[36.73deg] blur-3xl bg-blue-300 opacity-50" />

      {/* Header */}
      <div className="w-full px-4 pt-4 flex justify-between items-center">
        <button
          className="flex w-12 h-12 p-2.5 justify-center items-center rounded-[50px] border border-[color:var(--Radial,#252B31)]"
          style={{ background: 'radial-gradient(232.26% 131.83% at 4.47% 1.52%, #252B31 0%, rgba(27,32,37,0.50) 100%)' }}
          onClick={() => navigate('/settings')}
          aria-label="Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0" style={{ aspectRatio: '1 / 1' }}>
            <path d="M3.33318 10H16.6665" stroke="#EBEFF0" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.4997 14.1667C7.4997 14.1667 3.33307 11.098 3.33305 10C3.33305 8.90204 7.49972 5.83337 7.49972 5.83337" stroke="#EBEFF0" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="text-gray-100 text-base font-bold">Contact us</div>
        <div className="w-12 h-12 p-2.5 rounded-[50px]" />
      </div>

      {/* Contact cards */}
      <div className="px-4 mt-6">
        <div className="w-full h-72 px-3.5 py-14 bg-gradient-to-b from-[#12151A] to-[#0A0D12] rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#25282F] flex justify-center items-start gap-12">
          {/* Telegram */}
          <button
            onClick={() => openLink('https://t.me/zenxchange')}
            className="inline-flex flex-col justify-center items-center gap-2 active:opacity-80"
          >
            <div className="w-20 h-20 p-2.5 bg-neutral-900 rounded-[50px] outline outline-1 outline-zinc-800 backdrop-blur-[20px] inline-flex justify-center items-center gap-2.5">
              <img src="/bxl_telegram.png" alt="Telegram" className="w-9 h-9" />
            </div>
            <div className="justify-center text-gray-100 text-lg font-medium font-['Manrope'] leading-7">Telegram</div>
          </button>

          {/* X / Twitter */}
          <button
            onClick={() => openLink('https://x.com/zenxchange')}
            className="inline-flex flex-col justify-center items-center gap-2 active:opacity-80"
          >
            <div className="w-20 h-20 p-2.5 bg-neutral-900 rounded-[50px] outline outline-1 outline-zinc-800 backdrop-blur-[20px] inline-flex justify-center items-center gap-2.5">
              <img src="/prime_twitter.png" alt="X" className="w-9 h-9" />
            </div>
            <div className="justify-center text-gray-100 text-lg font-medium font-['Manrope'] leading-7">Twitter</div>
          </button>
        </div>
      </div>
    </div>
  );
};


