import React from 'react';
import { ScreenTab } from '../types';

interface BottomNavProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  unreadChats?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  unreadChats = 4,
}) => {
  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#0a0e16]/90 backdrop-blur-xl border-t border-[#262a33]/60 shadow-[0_-4px_24px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        {/* Chats Tab */}
        <button
          onClick={() => onTabChange('chats')}
          aria-current={currentTab === 'chats' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center w-16 h-12 transition-all ${
            currentTab === 'chats'
              ? 'text-[#ffb2ba]'
              : 'text-[#e5bdc0] hover:text-[#dfe2ee]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: currentTab === 'chats' ? "'FILL' 1" : "'FILL' 0" }}
            >
              chat_bubble
            </span>
            {unreadChats > 0 && (
              <span className="absolute -top-1 -right-2.5 px-1.5 py-0.2 bg-[#ff4f73] text-[#5a001b] text-[10px] font-bold rounded-full shadow-[0_0_8px_rgba(255,79,115,0.6)] leading-tight">
                {unreadChats}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold mt-1 font-label">Chats</span>
        </button>

        {/* Explore Tab */}
        <button
          onClick={() => onTabChange('explore')}
          aria-current={currentTab === 'explore' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center w-16 h-12 transition-all ${
            currentTab === 'explore'
              ? 'text-[#ffb2ba]'
              : 'text-[#e5bdc0] hover:text-[#dfe2ee]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: currentTab === 'explore' ? "'FILL' 1" : "'FILL' 0" }}
          >
            explore
          </span>
          <span className="text-[11px] font-semibold mt-1 font-label">Explore</span>
        </button>

        {/* Stems Tab */}
        <button
          onClick={() => onTabChange('stems-music')}
          aria-current={currentTab === 'stems-music' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center w-16 h-12 transition-all ${
            currentTab === 'stems-music'
              ? 'text-[#ffb2ba]'
              : 'text-[#e5bdc0] hover:text-[#dfe2ee]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: currentTab === 'stems-music' ? "'FILL' 1" : "'FILL' 0" }}
            >
              graphic_eq
            </span>
            <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#dbb8ff] shadow-[0_0_6px_#dbb8ff]"></span>
          </div>
          <span className="text-[11px] font-semibold mt-1 font-label">Stems</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onTabChange('profile')}
          aria-current={currentTab === 'profile' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center w-16 h-12 transition-all ${
            currentTab === 'profile'
              ? 'text-[#ffb2ba]'
              : 'text-[#e5bdc0] hover:text-[#dfe2ee]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: currentTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}
          >
            person
          </span>
          <span className="text-[11px] font-semibold mt-1 font-label">Profile</span>
        </button>
      </div>
    </nav>
  );
};
