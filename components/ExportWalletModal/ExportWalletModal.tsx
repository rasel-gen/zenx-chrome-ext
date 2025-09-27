/**
 * ExportWalletModal Component
 * 
 * Usage:
 * - Two-step modal flow for exporting wallet recovery phrase
 * - Step 1: Passcode verification (if enabled)
 * - Step 2: Display phrase with copy functionality
 * - Handles security warnings and proper state management
 * - Maintains consistent design with app's modal patterns
 */

import React, { useEffect, useState } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { api } from '@/helpers/api';

interface ExportWalletModalProps {
  keyringId: string | null;
  onClose: () => void;
}

export const ExportWalletModal: React.FC<ExportWalletModalProps> = ({
  keyringId,
  onClose,
}) => {
  const [passcode, setPasscode] = useState('');
  const [exportedPhrase, setExportedPhrase] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passcodeRequired, setPasscodeRequired] = useState<boolean | null>(null);

  const handleExport = async () => {
    if (loading || !keyringId) return;
    setLoading(true);
    try {
      const phrase = await useWalletStore.getState().exportKeyring(keyringId, passcode || undefined);
      setExportedPhrase(phrase);
      setPasscode('');
    } catch (e: any) {
      alert(String(e?.message || 'Export failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!exportedPhrase) return;
    try {
      await navigator.clipboard.writeText(exportedPhrase);
      // Brief success feedback
      const btn = document.activeElement as HTMLButtonElement;
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg> Copied!';
        setTimeout(() => { btn.innerHTML = original; }, 2000);
      }
    } catch {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = exportedPhrase;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Copied to clipboard');
    }
  };

  const handleClose = () => {
    if (loading) return;
    setPasscode('');
    setExportedPhrase(null);
    onClose();
  };

  // Decide if passcode is required; if not, auto-export
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPasscodeRequired(null);
      setExportedPhrase(null);
      setPasscode('');
      try {
        const prefs = await api.preferences().catch(() => ({ passcodeEnabled: false } as any));
        const required = Boolean((prefs as any)?.passcodeEnabled);
        if (cancelled) return;
        setPasscodeRequired(required);
        if (!required && keyringId) {
          // Auto export without showing passcode step
          setLoading(true);
          try {
            const phrase = await useWalletStore.getState().exportKeyring(keyringId, undefined);
            if (!cancelled) setExportedPhrase(phrase);
          } catch (e: any) {
            if (!cancelled) alert(String(e?.message || 'Export failed'));
          } finally {
            if (!cancelled) setLoading(false);
          }
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [keyringId]);

  if (!keyringId) return null;

  // Step 2: Show exported phrase
  if (exportedPhrase) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-950 rounded-2xl border border-[#25282F] p-6 shadow-2xl">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[#F0F3F7] text-xl font-bold font-['Manrope']">Recovery Phrase</h2>
              <button 
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                onClick={handleClose}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" x2="6" y1="6" y2="18"/>
                  <line x1="6" x2="18" y1="6" y2="18"/>
                </svg>
              </button>
            </div>
            
            <div className="w-16 h-16 mx-auto bg-green-600/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
            </div>

            <div className="text-center">
              <p className="text-neutral-400 text-sm font-['Manrope']">
                Store this recovery phrase in a safe place. Anyone with this phrase can access your wallet.
              </p>
            </div>

            <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-700">
              <div className="text-[#F0F3F7] text-sm font-mono leading-relaxed break-all select-all">
                {exportedPhrase}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                className="flex-1 py-3 px-4 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-[#F0F3F7] text-base font-semibold font-['Manrope'] transition-colors" 
                onClick={handleClose}
              >
                Close
              </button>
              <button 
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-base font-semibold font-['Manrope'] transition-colors flex items-center justify-center gap-2" 
                onClick={handleCopy}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Passcode verification (only if required). While checking, show lightweight loader.
  if (passcodeRequired === null && !exportedPhrase) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-zinc-950 rounded-2xl border border-[#25282F] p-6 shadow-2xl flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
          <div className="text-neutral-400 text-sm font-['Manrope']">Preparing export...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-950 rounded-2xl border border-[#25282F] p-6 shadow-2xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[#F0F3F7] text-xl font-bold font-['Manrope']">Export Recovery Phrase</h2>
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
              <path d="M12 1v6m0 6v6m6-9h-6m-6 0h6"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-200 text-sm font-['Manrope'] leading-relaxed">
              <strong>Warning:</strong> Your recovery phrase gives full access to your wallet. Never share it with anyone or store it online.
            </p>
          </div>

          {passcodeRequired && (
          <input 
            type="password"
            className="w-full px-4 py-3 bg-zinc-900 rounded-xl text-[#F0F3F7] text-base font-['Manrope'] outline outline-1 outline-zinc-700 focus:outline-amber-500 transition-colors" 
            placeholder="Enter your passcode (if enabled)" 
            value={passcode} 
            onChange={(e) => setPasscode(e.target.value)} 
            autoFocus
            disabled={loading}
          />)}

          <div className="flex gap-3">
            <button 
              className="flex-1 py-3 px-4 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-[#F0F3F7] text-base font-semibold font-['Manrope'] transition-colors disabled:opacity-50" 
              disabled={loading}
              onClick={handleClose}
            >
              Cancel
            </button>
            <button 
              className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 rounded-xl text-white text-base font-semibold font-['Manrope'] disabled:opacity-50 transition-colors flex items-center justify-center gap-2" 
              disabled={loading} 
              onClick={handleExport}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                'Export'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
