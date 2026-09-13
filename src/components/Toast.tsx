import React from 'react';

interface ToastProps {
  message: string | null;
  icon?: string;
}

export const Toast: React.FC<ToastProps> = ({ message, icon = 'check_circle' }) => {
  if (!message) return null;

  return (
    <div
      id="toastNotification"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#31353e] text-[#dfe2ee] font-medium text-xs shadow-2xl flex items-center space-x-2 border border-white/10 animate-fade-in pointer-events-none transition-all"
    >
      <span className="material-symbols-outlined text-[#ff4f73] text-[18px]">
        {icon}
      </span>
      <span id="toastMessage" className="whitespace-nowrap">
        {message}
      </span>
    </div>
  );
};
