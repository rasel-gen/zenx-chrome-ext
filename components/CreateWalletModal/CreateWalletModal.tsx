/**
 * CreateWalletModal Component
 * 
 * Usage:
 * - Modal for creating a new wallet with custom label
 * - Handles form validation and loading states
 * - Provides visual feedback during wallet creation
 * - Maintains consistent design with app's modal patterns
 */

import React, { useState } from 'react';
import { useWalletStore } from '@/stores/wallet';

interface CreateWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateWalletModal: React.FC<CreateWalletModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (loading || !label.trim()) return;
    setLoading(true);
    try {
      await useWalletStore.getState().createKeyring(label.trim());
      setLabel('');
      onClose();
    } catch {
      alert('Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setLabel('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-950 rounded-2xl border border-[#25282F] p-6 shadow-2xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[#F0F3F7] text-xl font-bold font-['Manrope']">
              Create New Wallet
            </h2>
            <button 
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
              onClick={handleClose}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" x2="6" y1="6" y2="18"/>
                <line x1="6" x2="18" y1="6" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div className="w-16 h-16 mx-auto bg-blue-600/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10V8.75C4 6.67893 5.67893 5 7.75 5H8.25C10.3211 5 12 6.67893 12 8.75V10"/>
              <rect x="3" y="10" width="16" height="9" rx="2"/>
              <circle cx="11" cy="14.5" r="1.5"/>
            </svg>
          </div>

          <div className="text-center">
            <p className="text-neutral-400 text-sm font-['Manrope']">
              Create a new wallet with a fresh recovery phrase. You'll be able to manage multiple cryptocurrencies.
            </p>
          </div>

          <input 
            className="w-full px-4 py-3 bg-zinc-900 rounded-xl text-[#F0F3F7] text-base font-['Manrope'] outline outline-1 outline-zinc-700 focus:outline-blue-500 transition-colors" 
            placeholder="Enter wallet name (e.g., Personal Wallet)" 
            value={label} 
            onChange={(e) => setLabel(e.target.value)} 
            autoFocus
            disabled={loading}
          />

          <div className="flex gap-3">
            <button 
              className="flex-1 py-3 px-4 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-[#F0F3F7] text-base font-semibold font-['Manrope'] transition-colors disabled:opacity-50" 
              disabled={loading}
              onClick={handleClose}
            >
              Cancel
            </button>
            <button 
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-base font-semibold font-['Manrope'] disabled:opacity-50 transition-colors flex items-center justify-center gap-2" 
              disabled={!label.trim() || loading} 
              onClick={handleCreate}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Wallet'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
