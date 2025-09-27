/**
 * BalanceDisplay Component
 *
 * Usage:
 * - Shows current wallet balance with currency selector
 * - Includes eye icon to toggle balance visibility
 * - Features currency dropdown for USD/other currencies
 * - Animates balance changes smoothly
 *
 * Props:
 * - balance: Current balance amount
 * - currency: Selected currency (USD, EUR, etc.)
 * - isVisible: Whether balance is currently visible
 * - onToggleVisibility: Callback for eye icon click
 * - onCurrencyChange?: Callback for currency selection change
 */

import { CurrencyBadge } from "@/components/CurrencyBadge/CurrencyBadge"
import { FIAT_CURRENCIES, FIAT_META, FIAT_SYMBOLS } from "@/config/fiats"
import React, { useState } from "react"

interface BalanceDisplayProps {
  balance: number
  currency: string
  isVisible: boolean
  onToggleVisibility: () => void
  onCurrencyChange?: (currency: string) => void
  onSend?: () => void
  onReceive?: () => void
  onHistory?: () => void
  loading?: boolean // kept for compatibility; no functional use to avoid 0-flash
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  balance,
  currency,
  isVisible,
  onToggleVisibility,
  onCurrencyChange,
  onSend,
  onReceive,
  onHistory
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const currencies = FIAT_CURRENCIES

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  // Avoid showing 0 during refresh; keep displaying last-known balance
  const [intPart, decPart] = formatBalance(balance).split(".") as [
    string,
    string?
  ]

  return (
    <div className="w-full self-stretch p-4 bg-neutral-900 rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-800 inline-flex flex-col items-start gap-2.5 mb-5">
      <div className="self-stretch flex flex-col items-start gap-6">
        <div className="self-stretch inline-flex justify-between items-start">
          <div className="inline-flex flex-col items-start gap-3">
            <div className="text-neutral-400 text-base font-normal leading-normal">
              Current Balance
            </div>
            <div className="inline-flex items-center gap-3">
              <div className="justify-center">
                {isVisible ? (
                  <>
                    <span className="text-gray-100 text-3xl font-bold leading-9 tracking-wider">
                      {FIAT_SYMBOLS[currency] ?? ""}
                      {intPart}
                    </span>
                    <span className="text-neutral-400 text-3xl font-medium leading-9 tracking-wider">
                      .{decPart ?? "00"}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-100 text-3xl font-bold leading-9 tracking-wider">
                    ••••••
                  </span>
                )}
              </div>
              <button
                className="w-6 h-6 rounded-full flex items-center justify-center border-0"
                onClick={onToggleVisibility}
                aria-label={isVisible ? "Hide balance" : "Show balance"}
                style={{
                  background: "transparent",
                  color: "var(--color-hint)"
                }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="pl-1 pr-2 py-1 bg-slate-800/10 rounded-[50px] outline outline-1 outline-offset-[-1px] outline-zinc-700 flex items-center gap-3 relative">
            <button
              className="flex items-center gap-1 bg-transparent border-0 cursor-pointer"
              onClick={() => setIsDropdownOpen(true)}
              aria-label="Open base currency selector">
              <div className="w-6 h-6 p-[2px] bg-zinc-800/60 rounded-3xl outline outline-[0.5px] outline-offset-[-0.5px] outline-zinc-700/40 flex justify-center items-center overflow-hidden">
                <CurrencyBadge code={currency} size={20} />
              </div>
              <div className="text-neutral-400 text-sm font-normal leading-tight">
                {currency}
              </div>
            </button>
            <div className="w-5 h-5 flex justify-center items-center">
              <img
                src="/arrow-down-01.png"
                alt="Dropdown arrow"
                className="w-4 h-4 opacity-60"
              />
            </div>

            {isDropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                {/* Panel */}
                <div
                  className="fixed right-2 sm:right-4 top-20 z-50 w-[calc(100vw-1rem)] sm:w-96 max-w-96 max-h-[75vh] p-4 bg-neutral-900 rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-800 overflow-hidden"
                  style={{
                    boxShadow:
                      "0px -23px 51px rgba(0,0,0,0.10), 0px -93px 93px rgba(0,0,0,0.09), 0px -210px 126px rgba(0,0,0,0.05), 0px -374px 149px rgba(0,0,0,0.01), 0px -584px 163px rgba(0,0,0,0.00)"
                  }}>
                  <div className="self-stretch flex flex-col gap-4">
                    <div className="self-stretch inline-flex justify-between items-start">
                      <div className="text-gray-100 text-base leading-normal">
                        Base Currency
                      </div>
                      <button
                        className="w-8 h-8 p-1.5 bg-zinc-900 rounded-[33.33px] flex justify-center items-center overflow-hidden border-0 cursor-pointer"
                        onClick={() => setIsDropdownOpen(false)}
                        aria-label="Close">
                        <div className="w-4 h-4" />
                      </button>
                    </div>
                    <div
                      className="self-stretch flex flex-col overflow-y-auto pr-1"
                      style={{ maxHeight: "60vh" }}>
                      {currencies.map((code) => (
                        <button
                          key={code}
                          className="self-stretch p-4 border-b-[1.5px] border-zinc-800 inline-flex justify-between items-center bg-transparent text-left cursor-pointer"
                          onClick={() => {
                            onCurrencyChange?.(code)
                            setIsDropdownOpen(false)
                          }}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                              <CurrencyBadge code={code} size={40} />
                            </div>
                            <div className="inline-flex flex-col items-start">
                              <div className="text-gray-100 text-base font-semibold leading-snug">
                                {code}
                              </div>
                              <div className="text-neutral-400 text-sm font-medium leading-tight">
                                {FIAT_META[code]?.label ?? ""}
                              </div>
                            </div>
                          </div>
                          <div className="text-neutral-400 text-base font-semibold leading-snug ml-2 min-w-[1.5rem] text-right">
                            {FIAT_SYMBOLS[code] ?? ""}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="self-stretch flex flex-wrap gap-2 justify-center sm:justify-between items-center">
          {[
            {
              key: "send",
              label: "Send",
              icon: "/arrow-send.png",
              onClick: onSend
            },
            {
              key: "receive",
              label: "Receive",
              icon: "/arrow-receive.png",
              onClick: onReceive
            },
            {
              key: "history",
              label: "History",
              icon: "/transaction-history.png",
              onClick: onHistory
            }
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={btn.onClick}
              className="h-12 sm:h-14 px-3 sm:pl-2 sm:pr-4 py-2 bg-zinc-900 rounded-[75.83px] outline outline-1 outline-offset-[-1px] outline-zinc-800 flex justify-center items-center gap-1.5 sm:gap-2 active:scale-[0.98] flex-1 sm:flex-initial min-w-[90px] max-w-[120px] sm:max-w-none">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-zinc-800 rounded-[60px] flex justify-center items-center flex-shrink-0">
                <img
                  src={btn.icon}
                  alt=""
                  className="w-4 h-4 sm:w-5 sm:h-5 brightness-0 invert"
                />
              </div>
              <div className="text-slate-200 text-sm sm:text-base font-medium leading-normal truncate">
                {btn.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
