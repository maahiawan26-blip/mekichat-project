import React from 'react';
import { ScreenTab } from '../types';
import { APP_LOGO_URL, USER_PROFILE_URL } from '../data/mockData';

interface HeaderProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenProfile,
  onOpenNotifications,
  unreadCount = 2,
}) => {
  const getSublabel = () => {
    switch (currentTab) {
      case 'chats':
        return 'Chats';
      case 'explore':
        return 'Explore';
      case 'stems-music':
        return 'Stems Music';
      case 'profile':
        return 'Profile';
      default:
        return 'Chats';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#0a0e16]/90 backdrop-blur-xl border-b border-[#262a33]/60 shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="h-16 px-4 md:px-6 max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand logo & title */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => onTabChange('chats')}
        >
          <img
            alt="Meki Chat Logo"
            className="h-8 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,79,115,0.45)]"
            src={APP_LOGO_URL}
          />
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1">
              <span className="text-[18px] text-[#dfe2ee] font-bold tracking-tight font-headline">
                Meki
              </span>
              <span className="text-[18px] text-[#ffb2ba] font-bold tracking-tight font-headline">
                Chat
              </span>
              <span className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.8)] ml-0.5"></span>
            </div>
            <span className="text-[11px] text-[#e5bdc0] font-medium tracking-wide leading-none font-label">
              {getSublabel()}
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1">
          <button
            aria-label="Quick Search"
            onClick={() => onTabChange('explore')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              currentTab === 'explore'
                ? 'text-[#ffb2ba] bg-[#262a33]'
                : 'text-[#e5bdc0] hover:text-[#dfe2ee] hover:bg-[#262a33]/60'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          <button
            aria-label="Notifications"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#e5bdc0] hover:text-[#dfe2ee] hover:bg-[#262a33]/60 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ff4f73] shadow-[0_0_6px_#ff4f73]"></span>
            )}
          </button>

          <div
            className="relative flex items-center justify-center ml-1 cursor-pointer group"
            onClick={onOpenProfile}
          >
            <img
              alt="My Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#ffb2ba]/50 group-hover:ring-[#ff4f73] transition-all"
              src={USER_PROFILE_URL}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4edea3] ring-2 ring-[#0f131c] shadow-[0_0_6px_rgba(78,222,163,0.6)]"></span>
          </div>
        </div>
      </div>
    </header>
  );
};
