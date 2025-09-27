/**
 * FloatingWalletActions Component
 * 
 * Usage:
 * - Floating action buttons for wallet creation and import
 * - Fixed position at bottom of screen for easy access
 * - Horizontal layout with primary/secondary action hierarchy
 * - Maintains consistent design with app's floating elements
 */

import React from 'react';

interface FloatingWalletActionsProps {
  onCreateWallet: () => void;
  onImportWallet: () => void;
}

export const FloatingWalletActions: React.FC<FloatingWalletActionsProps> = ({
  onCreateWallet,
  onImportWallet,
}) => {
  return (
    <div className="fixed bottom-6 left-4 right-4 flex gap-3 z-50">
      <button 
        className="flex-1 py-3 px-4 rounded-2xl border border-[#25282F] bg-[#12151A]/50 backdrop-blur text-[#F0F3F7] font-semibold font-['Manrope'] text-base active:scale-[0.98] transition-transform flex items-center justify-center gap-2 shadow-lg" 
        onClick={onImportWallet}
        aria-label="Import Wallet"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17,8 12,3 7,8"/>
          <line x1="12" x2="12" y1="3" y2="15"/>
        </svg>
        Import Wallet
      </button>
      <button 
        className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold font-['Manrope'] text-base shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-transform flex items-center justify-center gap-2" 
        onClick={onCreateWallet}
        aria-label="Create Wallet"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" x2="12" y1="5" y2="19"/>
          <line x1="5" x2="19" y1="12" y2="12"/>
        </svg>
        Create Wallet
      </button>
    </div>
  );
};
