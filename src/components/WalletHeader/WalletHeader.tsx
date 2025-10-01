import bellIcon from 'data-base64:@assets/public/bell-icon.png'
import bgEclipsIcon from 'data-base64:@assets/public/bg-eclips.png'
import React from 'react'

interface User {
  name: string
  username: string
  avatar?: string
}

interface WalletHeaderProps {
  user: User
  onNotificationClick?: () => void
  notificationCount?: number
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({
  user,
  onNotificationClick,
  notificationCount = 0,
}) => {
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

      <div className="flex items-center gap-2 relative z-10">
        {/* Avatar Container */}
        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <span className="text-white font-semibold text-base">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="w-36 inline-flex flex-col items-start">
          {user.name && (
            <h1
              className="m-0 text-lg font-semibold leading-relaxed"
              style={{ color: 'var(--color-text)' }}>
              {user.name}
            </h1>
          )}
          <span
            className="text-sm font-medium leading-tight"
            style={{ color: 'var(--color-hint)' }}>
            @{user.username}
          </span>
        </div>
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
    </div>
  )
}
