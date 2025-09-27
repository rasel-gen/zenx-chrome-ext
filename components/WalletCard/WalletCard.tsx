/**
 * WalletCard Component
 * 
 * Usage:
 * - Displays individual wallet (keyring) information in a card format
 * - Shows active status, name, and action buttons
 * - Handles Set Active, Rename, and Export actions
 * - Maintains consistent design with app's dark theme
 */

import React from 'react';
import { useWalletStore } from '@/stores/wallet';

interface WalletCardProps {
  keyring: {
    id: string;
    label: string;
    createdAt: string;
  };
  isActive: boolean;
  onSetActive: (id: string) => void;
  onRename: (id: string, currentLabel: string) => void;
  onExport: (id: string) => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  keyring,
  isActive,
  onSetActive,
  onRename,
  onExport,
}) => {
  return (
    <div className="rounded-2xl border border-[#25282F] bg-[#12151A] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ background: isActive ? '#3B82F6' : '#6B7280' }} 
          />
          <div className="flex flex-col">
            <span className="text-[#F0F3F7] text-base font-medium font-['Manrope']">
              {keyring.label}
            </span>
            {isActive && (
              <span className="text-blue-400 text-sm font-['Manrope']">
                Active Wallet
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isActive && (
            <button 
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 text-blue-400 hover:text-blue-300 text-xs font-medium font-['Manrope'] transition-colors" 
              onClick={() => onSetActive(keyring.id)}
            >
              Set Active
            </button>
          )}
          <button 
            className="w-8 h-8 rounded-lg bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-600/30 transition-colors flex items-center justify-center"
            onClick={() => onRename(keyring.id, keyring.label)}
            title="Rename wallet"
            aria-label="Rename wallet"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button>
          <button 
            className="w-8 h-8 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-600/30 transition-colors flex items-center justify-center"
            onClick={() => onExport(keyring.id)}
            title="Export recovery phrase"
            aria-label="Export recovery phrase"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" x2="12" y1="15" y2="3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
