/**
 * WalletsPage Component
 * 
 * Usage:
 * - Dedicated page for managing multiple wallets (keyrings)
 * - Coordinates wallet list display and modal interactions
 * - Follows existing navigation patterns with back button
 * - Maintains consistent design with the app's dark theme
 */

import React, { useState } from 'react';
import { Page } from '@/components/Page.tsx';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '@/stores/wallet';
import { WalletList } from '@/components/WalletList/WalletList';
import { CreateWalletModal } from '@/components/CreateWalletModal/CreateWalletModal';
import { ImportWalletModal } from '@/components/ImportWalletModal/ImportWalletModal';
import { ExportWalletModal } from '@/components/ExportWalletModal/ExportWalletModal';
import { FloatingWalletActions } from '@/components/FloatingWalletActions/FloatingWalletActions';

export const WalletsPage: React.FC = () => {
  const navigate = useNavigate();
  const keyrings = useWalletStore(s => s.keyrings);
  const activeKeyringId = useWalletStore(s => s.activeKeyringId);
  const setActiveKeyring = useWalletStore(s => s.setActiveKeyring);
  
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exportingKeyringId, setExportingKeyringId] = useState<string | null>(null);

  const handleRename = async (id: string, currentLabel: string) => {
    const name = prompt('Rename wallet', currentLabel) || '';
    if (!name.trim()) return;
    try {
      await useWalletStore.getState().renameKeyring(id, name.trim());
    } catch {
      alert('Failed to rename wallet');
    }
  };

  return (
    <Page back onBack={() => navigate('/settings')}>
      <div className="min-h-screen relative bg-zinc-950 overflow-hidden">
        {/* Blue glows */}
        <div className="pointer-events-none fixed right-6 top-10 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-500 opacity-90" />
        <div className="pointer-events-none fixed right-0 top-2 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-300 opacity-50" />

        {/* Header */}
        <div className="w-full sticky top-0 z-10 px-4 pt-4 pb-3 bg-zinc-950/80 backdrop-blur">
          <div className="flex justify-between items-center">
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

            <h1 className="text-[#F0F3F7] text-base font-bold font-['Manrope'] leading-[140%]">
              Wallets
            </h1>
            <div className="w-12 h-12" /> {/* Spacer for centering */}
          </div>
        </div>

        <div className="px-4 flex flex-col gap-6 pb-32">
          <WalletList
            keyrings={keyrings || []}
            activeKeyringId={activeKeyringId}
            onSetActive={setActiveKeyring}
            onRename={handleRename}
            onExport={setExportingKeyringId}
          />
        </div>

        <FloatingWalletActions
          onCreateWallet={() => setCreating(true)}
          onImportWallet={() => setImporting(true)}
        />

        <CreateWalletModal
          isOpen={creating}
          onClose={() => setCreating(false)}
        />

        <ImportWalletModal
          isOpen={importing}
          onClose={() => setImporting(false)}
        />

        <ExportWalletModal
          keyringId={exportingKeyringId}
          onClose={() => setExportingKeyringId(null)}
        />
      </div>
    </Page>
  );
};
