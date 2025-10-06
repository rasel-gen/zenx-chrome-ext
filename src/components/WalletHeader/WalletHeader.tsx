import { CreateWalletModal } from '@/components/CreateWalletModal/CreateWalletModal'
import { useWalletStore } from '@/stores/wallet'
import bellIcon from 'data-base64:@assets/public/bell-icon.png'
import bgEclipsIcon from 'data-base64:@assets/public/bg-eclips.png'
import React from 'react'

interface WalletHeaderProps {
  onClickCreateWallet: () => void
  activeWalletAddressShort?: string
  onNotificationClick?: () => void
  notificationCount?: number
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({
  onClickCreateWallet,
  onNotificationClick,
  notificationCount = 0,
}) => {
  const keyrings = useWalletStore((s) => s.keyrings)
  const activeKeyringId = useWalletStore((s) => s.activeKeyringId)
  const activeWalletLabel =
    (keyrings || []).find((k) => k.id === activeKeyringId)?.label || 'My Wallet'

  const setActiveKeyring = useWalletStore((s) => s.setActiveKeyring)

  const [showActions, setShowActions] = React.useState(false)
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [sheetAnim, setSheetAnim] = React.useState(false)

  React.useEffect(() => {
    if (showActions) {
      const id = requestAnimationFrame(() => setSheetAnim(true))
      return () => cancelAnimationFrame(id)
    }
    setSheetAnim(false)
  }, [showActions])

  const closeSheet = React.useCallback((after?: () => void) => {
    setSheetAnim(false)
    setTimeout(() => {
      setShowActions(false)
      if (after) after()
    }, 300)
  }, [])
  return (
    <div className="flex w-full justify-between items-center px-0 py-4 bg-transparent relative overflow-visible">
      {/* Background eclipse effect */}
      <div
        className="fixed -top-[60px] -right-[60px] w-[400px] h-[400px] opacity-60 z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${bgEclipsIcon})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />

      <div className="flex items-center gap-2 relative z-10 flex-1">
        <button
          className="h-12 px-3 rounded-3xl inline-flex items-center justify-between gap-2 border border-[rgba(255,255,255,0.12)] max-w-[200px] min-w-[140px] transition-all active:opacity-80"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          onClick={() => setShowActions(true)}
          aria-label="Open wallet actions">
          <div className="flex flex-col items-start flex-1 min-w-0">
            <div className="m-0 text-lg font-semibold leading-7 text-white truncate">
              {activeWalletLabel || 'Add Wallet'}
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="opacity-70 ml-2 flex-shrink-0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <button
        className="w-12 h-12 p-2.5 rounded-[50px] inline-flex justify-center items-center gap-2.5 overflow-visible border-none cursor-pointer transition-all active:scale-95 relative z-10"
        onClick={onNotificationClick}
        aria-label="Notifications"
        style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
        }}>
        <img
          src={bellIcon}
          alt="Notifications"
          width="24"
          height="24"
          className="w-5 h-5 opacity-90"
        />
        {notificationCount > 0 && (
          <span
            aria-label={`${notificationCount} new notifications`}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] leading-[18px] text-center font-bold shadow z-20 pointer-events-none">
            {notificationCount > 99 ? '99+' : notificationCount}
          </span>
        )}
      </button>
      {/* Bottom sheet for actions */}
      {showActions && (
        <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
          <div
            className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${sheetAnim ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => closeSheet()}
          />
          <div
            className={`absolute bottom-0 left-0 right-0 max-h-[80vh] flex flex-col bg-zinc-950 rounded-t-2xl outline outline-1 outline-zinc-800 shadow-2xl transform transition-transform duration-300 ${sheetAnim ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="w-10 h-1.5 bg-zinc-700 rounded-full mx-auto mt-4 mb-4 flex-shrink-0" />
            <p className="text-white text-base font-bold text-center">
              Wallets
            </p>
            {/* Scrollable wallet list */}
            {keyrings && keyrings.length > 0 && (
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="flex flex-col gap-2">
                  {keyrings.map((k) => (
                    <button
                      key={k.id}
                      className={`flex flex-row items-center justify-between px-3 py-3 rounded-xl transition-all active:opacity-80 ${
                        activeKeyringId === k.id
                          ? 'border border-[rgba(59,130,246,0.4)]'
                          : ''
                      }`}
                      style={{
                        backgroundColor:
                          activeKeyringId === k.id
                            ? 'rgba(59,130,246,0.18)'
                            : 'rgba(255,255,255,0.06)',
                      }}
                      onClick={async () => {
                        if (k.id !== activeKeyringId) {
                          await setActiveKeyring(k.id)
                        }
                        closeSheet()
                      }}>
                      <span className="text-white text-sm font-semibold flex-1 text-left truncate mr-2">
                        {k.label}
                      </span>
                      {activeKeyringId === k.id && (
                        <span className="text-blue-300 text-xs font-semibold">
                          Active
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex-shrink-0 px-4 pb-6 pt-2 flex flex-col gap-3">
              <button
                className="w-full h-12 px-4 rounded-xl text-white text-[15px] font-bold transition-all active:opacity-90"
                style={{ backgroundColor: '#2563EB' }}
                onClick={onClickCreateWallet}>
                Create Wallet
              </button>
              <button
                className="w-full h-11 px-4 rounded-xl text-white text-sm font-semibold transition-all active:opacity-80"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                onClick={() => closeSheet()}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
