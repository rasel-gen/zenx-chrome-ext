import React from 'react';
import { useLocation } from 'react-router-dom';

interface FloatingMenuProps {
  onHome?: () => void;
  onSwap?: () => void;
  onReceive?: () => void;
  onSettings?: () => void;
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({ onHome, onSwap, onReceive, onSettings }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const Item: React.FC<{ 
    icon: string; 
    coloredIcon: string;
    isActive: boolean; 
    onClick?: () => void;
  }>= ({ icon, coloredIcon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-[50px] flex justify-center items-center transition-colors"
      style={{ backgroundColor: isActive ? '#FFFFFF' : 'transparent' }}
      aria-label="menu-item"
    >
      <img src={isActive ? coloredIcon : icon} alt="" className="w-6 h-6" />
    </button>
  );

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-5 z-50">
      <div className="p-2.5 inline-flex flex-col items-start gap-2.5 rounded-[50px]"
        style={{
          backgroundColor: '#0F1116',
          outline: '1.5px solid rgba(113,118,128,0.6)',
          outlineOffset: '-1.5px',
        }}
      >
        <div className="inline-flex items-center gap-2.5">
          <Item 
            icon="/home-01.png" 
            coloredIcon="/home-colored.png"
            isActive={currentPath === '/dashboard'} 
            onClick={onHome} 
          />
          <Item 
            icon="/arrow-send.png" 
            coloredIcon="/send-colored.png"
            isActive={currentPath.includes('/send')} 
            onClick={onSwap} 
          />
          <Item 
            icon="/arrow-receive.png" 
            coloredIcon="/receive-colored.png"
            isActive={currentPath.includes('/receive')} 
            onClick={onReceive} 
          />
          <Item 
            icon="/settings-01.png" 
            coloredIcon="/settings-01.svg"
            isActive={currentPath === '/settings'} 
            onClick={onSettings} 
          />
        </div>
      </div>
    </div>
  );
};


