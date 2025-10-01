/**
 * SeedPhraseModal Component
 *
 * Usage:
 * - Modal popup for displaying seed phrase with copy functionality
 * - Follows app's standard modal patterns (overlay, blue glows, consistent styling)
 * - Includes warning text and secure display of mnemonic words
 * - Copy button with haptic feedback and visual confirmation
 * - Security-focused design with proper spacing and readability
 *
 * Props:
 * - mnemonic: string - The seed phrase to display
 * - onClose: () => void - Function to close the modal
 *
 * Features:
 * - Word grid layout for better readability
 * - Copy to clipboard with visual feedback
 * - Security warning for user awareness
 * - Consistent styling with app theme
 */

import alertIcon from 'data-base64:@assets/public/alert-02.png'
import copyIcon from 'data-base64:@assets/public/copy-01.png'
import React, { useState } from 'react'

interface SeedPhraseModalProps {
  mnemonic: string
  onClose: () => void
}

export const SeedPhraseModal: React.FC<SeedPhraseModalProps> = ({
  mnemonic,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false)

  const handleCopy = () => {
    if (!mnemonic) return
    navigator.clipboard
      .writeText(mnemonic)
      .then(() => {
        const wa: any = (window as any)?.Telegram?.WebApp
        try {
          wa?.HapticFeedback?.notificationOccurred?.('success')
        } catch {}
        // Inline visual feedback as reliable UX
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        // Best-effort popup/alert for TG (won't block UI if unavailable)
        try {
          wa?.showPopup?.({
            title: 'Copied',
            message: 'Recovery phrase copied to clipboard',
          })
        } catch {}
        try {
          wa?.showAlert?.('Recovery phrase copied to clipboard')
        } catch {}
      })
      .catch(() => void 0)
  }

  // Split mnemonic into words for display
  const words = mnemonic.trim().split(/\s+/)

  return (
    <div className="fixed inset-0 z-[60] bg-zinc-950/95 overflow-y-auto">
      {/* Blue glows */}
      <div className="pointer-events-none fixed right-6 top-10 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-500" />
      <div className="pointer-events-none fixed right-0 top-2 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-300 opacity-50" />

      {/* Header */}
      <div className="w-full px-4 pt-4 flex justify-between items-center sticky top-0">
        <button
          className="flex w-12 h-12 p-2.5 justify-center items-center rounded-[50px] border border-[color:var(--Radial,#252B31)]"
          style={{
            background:
              'radial-gradient(232.26% 131.83% at 4.47% 1.52%, #252B31 0%, rgba(27,32,37,0.50) 100%)',
          }}
          onClick={onClose}
          aria-label="Close">
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
        <div className="text-gray-100 text-base font-bold">Recovery Phrase</div>
        <div className="w-12 h-12 p-2.5 rounded-[50px]" />
      </div>

      {/* Main Card */}
      <div className="px-4 mt-6 pb-6">
        <div
          className="w-full flex flex-col items-center gap-6 rounded-2xl border px-4 py-6"
          style={{
            backgroundColor: 'var(--Shading, #12151A)',
            borderColor: 'var(--Stock, #25282F)',
          }}>
          {/* Warning section */}
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="h-6 flex justify-start items-center">
                <img src={alertIcon} alt="Warning" className="w-5 h-5" />
              </div>
              <div className="flex-1 text-neutral-400 text-sm font-light leading-tight">
                Write down your recovery phrase and store it in a secure
                location. This phrase is the only way to recover your wallet if
                you lose access.
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="self-stretch h-px"
            style={{ outline: '1px solid #3F3F46', outlineOffset: '-0.5px' }}
          />

          {/* Words grid */}
          <div className="w-full">
            <div className="grid grid-cols-3 gap-3">
              {words.map((word, index) => (
                <div
                  key={index}
                  className="p-3 bg-neutral-800 rounded-xl border border-zinc-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-neutral-400 text-xs font-medium leading-tight">
                      {index + 1}
                    </div>
                    <div className="text-gray-100 text-sm font-medium leading-tight">
                      {word}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div
            className="self-stretch h-px"
            style={{ outline: '1px solid #3F3F46', outlineOffset: '-0.5px' }}
          />

          {/* Copy section */}
          <div className="w-full">
            <button
              className="w-full h-14 p-3.5 bg-neutral-800 rounded-xl border border-zinc-800 flex justify-between items-center hover:bg-neutral-700 transition-colors"
              onClick={handleCopy}
              aria-label="Copy recovery phrase">
              <div className="text-neutral-400 text-sm font-medium leading-tight">
                Copy recovery phrase
              </div>
              <div className="flex items-center gap-2">
                {copied && (
                  <div className="text-emerald-400 text-sm font-medium">
                    Copied!
                  </div>
                )}
                <img src={copyIcon} alt="Copy" className="w-5 h-5" />
              </div>
            </button>
          </div>

          {/* Additional security info */}
          <div className="w-full flex flex-col gap-3 pt-2">
            <div className="text-neutral-400 text-xs font-light leading-tight text-center">
              ⚠️ Never share your recovery phrase with anyone
            </div>
            <div className="text-neutral-400 text-xs font-light leading-tight text-center">
              ZenX will never ask for your recovery phrase
            </div>
          </div>
        </div>
      </div>

      {/* Copy feedback toast */}
      {copied && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-3 py-2 bg-neutral-900 rounded-lg outline outline-1 outline-zinc-700 text-emerald-400 text-sm shadow-lg"
          aria-live="assertive">
          Recovery phrase copied to clipboard
        </div>
      )}
    </div>
  )
}
