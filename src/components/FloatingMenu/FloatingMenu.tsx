import receiveIcon from 'data-base64:@assets/public/arrow-receive.png'
import sendIcon from 'data-base64:@assets/public/arrow-send.png'
import homeIcon from 'data-base64:@assets/public/home-01.png'
import homeColoredIcon from 'data-base64:@assets/public/home-colored.png'
import receiveColoredIcon from 'data-base64:@assets/public/receive-colored.png'
import sendColoredIcon from 'data-base64:@assets/public/send-colored.png'
import settingsIcon from 'data-base64:@assets/public/settings-01.png'
import settingsColoredIcon from 'data-base64:@assets/public/settings-01.svg'
import React from 'react'
import { useLocation } from 'react-router-dom'

interface FloatingMenuProps {
  onHome?: () => void
  onSwap?: () => void
  onReceive?: () => void
  onSettings?: () => void
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({
  onHome,
  onSwap,
  onReceive,
  onSettings,
}) => {
  const location = useLocation()
  const currentPath = location.pathname

  const Item: React.FC<{
    icon: string
    coloredIcon: string
    isActive: boolean
    onClick?: () => void
  }> = ({ icon, coloredIcon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-[50px] flex justify-center items-center transition-colors"
      style={{ backgroundColor: isActive ? '#FFFFFF' : 'transparent' }}
      aria-label="menu-item">
      <img src={isActive ? coloredIcon : icon} alt="" className="w-6 h-6" />
    </button>
  )

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-5 z-20">
      <div
        className="p-2.5 inline-flex flex-col items-start gap-2.5 rounded-[50px]"
        style={{
          backgroundColor: '#0F1116',
          outline: '1.5px solid rgba(113,118,128,0.6)',
          outlineOffset: '-1.5px',
        }}>
        <div className="inline-flex items-center gap-2.5">
          <Item
            icon={homeIcon}
            coloredIcon={homeColoredIcon}
            isActive={currentPath === '/dashboard'}
            onClick={onHome}
          />
          <Item
            icon={sendIcon}
            coloredIcon={sendColoredIcon}
            isActive={currentPath.includes('/send')}
            onClick={onSwap}
          />
          <Item
            icon={receiveIcon}
            coloredIcon={receiveColoredIcon}
            isActive={currentPath.includes('/receive')}
            onClick={onReceive}
          />
          <Item
            icon={settingsIcon}
            coloredIcon={settingsColoredIcon}
            isActive={currentPath === '/settings'}
            onClick={onSettings}
          />
        </div>
      </div>
    </div>
  )
}
