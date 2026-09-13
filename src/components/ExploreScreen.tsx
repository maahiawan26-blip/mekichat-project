import React, { useState } from 'react';
import { SearchMatch, TrendingStem } from '../types';
import { SEARCH_MATCHES, TRENDING_STEMS } from '../data/mockData';
import { soundEngine } from '../utils/audioEngine';

interface ExploreScreenProps {
  onOpenMessage: (handle: string) => void;
  onNavigateToStems: () => void;
  onShowToast: (msg: string) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onOpenMessage,
  onNavigateToStems,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('synth');
  const [activeFilter, setActiveFilter] = useState<'all' | 'creators' | 'channels' | 'stems'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    '@meki_official',
    '@beats_drop',
    '@analog_love',
  ]);
  const [playingStemId, setPlayingStemId] = useState<string | null>(null);
  const [bookmarkedStems, setBookmarkedStems] = useState<Record<string, boolean>>({});

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'creators', label: 'Creators' },
    { id: 'channels', label: 'Channels' },
    { id: 'stems', label: 'Audio Stems' },
  ] as const;

  const removeRecent = (item: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== item));
    onShowToast(`Removed ${item} from history`);
  };

  const clearAllHistory = () => {
    setRecentSearches([]);
    onShowToast('Search history cleared');
  };

  const toggleStemPlay = (stem: TrendingStem) => {
    if (playingStemId === stem.id) {
      soundEngine.stop();
      setPlayingStemId(null);
      onShowToast('Stem paused');
    } else {
      setPlayingStemId(stem.id);
      soundEngine.playStemSnippet(
        stem.id,
        undefined,
        () => setPlayingStemId(null)
      );
      onShowToast(`Playing: ${stem.title} (${stem.bpm} BPM)`);
    }
  };

  const toggleBookmark = (stemId: string, title: string) => {
    setBookmarkedStems((prev) => {
      const next = { ...prev, [stemId]: !prev[stemId] };
      onShowToast(next[stemId] ? `Saved "${title}" to favorites` : `Removed "${title}"`);
      return next;
    });
  };

  // Filter matches based on active tab and query
  const filteredMatches = SEARCH_MATCHES.filter((m) => {
    if (activeFilter === 'creators' && m.isChannel) return false;
    if (activeFilter === 'channels' && !m.isChannel) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().replace('@', '');
      const matchHandle = m.handle.toLowerCase().includes(q);
      const matchName = m.displayName.toLowerCase().includes(q);
      const matchSub = m.subtitle.toLowerCase().includes(q);
      return matchHandle || matchName || matchSub;
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-[#0f131c] min-h-screen">
      <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 pb-8 space-y-6 pt-2">
        {/* Search & Filter Area */}
        <section className="flex flex-col space-y-3.5">
          {/* Active Focused Search Input Field */}
          <div className="relative w-full flex items-center bg-[#262a33] rounded-full px-4 py-1.5 space-x-2.5 shadow-md border border-[#31353e] focus-within:border-[#ff4f73] transition-all">
            <span className="material-symbols-outlined text-[#ffb2ba] text-[22px] select-none">
              search
            </span>
            <div className="flex-1 flex items-center">
              <span className="text-base text-[#ffb2ba] font-bold font-headline">@</span>
              <input
                id="instant-search-input"
                type="text"
                aria-label="Instant handle search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search handles, creators, stems..."
                className="w-full bg-transparent border-none outline-none text-base text-[#dfe2ee] placeholder-[#ac888b] caret-[#ff4f73] pl-0.5"
              />
            </div>

            {searchQuery && (
              <button
                id="clear-search-btn"
                aria-label="Clear query"
                onClick={() => setSearchQuery('')}
                className="w-7 h-7 rounded-full bg-[#31353e]/80 text-[#e5bdc0] hover:text-white flex items-center justify-center active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}

            <div
              className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.9)] animate-pulse"
              title="Live indexed"
            />
          </div>

          {/* Filter Pills / Categories */}
          <div
            className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5"
            role="tablist"
          >
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-all ${
                    isActive
                      ? 'bg-[#ff4f73] text-[#5a001b] shadow-[0_0_12px_rgba(255,79,115,0.4)]'
                      : 'bg-[#262a33] text-[#e5bdc0] font-medium hover:text-[#dfe2ee]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Recent Searches Quick Chips */}
        {recentSearches.length > 0 && (
          <section className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#ac888b] uppercase tracking-wider font-semibold font-label">
                Recent Searches
              </span>
              <button
                onClick={clearAllHistory}
                className="text-[11px] text-[#e5bdc0] hover:text-[#ffb2ba] transition-colors"
              >
                Clear History
              </button>
            </div>

            <div className="flex items-center flex-wrap gap-2 pt-1">
              {recentSearches.map((term) => (
                <div
                  key={term}
                  onClick={() => setSearchQuery(term.replace('@', ''))}
                  className="flex items-center bg-[#181c24] rounded-full px-3.5 py-1 space-x-1.5 text-[#e5bdc0] hover:bg-[#1c2028] hover:text-[#dfe2ee] transition-colors cursor-pointer group border border-[#262a33]"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#ac888b] group-hover:text-[#ffb2ba]">
                    history
                  </span>
                  <span className="text-xs text-[#dfe2ee] font-medium">{term}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecent(term);
                    }}
                    className="p-0.5 hover:text-[#ff4f73]"
                  >
                    <span className="material-symbols-outlined text-[14px] text-[#ac888b] hover:text-[#ff4f73] pl-0.5">
                      close
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Live Search & Autocomplete Results */}
        <section className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="text-base text-[#dfe2ee] font-bold font-headline">
                Matches for
              </span>
              <span className="text-base text-[#ffb2ba] font-bold font-headline">
                &ldquo;@{searchQuery || 'all'}&rdquo;
              </span>
            </div>
            <span className="text-xs text-[#ac888b] font-mono">
              {filteredMatches.length} results
            </span>
          </div>

          {/* Result List Container */}
          <div className="flex flex-col space-y-2.5">
            {filteredMatches.map((match) => (
              <article
                key={match.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1c2028] hover:bg-[#262a33] transition-all group shadow-sm border border-[#262a33]/60"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="relative flex-shrink-0">
                    {match.isChannel ? (
                      <div className="w-12 h-12 rounded-2xl bg-[#6807ba] text-[#d0a6ff] flex items-center justify-center shadow-[0_0_12px_rgba(104,7,186,0.3)]">
                        <span className="material-symbols-outlined text-[26px]">
                          {match.channelIcon || 'groups'}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={match.avatar}
                        alt={match.handle}
                        className="w-12 h-12 rounded-full object-cover shadow-[0_0_10px_rgba(255,79,115,0.25)]"
                      />
                    )}

                    {match.badge && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-[#ff4f73] text-[#5a001b] rounded-full text-[9px] font-bold uppercase tracking-tight shadow">
                        {match.badge}
                      </span>
                    )}

                    {match.statusIndicator?.type === 'online' && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.8)] ring-2 ring-[#1c2028]" />
                    )}

                    {match.statusIndicator?.type === 'voice_jam' && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#dbb8ff] shadow-[0_0_6px_#dbb8ff] ring-2 ring-[#1c2028]" />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="text-base text-[#dfe2ee] truncate font-bold font-headline">
                        {match.handle}
                      </span>
                      {match.isVerified && (
                        <span
                          className="material-symbols-outlined text-[#dbb8ff] text-[16px] flex-shrink-0"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                          title="Verified Creator"
                        >
                          verified
                        </span>
                      )}
                      {match.isChannel && (
                        <span className="text-[10px] bg-[#31353e] px-1.5 py-0.5 rounded text-[#e5bdc0] font-bold uppercase">
                          Channel
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#e5bdc0] truncate mt-0.5">{match.subtitle}</p>

                    {match.statusIndicator && (
                      <div className="flex items-center space-x-1 mt-0.5">
                        {match.statusIndicator.type === 'online' && (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
                            <span className="text-[11px] text-[#4edea3] font-medium">
                              {match.statusIndicator.text}
                            </span>
                          </>
                        )}
                        {match.statusIndicator.type === 'voice_jam' && (
                          <>
                            <span className="material-symbols-outlined text-[#dbb8ff] text-[13px]">
                              graphic_eq
                            </span>
                            <span className="text-[11px] text-[#dbb8ff] font-medium">
                              {match.statusIndicator.text}
                            </span>
                          </>
                        )}
                        {match.statusIndicator.type === 'members' && (
                          <span className="text-[11px] text-[#ac888b]">
                            {match.statusIndicator.text}
                          </span>
                        )}
                        {match.statusIndicator.type === 'follows' && (
                          <span className="text-[11px] text-[#ac888b]">
                            {match.statusIndicator.text}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {match.actionType === 'message' && (
                  <button
                    onClick={() => onOpenMessage(match.handle)}
                    className="flex-shrink-0 px-4 py-1.5 rounded-full bg-[#ff4f73] text-[#5a001b] text-xs font-bold shadow-[0_0_12px_rgba(255,79,115,0.35)] active:scale-95 transition-all"
                  >
                    Message
                  </button>
                )}

                {match.actionType === 'join' && (
                  <button
                    onClick={() => {
                      soundEngine.playClick(640, 0.06);
                      onShowToast(`Joined channel ${match.handle}`);
                    }}
                    className="flex-shrink-0 px-4 py-1.5 rounded-full bg-[#dbb8ff] text-[#470083] text-xs font-bold shadow-[0_0_10px_rgba(219,184,255,0.3)] active:scale-95 transition-all"
                  >
                    Join
                  </button>
                )}

                {match.actionType === 'connect' && (
                  <button
                    onClick={() => {
                      soundEngine.playClick(580, 0.05);
                      onShowToast(`Collab request sent to ${match.handle}`);
                    }}
                    className="flex-shrink-0 px-4 py-1.5 rounded-full bg-[#262a33] text-[#dfe2ee] text-xs font-semibold hover:bg-[#353942] active:scale-95 transition-all border border-[#31353e]"
                  >
                    Connect
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Trending Sound Drops & Stem Remixes Section */}
        <section className="flex flex-col space-y-3.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff4f73] animate-ping" />
              <span className="text-base text-[#dfe2ee] font-bold font-headline">
                Trending Stem Drops
              </span>
            </div>
            <button
              onClick={onNavigateToStems}
              className="text-xs text-[#ffb2ba] font-semibold flex items-center hover:underline"
            >
              See Stems
              <span className="material-symbols-outlined text-[16px] ml-0.5">chevron_right</span>
            </button>
          </div>

          {/* Mini Audio Cards Grid */}
          <div className="grid grid-cols-1 gap-3">
            {TRENDING_STEMS.map((stem) => {
              const isPlaying = playingStemId === stem.id;
              const isSaved = bookmarkedStems[stem.id];
              return (
                <div
                  key={stem.id}
                  className="p-4 rounded-2xl bg-[#181c24] flex flex-col space-y-3 shadow-md border border-[#262a33]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0">
                      <button
                        onClick={() => toggleStemPlay(stem)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 active:scale-95 transition-all shadow-md ${
                          isPlaying
                            ? 'bg-[#4edea3] text-[#003824] shadow-[0_0_12px_rgba(78,222,163,0.5)]'
                            : 'bg-[#ff4f73] text-[#5a001b] shadow-[0_0_12px_rgba(255,79,115,0.45)]'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-[22px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                      </button>

                      <div className="flex flex-col min-w-0">
                        <span className="text-sm text-[#dfe2ee] font-bold truncate font-headline">
                          {stem.title}
                        </span>
                        <span className="text-xs text-[#e5bdc0] truncate">
                          Remixed by {stem.creatorHandle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 text-[#ac888b]">
                      <span className="material-symbols-outlined text-[16px]">headphones</span>
                      <span className="text-xs font-mono">{stem.listeners}</span>
                    </div>
                  </div>

                  {/* Dynamic SVG Audio Waveform */}
                  <div className="w-full h-8 bg-[#1c2028] rounded-lg px-2 flex items-center justify-between overflow-hidden">
                    <svg
                      className="w-full h-6"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 240 24"
                    >
                      {/* Played Bars */}
                      <rect fill="#4edea3" height="8" rx="2" width="4" x="0" y="8" />
                      <rect fill="#4edea3" height="16" rx="2" width="4" x="8" y="4" />
                      <rect fill="#4edea3" height="20" rx="2" width="4" x="16" y="2" />
                      <rect fill="#4edea3" height="12" rx="2" width="4" x="24" y="6" />
                      <rect fill="#4edea3" height="22" rx="2" width="4" x="32" y="1" />
                      <rect fill="#4edea3" height="14" rx="2" width="4" x="40" y="5" />
                      <rect fill="#4edea3" height="6" rx="2" width="4" x="48" y="9" />
                      <rect fill="#4edea3" height="18" rx="2" width="4" x="56" y="3" />
                      <rect fill="#4edea3" height="24" rx="2" width="4" x="64" y="0" />
                      <rect fill="#4edea3" height="10" rx="2" width="4" x="72" y="7" />

                      {/* Unplayed Bars */}
                      <rect fill="#5c3f42" height="14" rx="2" width="4" x="80" y="5" />
                      <rect fill="#5c3f42" height="20" rx="2" width="4" x="88" y="2" />
                      <rect fill="#5c3f42" height="8" rx="2" width="4" x="96" y="8" />
                      <rect fill="#5c3f42" height="16" rx="2" width="4" x="104" y="4" />
                      <rect fill="#5c3f42" height="22" rx="2" width="4" x="112" y="1" />
                      <rect fill="#5c3f42" height="12" rx="2" width="4" x="120" y="6" />
                      <rect fill="#5c3f42" height="18" rx="2" width="4" x="128" y="3" />
                      <rect fill="#5c3f42" height="6" rx="2" width="4" x="136" y="9" />
                      <rect fill="#5c3f42" height="14" rx="2" width="4" x="144" y="5" />
                      <rect fill="#5c3f42" height="24" rx="2" width="4" x="152" y="0" />
                      <rect fill="#5c3f42" height="16" rx="2" width="4" x="160" y="4" />
                      <rect fill="#5c3f42" height="10" rx="2" width="4" x="168" y="7" />
                      <rect fill="#5c3f42" height="20" rx="2" width="4" x="176" y="2" />
                      <rect fill="#5c3f42" height="12" rx="2" width="4" x="184" y="6" />
                      <rect fill="#5c3f42" height="18" rx="2" width="4" x="192" y="3" />
                      <rect fill="#5c3f42" height="8" rx="2" width="4" x="200" y="8" />
                      <rect fill="#5c3f42" height="22" rx="2" width="4" x="208" y="1" />
                      <rect fill="#5c3f42" height="14" rx="2" width="4" x="216" y="5" />
                      <rect fill="#5c3f42" height="6" rx="2" width="4" x="224" y="9" />
                      <rect fill="#5c3f42" height="16" rx="2" width="4" x="232" y="4" />
                    </svg>
                  </div>

                  {/* Stem Metadata Tags & Actions */}
                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#1c2028] text-[#4edea3] text-[10px] font-mono font-semibold">
                        {stem.bpm} BPM
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#1c2028] text-[#dbb8ff] text-[10px] font-mono font-semibold">
                        {stem.key}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#1c2028] text-[#e5bdc0] text-[10px]">
                        {stem.audioTag}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        aria-label="Remix stem"
                        onClick={() => {
                          soundEngine.playClick(600, 0.05);
                          onShowToast(`Imported ${stem.title} into Remix Collab Bus`);
                        }}
                        className="p-1 rounded-full text-[#e5bdc0] hover:text-[#ff4f73] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">swap_calls</span>
                      </button>
                      <button
                        aria-label="Add to chat"
                        onClick={() => toggleBookmark(stem.id, stem.title)}
                        className={`p-1 rounded-full transition-colors ${
                          isSaved ? 'text-[#ff4f73]' : 'text-[#e5bdc0] hover:text-[#4edea3]'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-[20px]"
                          style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          {isSaved ? 'bookmark' : 'bookmark_add'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
