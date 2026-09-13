import React, { useState, useEffect } from 'react';
import { ScreenTab, ChatItem, CreatorStory } from './types';
import { CHAT_ITEMS } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { ChatsScreen } from './components/ChatsScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { StemsScreen } from './components/StemsScreen';
import { StoryModal } from './components/StoryModal';
import { EQModal } from './components/EQModal';
import { ChatDetailModal } from './components/ChatDetailModal';
import { ProfileModal } from './components/ProfileModal';
import { soundEngine } from './utils/audioEngine';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('chats');
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [selectedStory, setSelectedStory] = useState<CreatorStory | null>(null);
  const [isEQModalOpen, setIsEQModalOpen] = useState<boolean>(false);
  const [attachedStemForChat, setAttachedStemForChat] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState<string>('check_circle');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(3);

  const notifications = [
    {
      id: 'n1',
      title: 'Remix Collaboration',
      desc: '@kael.meki accepted your sidechain stem sync invitation.',
      time: '10m ago',
      icon: 'tune',
      color: '#ff4f73',
    },
    {
      id: 'n2',
      title: 'Studio Drop Presave',
      desc: 'Modular Synth Packs Vol. 04 is dropping in 45m. Claim free pass.',
      time: '25m ago',
      icon: 'token',
      color: '#4edea3',
    },
    {
      id: 'n3',
      title: 'Community Stem Trending',
      desc: 'Your Juno Lead was remixed by @synth.meki in Tokyo Studio.',
      time: '1h ago',
      icon: 'graphic_eq',
      color: '#dbb8ff',
    },
  ];

  const triggerToast = (msg: string, icon = 'graphic_eq') => {
    setToastMessage(msg);
    setToastIcon(icon);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleOpenExploreWithHandle = (_handle: string) => {
    setCurrentTab('explore');
  };

  const handleOpenMessageFromHandle = (handle: string) => {
    const existing = CHAT_ITEMS.find(
      (c) => c.handle?.toLowerCase() === handle.toLowerCase()
    );
    if (existing) {
      setSelectedChat(existing);
    } else {
      // Create temporary chat item for the handle
      const newChat: ChatItem = {
        id: `chat-${handle.replace('@', '')}`,
        type: 'dm',
        categories: ['all', 'dms'],
        title: handle.replace('@', ''),
        handle: handle,
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCF3fx4SjQnZJkQAyOliB-31wSBE-Oz2iwdX4NZz-mmKJZkVjVLRmuncHzX4YwxuLK2WvFGIhNj-cOaTMO862PUNEKurpTml5fusHEE9PqN5QQjxLREiJDQWAaCgDdRpLp8jC2kbmwLHzMHfIcL94wBLjwPw0o_Eji1JGvFMZ-mjNmRzHl3E9J-nN9HgwK2o9hRNd2HfJmnHsodwb0VeXntCByhVmPioY2klApmc9lZqJJuy7yeS-7w',
        time: 'Just now',
        previewText: `Direct collab thread started with ${handle}`,
      };
      setSelectedChat(newChat);
    }
  };

  const handleSendStemToChat = (fileName: string) => {
    setAttachedStemForChat(fileName);
    // Find Kael's chat or open first available DM
    const targetChat =
      CHAT_ITEMS.find((c) => c.id === 'chat-kael') || CHAT_ITEMS[1];
    setSelectedChat(targetChat);
    triggerToast(`Attached "${fileName}" to chat with ${targetChat.title}`);
  };

  const handleGoLive = () => {
    soundEngine.playClick(880, 0.1);
    triggerToast('Broadcasting live master audio to Meki Network (18ms)', 'sensors');
  };

  return (
    <div className="min-h-screen bg-[#0f131c] text-[#dfe2ee] flex flex-col selection:bg-[#ff4f73] selection:text-[#5a001b] font-body">
      {/* Dynamic Top App Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          soundEngine.playClick(500, 0.04);
          setCurrentTab(tab);
        }}
        onOpenProfile={() => setCurrentTab('profile')}
        onOpenNotifications={() => {
          setShowNotifications(!showNotifications);
          setUnreadNotifications(0);
        }}
        unreadCount={unreadNotifications}
      />

      {/* Notifications Drawer / Dropdown */}
      {showNotifications && (
        <div className="fixed top-16 right-4 z-50 w-80 rounded-2xl bg-[#1c2028] border border-[#31353e] shadow-2xl p-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-[#262a33]">
            <span className="text-xs font-bold text-[#dfe2ee] uppercase tracking-wider font-label">
              Live Studio Alerts
            </span>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-xs text-[#ac888b] hover:text-[#dfe2ee]"
            >
              Close
            </button>
          </div>
          <div className="flex flex-col space-y-2 mt-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-2 rounded-xl bg-[#181c24] hover:bg-[#262a33] transition-colors cursor-pointer flex items-start space-x-2.5 border border-white/5"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${n.color}20`, color: n.color }}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {n.icon}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#dfe2ee] truncate">
                      {n.title}
                    </span>
                    <span className="text-[10px] text-[#ac888b] font-mono">
                      {n.time}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#e5bdc0] leading-tight mt-0.5">
                    {n.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Viewport based on current tab */}
      <main className="flex-1 flex flex-col w-full">
        {currentTab === 'chats' && (
          <ChatsScreen
            onSelectChat={(chat) => setSelectedChat(chat)}
            onOpenStory={(story) => setSelectedStory(story)}
            onGoLive={handleGoLive}
            onShowToast={triggerToast}
            onOpenExploreWithHandle={handleOpenExploreWithHandle}
          />
        )}

        {currentTab === 'explore' && (
          <ExploreScreen
            onOpenMessage={handleOpenMessageFromHandle}
            onNavigateToStems={() => setCurrentTab('stems-music')}
            onShowToast={triggerToast}
          />
        )}

        {currentTab === 'stems-music' && (
          <StemsScreen
            onOpenEQRack={() => setIsEQModalOpen(true)}
            onSendStemToChat={handleSendStemToChat}
            onShowToast={triggerToast}
          />
        )}

        {currentTab === 'profile' && (
          <div className="pt-16">
            <ProfileModal onShowToast={triggerToast} />
          </div>
        )}
      </main>

      {/* Persistent Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          soundEngine.playClick(520, 0.04);
          setCurrentTab(tab);
        }}
        unreadChats={4}
      />

      {/* Full-Screen Chat Detail Modal (Active Thread) */}
      {selectedChat && (
        <ChatDetailModal
          chat={selectedChat}
          onClose={() => setSelectedChat(null)}
          onShowToast={triggerToast}
          attachedStem={attachedStemForChat}
          onClearAttachedStem={() => setAttachedStemForChat(null)}
        />
      )}

      {/* Studio Drop Story Modal */}
      {selectedStory && (
        <StoryModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          onOpenChat={(handle) => {
            if (handle) handleOpenMessageFromHandle(handle);
          }}
          onSendStemToMixer={(title) => {
            setCurrentTab('stems-music');
            triggerToast(`Imported ${title} to 4-Track Stem Mixer!`);
          }}
        />
      )}

      {/* Parametric EQ & FX Rack Modal */}
      <EQModal
        isOpen={isEQModalOpen}
        onClose={() => setIsEQModalOpen(false)}
        onApplyToast={triggerToast}
      />

      {/* Delight Feedback Toast */}
      <Toast message={toastMessage} icon={toastIcon} />
    </div>
  );
}
