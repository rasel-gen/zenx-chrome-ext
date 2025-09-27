/**
 * WalletList Component
 *
 * Usage:
 * - Displays list of user wallets (keyrings) with empty state
 * - Handles wallet actions through callback props
 * - Shows active wallet indicator and action buttons
 * - Maintains consistent design with app's list patterns
 */

import { WalletCard } from "@/components/WalletCard/WalletCard"
import React from "react"

interface Keyring {
  id: string
  label: string
  createdAt: string
}

interface WalletListProps {
  keyrings: Keyring[]
  activeKeyringId?: string | null
  onSetActive: (id: string) => void
  onRename: (id: string, currentLabel: string) => void
  onExport: (id: string) => void
}

export const WalletList: React.FC<WalletListProps> = ({
  keyrings,
  activeKeyringId,
  onSetActive,
  onRename,
  onExport
}) => {
  if (keyrings.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <div className="text-[#F0F3F7] text-lg font-bold font-['Manrope']">
          Your Wallets
        </div>
        <div className="rounded-2xl border border-[#25282F] bg-[#12151A] p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M4 10V8.75C4 6.67893 5.67893 5 7.75 5H8.25C10.3211 5 12 6.67893 12 8.75V10"
                stroke="#6B7280"
                strokeWidth="1.5"
              />
              <rect
                x="3"
                y="10"
                width="16"
                height="9"
                rx="2"
                stroke="#6B7280"
                strokeWidth="1.5"
              />
              <circle cx="11" cy="14.5" r="1.5" fill="#6B7280" />
            </svg>
          </div>
          <div className="text-neutral-400 text-base font-['Manrope'] mb-2">
            No wallets yet
          </div>
          <div className="text-neutral-500 text-sm font-['Manrope']">
            Create or import a wallet to get started
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[#F0F3F7] text-lg font-bold font-['Manrope']">
        Your Wallets
      </div>
      <div className="flex flex-col gap-3">
        {keyrings.map((keyring) => (
          <WalletCard
            key={keyring.id}
            keyring={keyring}
            isActive={activeKeyringId === keyring.id}
            onSetActive={onSetActive}
            onRename={onRename}
            onExport={onExport}
          />
        ))}
      </div>
    </div>
  )
}
