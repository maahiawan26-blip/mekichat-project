import React, { useState } from 'react';
import { ChatItem, CreatorStory } from '../types';
import { CHAT_ITEMS, CREATOR_STORIES } from '../data/mockData';
import { soundEngine } from '../utils/audioEngine';

interface ChatsScreenProps {
  onSelectChat: (chat: ChatItem) => void;
  onOpenStory: (story: CreatorStory) => void;
  onGoLive: () => void;
  onShowToast: (msg: string) => void;
  onOpenExploreWithHandle?: (handle: string) => void;
}

export const ChatsScreen: React.FC<ChatsScreenProps> = ({
  onSelectChat,
  onOpenStory,
  onGoLive,
  onShowToast,
  onOpenExploreWithHandle,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'dms' | 'channels' | 'stems'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingStemChatId, setPlayingStemChatId] = useState<string | null>(null);

  const filterTabs: {
    id: 'all' | 'dms' | 'channels' | 'stems';
    label: string;
    badge?: string;
  }[] = [
    { id: 'all', label: 'All Chats' },
    { id: 'dms', label: 'Direct DMs', badge: '3' },
    { id: 'channels', label: 'Channels & Groups' },
    { id: 'stems', label: 'Stem Collabs' },
  ];

  const filteredChats = CHAT_ITEMS.filter((item) => {
    // category filter
    if (activeCategory !== 'all' && !item.categories.includes(activeCategory)) {
      return false;
    }
    // search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchHandle = item.handle?.toLowerCase().includes(q);
      const matchPreview = item.previewText.toLowerCase().includes(q);
      return matchTitle || matchHandle || matchPreview;
    }
    return true;
  });

  const toggleInlineAudio = (e: React.MouseEvent, chatId: string, label: string) => {
    e.stopPropagation();
    if (playingStemChatId === chatId) {
      soundEngine.stop();
      setPlayingStemChatId(null);
      onShowToast('Stem playback stopped');
    } else {
      setPlayingStemChatId(chatId);
      soundEngine.playStemSnippet(
        chatId,
        undefined,
        () => setPlayingStemChatId(null)
      );
      onShowToast(`Playing stem: ${label}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-[#0f131c] min-h-screen">
      <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-4 pt-2">
        {/* Top Hub Panel: Live Socket Status & Rapid Handle Search Bar */}
        <div className="flex flex-col space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#262a33] text-[#4edea3] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping" />
                <span className="text-[10px] font-bold tracking-wider uppercase font-label">
                  Live Socket.io
                </span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#1c2028] text-[#e5bdc0] text-[10px] font-mono">
                18ms latency
              </span>
            </div>

            {/* Live Broadcast Quick Action */}
            <button
              onClick={onGoLive}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[#ff4f73] text-[#5a001b] text-xs font-bold active:scale-95 transition-transform shadow-[0_2px_10px_rgba(255,79,115,0.4)]"
            >
              <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
              <span>Go Live</span>
            </button>
          </div>

          {/* Rapid Search Input / Filter Trigger */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#e5bdc0]">
              <span className="material-symbols-outlined text-[20px]">alternate_email</span>
            </div>
            <input
              id="handleSearchInput"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search @handle, stems, drops, or tags..."
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#262a33] text-[#dfe2ee] placeholder-[#ac888b] text-sm focus:outline-none focus:bg-[#31353e] transition-all shadow-inner border border-transparent focus:border-[#ff4f73]/50"
            />
            <button
              aria-label="Filter Search"
              onClick={() => {
                if (searchQuery) setSearchQuery('');
                onShowToast(searchQuery ? 'Filter cleared' : 'Audio stem filter active');
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#e5bdc0] hover:text-[#ffb2ba] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                {searchQuery ? 'close' : 'tune'}
              </span>
            </button>
          </div>
        </div>

        {/* Realtime Stories & Active Audio Creator Drops */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#ffb2ba]">
                sensors
              </span>
              <span className="text-xs text-[#dfe2ee] uppercase tracking-wider font-bold font-label">
                Studio Drops
              </span>
            </div>
            <span className="text-[11px] text-[#e5bdc0]">4 Sessions Live</span>
          </div>

          {/* Horizontal Creator Scroll */}
          <div className="flex items-center space-x-3.5 overflow-x-auto py-2 no-scrollbar">
            {CREATOR_STORIES.map((story) => {
              if (story.badgeType === 'add') {
                return (
                  <button
                    key={story.id}
                    onClick={() => {
                      soundEngine.playClick(600, 0.05);
                      onShowToast('Post New Stem modal opened');
                    }}
                    className="flex flex-col items-center flex-shrink-0 group focus:outline-none"
                  >
                    <div className="relative w-14 h-14 rounded-full bg-[#262a33] flex items-center justify-center shadow-md group-active:scale-95 transition-transform border border-[#31353e]">
                      <div className="w-12 h-12 rounded-full bg-[#1c2028] flex items-center justify-center text-[#ffb2ba]">
                        <span className="material-symbols-outlined text-[24px]">add</span>
                      </div>
                      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#ff4f73] text-[#5a001b] flex items-center justify-center text-[10px] font-bold shadow-sm">
                        +
                      </span>
                    </div>
                    <span className="mt-1.5 text-[11px] text-[#e5bdc0] font-label">
                      Post Stem
                    </span>
                  </button>
                );
              }

              return (
                <div
                  key={story.id}
                  onClick={() => onOpenStory(story)}
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer active:scale-95 transition-transform group"
                >
                  <div
                    className={`relative w-14 h-14 rounded-full p-0.5 ${
                      story.badgeType === 'live'
                        ? 'bg-gradient-to-tr from-[#ff4f73] via-[#ffb2ba] to-[#dbb8ff] shadow-[0_0_12px_rgba(255,79,115,0.45)] animate-pulse'
                        : story.badgeType === 'vocal'
                        ? 'bg-gradient-to-r from-[#4edea3] to-[#ffb2ba] shadow-[0_0_12px_rgba(78,222,163,0.35)]'
                        : story.badgeType === 'music'
                        ? 'bg-gradient-to-tr from-[#dbb8ff] to-[#4edea3] shadow-[0_0_12px_rgba(219,184,255,0.4)]'
                        : 'bg-gradient-to-bl from-[#6807ba] via-[#ff4f73] to-[#353942]'
                    }`}
                  >
                    <img
                      src={story.avatar}
                      alt={story.name}
                      className="w-full h-full rounded-full object-cover"
                    />

                    {story.badge && (
                      <span
                        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-tight whitespace-nowrap ${
                          story.badgeType === 'live'
                            ? 'bg-[#ff4f73] text-[#5a001b]'
                            : 'bg-[#4edea3] text-[#003824]'
                        }`}
                      >
                        {story.badge}
                      </span>
                    )}

                    {story.badgeType === 'music' && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#4edea3] flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[10px] text-[#003824]">
                          music_note
                        </span>
                      </span>
                    )}

                    {story.badgeType === 'repeat' && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#6807ba] text-[#d0a6ff] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[10px]">repeat</span>
                      </span>
                    )}
                  </div>
                  <span className="mt-1.5 text-[11px] text-[#dfe2ee] font-medium max-w-[64px] truncate font-label">
                    {story.handle || story.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Interactive Segmented Filters */}
        <div className="w-full overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center space-x-2 min-w-max" id="filterTabs">
            {filterTabs.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#ff4f73] text-[#5a001b] shadow-md'
                      : 'bg-[#262a33] text-[#e5bdc0] hover:text-[#dfe2ee]'
                  }`}
                >
                  {tab.label}
                  {tab.badge && (
                    <span
                      className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-[#5a001b]/20 text-[#5a001b]'
                          : 'bg-[#ffb2ba]/20 text-[#ffb2ba]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Unified Chat Streams List */}
        <div className="flex flex-col space-y-2.5 w-full" id="chatListContainer">
          {filteredChats.map((chat) => {
            if (chat.id === 'chat-meki-official') {
              return (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat)}
                  className="w-full p-3.5 rounded-2xl bg-[#1c2028] hover:bg-[#262a33] transition-colors cursor-pointer flex items-start space-x-3 shadow-sm border border-[#262a33]/60"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#ff4f73] via-[#6807ba] to-[#0a0e16] p-0.5 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#0a0e16] flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-[26px] text-[#ffb2ba]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          campaign
                        </span>
                      </div>
                    </div>
                    <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[#6807ba] text-[#d0a6ff] flex items-center justify-center shadow">
                      <span className="material-symbols-outlined text-[12px]">push_pin</span>
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 truncate">
                        <h3 className="text-base font-bold text-[#dfe2ee] truncate font-headline">
                          {chat.title}
                        </h3>
                        <span
                          className="material-symbols-outlined text-[#ffb2ba] text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          verified
                        </span>
                        <span className="px-1.5 py-0.2 rounded-md bg-[#31353e] text-[#e5bdc0] text-[10px] uppercase font-bold">
                          Channel
                        </span>
                      </div>
                      <span className="text-[11px] text-[#e5bdc0] ml-2 flex-shrink-0">
                        {chat.time}
                      </span>
                    </div>

                    <p className="text-sm text-[#e5bdc0] truncate mt-0.5">
                      <span className="text-[#ffb2ba] font-semibold">Drop 04 Countdown:</span>{' '}
                      Modular Synth Packs unlocked in 45m! Presave is open.
                    </p>

                    {/* Drop Timer Badge & Audio Wave Hint */}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-[#262a33] text-[#4edea3] text-xs">
                        <span className="material-symbols-outlined text-[14px]">timer</span>
                        <span>T-Minus 00:45:12</span>
                      </span>
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-[#262a33] text-[#dbb8ff] text-xs">
                        <span className="material-symbols-outlined text-[14px]">token</span>
                        <span>Free Pass</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            if (chat.id === 'chat-kael') {
              return (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat)}
                  className="w-full p-3.5 rounded-2xl bg-[#1c2028] hover:bg-[#262a33] transition-colors cursor-pointer flex items-start space-x-3 shadow-sm border border-[#262a33]/60"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={chat.avatar}
                      alt={chat.title}
                      className="w-12 h-12 rounded-full object-cover ring-1 ring-[#ff4f73]/30"
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#4edea3] ring-2 ring-[#1c2028] shadow-[0_0_6px_rgba(78,222,163,0.8)]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 truncate">
                        <h3 className="text-base font-bold text-[#dfe2ee] truncate font-headline">
                          {chat.title}
                        </h3>
                        <span className="text-xs text-[#e5bdc0] truncate">{chat.handle}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 ml-2 flex-shrink-0">
                        <span className="text-xs text-[#ffb2ba] font-bold">Delivered</span>
                        <span className="material-symbols-outlined text-[16px] text-[#4edea3]">
                          done_all
                        </span>
                      </div>
                    </div>

                    {/* Stem Audio Visualizer Snippet inside Chat Preview */}
                    <div className="mt-2 p-2 rounded-xl bg-[#0a0e16] flex items-center justify-between space-x-2 border border-white/5">
                      <button
                        aria-label="Play Stem"
                        onClick={(e) => toggleInlineAudio(e, chat.id, 'Sidechain_Master_126BPM.wav')}
                        className="w-8 h-8 rounded-full bg-[#ff4f73] text-[#5a001b] flex items-center justify-center flex-shrink-0 shadow-sm active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {playingStemChatId === chat.id ? 'pause' : 'play_arrow'}
                        </span>
                      </button>

                      {/* SVG Audio Waveform */}
                      <div className="flex-1 flex items-center space-x-0.5 h-6">
                        <div className="w-1 h-2 rounded-full bg-[#ffb2ba] animate-pulse" />
                        <div className="w-1 h-4 rounded-full bg-[#ffb2ba]" />
                        <div className="w-1 h-5 rounded-full bg-[#ff4f73]" />
                        <div className="w-1 h-3 rounded-full bg-[#ffb2ba]" />
                        <div className="w-1 h-6 rounded-full bg-[#4edea3]" />
                        <div className="w-1 h-4 rounded-full bg-[#4edea3]" />
                        <div className="w-1 h-5 rounded-full bg-[#31353e]" />
                        <div className="w-1 h-2 rounded-full bg-[#31353e]" />
                        <div className="w-1 h-4 rounded-full bg-[#31353e]" />
                        <div className="w-1 h-6 rounded-full bg-[#31353e]" />
                        <div className="w-1 h-3 rounded-full bg-[#31353e]" />
                        <div className="w-1 h-1 rounded-full bg-[#31353e]" />
                      </div>

                      {/* Metadata Tags */}
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <span className="px-1.5 py-0.5 rounded bg-[#1c2028] text-[#dbb8ff] text-[10px] font-mono">
                          126 BPM
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#1c2028] text-[#4edea3] text-[10px] font-mono">
                          Fm
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-[#e5bdc0] truncate">{chat.previewText}</p>
                      <span className="w-5 h-5 rounded-full bg-[#ff4f73] text-[#5a001b] text-[11px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(255,79,115,0.7)] ml-2 flex-shrink-0">
                        2
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            if (chat.id === 'chat-80s-synth') {
              return (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat)}
                  className="w-full p-3.5 rounded-2xl bg-[#1c2028] hover:bg-[#262a33] transition-colors cursor-pointer flex items-start space-x-3 shadow-sm border border-[#262a33]/60"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#31353e] flex items-center justify-center overflow-hidden">
                      <div className="grid grid-cols-2 w-full h-full p-0.5 gap-0.5">
                        <div className="bg-[#ff4f73]/40 rounded-tl-full flex items-center justify-center text-[10px] font-bold text-[#5a001b]">
                          80s
                        </div>
                        <div className="bg-[#dbb8ff]/40 rounded-tr-full flex items-center justify-center text-[10px] font-bold text-[#470083]">
                          SYN
                        </div>
                        <div className="bg-[#4edea3]/40 rounded-bl-full flex items-center justify-center text-[10px] font-bold text-[#00311f]">
                          LFO
                        </div>
                        <div className="bg-[#353942] rounded-br-full flex items-center justify-center text-[10px] font-bold text-[#dfe2ee]">
                          +18
                        </div>
                      </div>
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 px-1 py-0.2 rounded-full bg-[#31353e] text-[#dbb8ff] text-[9px] font-mono">
                      24
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#dfe2ee] truncate font-headline">
                        {chat.title}
                      </h3>
                      <span className="text-[11px] text-[#e5bdc0] flex-shrink-0">Just now</span>
                    </div>

                    {/* Animated Typing Indicator Line */}
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#262a33]">
                        <span className="text-xs text-[#dbb8ff] font-semibold">@synth.meki</span>
                        <span className="text-xs text-[#e5bdc0]">is typing</span>
                        <div className="flex items-center space-x-0.5 ml-1">
                          <span className="w-1 h-1 rounded-full bg-[#dbb8ff] animate-bounce" />
                          <span className="w-1 h-1 rounded-full bg-[#dbb8ff] animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1 h-1 rounded-full bg-[#dbb8ff] animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#ac888b] truncate mt-1">
                      Alex: Has anyone dialed that Juno-106 chorus recreation in the master stem?
                    </p>
                  </div>
                </div>
              );
            }

            if (chat.id === 'chat-elena') {
              return (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat)}
                  className="w-full p-3.5 rounded-2xl bg-[#1c2028] hover:bg-[#262a33] transition-colors cursor-pointer flex items-start space-x-3 shadow-sm border border-[#262a33]/60"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={chat.avatar}
                      alt={chat.title}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#31353e] ring-2 ring-[#1c2028]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 truncate">
                        <h3 className="text-base font-bold text-[#dfe2ee] truncate font-headline">
                          {chat.title}
                        </h3>
                        <span className="text-xs text-[#e5bdc0] truncate">{chat.handle}</span>
                      </div>
                      <span className="text-[11px] text-[#e5bdc0] ml-2 flex-shrink-0">
                        Yesterday
                      </span>
                    </div>

                    {/* Inline Voice Note Bar */}
                    <div className="flex items-center space-x-2 mt-2 p-2 rounded-xl bg-[#262a33]">
                      <button
                        aria-label="Play Voice Note"
                        onClick={(e) => toggleInlineAudio(e, chat.id, 'Elena Voice Note')}
                        className="w-7 h-7 rounded-full bg-[#00a572] text-[#00311f] flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {playingStemChatId === chat.id ? 'pause' : 'play_arrow'}
                        </span>
                      </button>

                      <div className="flex-1 flex items-center space-x-0.5 h-4">
                        <div className="w-1 h-3 rounded-full bg-[#4edea3]" />
                        <div className="w-1 h-4 rounded-full bg-[#4edea3]" />
                        <div className="w-1 h-2 rounded-full bg-[#4edea3]" />
                        <div className="w-1 h-3.5 rounded-full bg-[#4edea3]" />
                        <div className="w-1 h-1 rounded-full bg-[#4edea3]" />
                        <div className="w-1 h-4 rounded-full bg-[#31353e]" />
                        <div className="w-1 h-3 rounded-full bg-[#31353e]" />
                        <div className="w-1 h-2 rounded-full bg-[#31353e]" />
                        <div className="w-1 h-3.5 rounded-full bg-[#31353e]" />
                        <div className="w-1 h-1.5 rounded-full bg-[#31353e]" />
                        <div className="w-1 h-2.5 rounded-full bg-[#31353e]" />
                        <div className="w-1 h-1 rounded-full bg-[#31353e]" />
                      </div>

                      <span className="text-[11px] text-[#e5bdc0] font-mono flex-shrink-0">
                        0:42
                      </span>
                    </div>

                    <p className="text-xs text-[#e5bdc0] mt-1.5 flex items-center space-x-1">
                      <span className="material-symbols-outlined text-[14px] text-[#4edea3]">
                        mic
                      </span>
                      <span>Voice memo on bridge harmony progression</span>
                    </p>
                  </div>
                </div>
              );
            }

            // Default row: Marcus Bell
            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className="w-full p-3.5 rounded-2xl bg-[#1c2028] hover:bg-[#262a33] transition-colors cursor-pointer flex items-start space-x-3 shadow-sm border border-[#262a33]/60"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.title}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#4edea3] ring-2 ring-[#1c2028]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 truncate">
                      <h3 className="text-base font-bold text-[#dfe2ee] truncate font-headline">
                        {chat.title}
                      </h3>
                      <span className="text-xs text-[#e5bdc0]">{chat.handle}</span>
                    </div>
                    <span className="text-[11px] text-[#e5bdc0] ml-2 flex-shrink-0">3d ago</span>
                  </div>

                  <div className="flex items-center space-x-1.5 mt-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#6807ba] text-[#d0a6ff] text-xs font-semibold flex items-center space-x-1">
                      <span className="material-symbols-outlined text-[13px]">tune</span>
                      <span>Remix Collab Invite</span>
                    </span>
                    <span className="text-xs text-[#e5bdc0] truncate">Sent 3 stems (.wav)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 right-4 z-30 flex flex-col items-end space-y-2.5">
        <button
          aria-label="Direct @handle Search"
          onClick={() => {
            const input = document.getElementById('handleSearchInput');
            if (input) {
              input.focus();
              input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            if (onOpenExploreWithHandle) onOpenExploreWithHandle('@synth');
          }}
          className="w-10 h-10 rounded-full bg-[#262a33] text-[#dfe2ee] flex items-center justify-center shadow-lg hover:text-[#ffb2ba] transition-all active:scale-95 border border-[#31353e]"
        >
          <span className="material-symbols-outlined text-[20px]">alternate_email</span>
        </button>

        <button
          aria-label="Compose Chat"
          onClick={() => {
            soundEngine.playClick(720, 0.06);
            onShowToast('New Collab Dialog opened: search @handle to connect');
            const input = document.getElementById('handleSearchInput');
            if (input) input.focus();
          }}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#ff4f73] via-[#ff3366] to-[#6807ba] text-white font-bold shadow-[0_4px_20px_rgba(255,79,115,0.5)] flex items-center justify-center active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
        </button>
      </div>
    </div>
  );
};
