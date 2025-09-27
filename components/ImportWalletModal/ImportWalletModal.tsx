/**
 * ImportWalletModal Component
 * 
 * Usage:
 * - Modal for importing an existing wallet with recovery phrase
 * - Handles form validation, security warnings, and loading states
 * - Provides clear guidance for mnemonic input
 * - Maintains consistent design with app's modal patterns
 */

import React, { useState } from 'react';
import { useWalletStore } from '@/stores/wallet';

interface ImportWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportWalletModal: React.FC<ImportWalletModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [label, setLabel] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (loading || !label.trim() || !mnemonic.trim()) return;
    setLoading(true);
    try {
      await useWalletStore.getState().importKeyring(label.trim(), mnemonic.trim());
      setLabel('');
      setMnemonic('');
      onClose();
    } catch {
      alert('Failed to import wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setLabel('');
    setMnemonic('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-950 rounded-2xl border border-[#25282F] p-6 shadow-2xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[#F0F3F7] text-xl font-bold font-['Manrope']">
              Import Wallet
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
          
          <div className="w-16 h-16 mx-auto bg-amber-600/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17,8 12,3 7,8"/>
              <line x1="12" x2="12" y1="3" y2="15"/>
            </svg>
          </div>

          <div className="text-center">
            <p className="text-neutral-400 text-sm font-['Manrope']">
              Import an existing wallet using your 12 or 24-word recovery phrase.
            </p>
          </div>

          <input 
            className="w-full px-4 py-3 bg-zinc-900 rounded-xl text-[#F0F3F7] text-base font-['Manrope'] outline outline-1 outline-zinc-700 focus:outline-blue-500 transition-colors" 
            placeholder="Enter wallet name" 
            value={label} 
            onChange={(e) => setLabel(e.target.value)} 
            disabled={loading}
          />
          
          <textarea 
            rows={4} 
            className="w-full px-4 py-3 bg-zinc-900 rounded-xl text-[#F0F3F7] text-base font-['Manrope'] outline outline-1 outline-zinc-700 focus:outline-blue-500 transition-colors resize-none" 
            placeholder="Enter your 12 or 24-word recovery phrase" 
            value={mnemonic} 
            onChange={(e) => setMnemonic(e.target.value)} 
            disabled={loading}
          />

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <p className="text-amber-200 text-sm font-['Manrope'] leading-relaxed">
              <strong>Security Note:</strong> Make sure you're in a private location. Never share your recovery phrase with anyone.
            </p>
          </div>

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
              disabled={!label.trim() || !mnemonic.trim() || loading} 
              onClick={handleImport}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Importing...
                </>
              ) : (
                'Import Wallet'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
