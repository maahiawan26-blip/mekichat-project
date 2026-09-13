import React, { useState, useEffect } from 'react';
import { MixerTrack } from '../types';
import { MIXER_INITIAL_TRACKS, COMMUNITY_STEMS } from '../data/mockData';
import { soundEngine } from '../utils/audioEngine';

interface StemsScreenProps {
  onOpenEQRack: () => void;
  onSendStemToChat: (fileName: string) => void;
  onShowToast: (msg: string) => void;
}

export const StemsScreen: React.FC<StemsScreenProps> = ({
  onOpenEQRack,
  onSendStemToChat,
  onShowToast,
}) => {
  const [isReminderSet, setIsReminderSet] = useState<boolean>(false);
  const [masterPlaying, setMasterPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(42);
  const [tracks, setTracks] = useState<MixerTrack[]>(MIXER_INITIAL_TRACKS);
  const [playingCommunityStem, setPlayingCommunityStem] = useState<string | null>(null);

  // Sync mixer engine with tracks
  useEffect(() => {
    if (masterPlaying) {
      const hasAnySolo = tracks.some((t) => t.isSolo);
      const activeStems = {
        drums: hasAnySolo
          ? tracks.find((t) => t.id === 'drums')?.isSolo ?? false
          : !(tracks.find((t) => t.id === 'drums')?.isMute ?? false),
        subbass: hasAnySolo
          ? tracks.find((t) => t.id === 'subbass')?.isSolo ?? false
          : !(tracks.find((t) => t.id === 'subbass')?.isMute ?? false),
        juno: hasAnySolo
          ? tracks.find((t) => t.id === 'juno')?.isSolo ?? false
          : !(tracks.find((t) => t.id === 'juno')?.isMute ?? false),
        vocals: hasAnySolo
          ? tracks.find((t) => t.id === 'vocals')?.isSolo ?? false
          : !(tracks.find((t) => t.id === 'vocals')?.isMute ?? false),
      };

      soundEngine.playMixerSession(activeStems, () => {
        setPlaybackProgress((prev) => (prev >= 100 ? 0 : prev + 0.4));
      });
    } else {
      soundEngine.stop();
    }
  }, [masterPlaying, tracks]);

  const toggleRemind = () => {
    setIsReminderSet((prev) => {
      const next = !prev;
      onShowToast(
        next
          ? 'Push alert scheduled for Midnight Synths Vol. 2'
          : 'Drop reminder cancelled'
      );
      return next;
    });
  };

  const toggleMasterPlay = () => {
    if (masterPlaying) {
      setMasterPlaying(false);
      onShowToast('Master Bus audio paused');
    } else {
      setMasterPlaying(true);
      onShowToast('Playing Master Bus Stem Layer (126 BPM)');
    }
  };

  const handleSolo = (id: string) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextSolo = !t.isSolo;
          onShowToast(nextSolo ? `Soloing ${t.name} Channel` : `Unsoloed ${t.name}`);
          return { ...t, isSolo: nextSolo, isMute: false };
        }
        return t;
      })
    );
  };

  const handleMute = (id: string) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextMute = !t.isMute;
          onShowToast(nextMute ? `Muted ${t.name} Channel` : `Unmuted ${t.name}`);
          return { ...t, isMute: nextMute, isSolo: false };
        }
        return t;
      })
    );
  };

  const toggleCardAudio = (fileName: string) => {
    if (playingCommunityStem === fileName) {
      soundEngine.stop();
      setPlayingCommunityStem(null);
      onShowToast('Stem paused');
    } else {
      setPlayingCommunityStem(fileName);
      soundEngine.playStemSnippet(
        fileName,
        undefined,
        () => setPlayingCommunityStem(null)
      );
      onShowToast(`Playing Community Stem: ${fileName}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-[#0f131c] min-h-screen">
      <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-4 pb-8 pt-2">
        {/* Active Drop Countdown Banner */}
        <div className="relative w-full rounded-2xl bg-[#1c2028] p-4 overflow-hidden shadow-lg border border-[#262a33]">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#ff4f73]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-[#6807ba]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex items-center justify-between gap-3 z-10">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#31353e] flex items-center justify-center text-[#ffb2ba] shrink-0 shadow-sm">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  timer
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-[#ffb2ba] font-bold font-label">
                    Stem Drop
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff4f73] animate-pulse" />
                </div>
                <span className="text-base text-[#dfe2ee] truncate font-bold font-headline">
                  Midnight Synths Vol. 2
                </span>
                <span
                  id="dropTimer"
                  className="text-xs text-[#4edea3] font-mono tracking-tight"
                >
                  drops in 04:18:22
                </span>
              </div>
            </div>

            <button
              id="remindBtn"
              onClick={toggleRemind}
              className={`shrink-0 px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-all text-xs font-semibold ${
                isReminderSet
                  ? 'bg-[#ff4f73] text-[#5a001b] shadow-[0_0_12px_rgba(255,79,115,0.4)]'
                  : 'bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isReminderSet ? 'notifications_active' : 'notifications_none'}
              </span>
              <span>{isReminderSet ? 'Reminder Set' : 'Remind Me'}</span>
            </button>
          </div>
        </div>

        {/* Mini Active Player Bar */}
        <div className="relative w-full rounded-2xl bg-[#181c24] p-3 shadow-md border border-[#262a33]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
                <img
                  alt="Midnight Synthesizer Cover"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_E5t9V--gm4LWGOW26z8g4nPKldLUIH6Zrxul0ZWuW-lE23VfZStl1aiCGq6nhWbrrU-gfRok5wFnuWBAhsSDM3mpqjqZSvgX_ViiZPAUEy8afFCGb6cTCq6NyLVXxpa7W_XH9rk1lTPcOSXGcS_dtF7oOjh0mBJps8Nk9EiLsLsIQ7g8xY4AzvDa1at9WjRHubBB3tBTQLswU4uh652hnVnv6Z5naggUAg3Ks8qKa6ZhXMy3Nrdk"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e16]/80 to-transparent flex items-end justify-center pb-1">
                  <span className="material-symbols-outlined text-[14px] text-[#4edea3] animate-pulse">
                    equalizer
                  </span>
                </div>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-[#6807ba] text-[#d0a6ff] px-1.5 py-0.5 rounded-full font-bold">
                    LIVE STEM
                  </span>
                  <span className="text-[11px] text-[#e5bdc0] font-mono">
                    126 BPM • F# Min
                  </span>
                </div>
                <span className="text-sm text-[#dfe2ee] truncate font-semibold font-headline">
                  Midnight Waveform - Track 01
                </span>
                <span className="text-xs text-[#e5bdc0] truncate">
                  Master Bus • Synced with Meki Chat
                </span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                aria-label="Skip Back"
                onClick={() => {
                  soundEngine.playClick(440, 0.05);
                  setPlaybackProgress(Math.max(0, playbackProgress - 15));
                  onShowToast('Rewound 10 seconds');
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#e5bdc0] hover:text-[#dfe2ee] hover:bg-[#1c2028] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">replay_10</span>
              </button>

              <button
                id="masterPlayBtn"
                aria-label="Play Track"
                onClick={toggleMasterPlay}
                className="w-11 h-11 rounded-full bg-[#ff4f73] text-[#5a001b] flex items-center justify-center shadow-lg transition-transform active:scale-95 shadow-[0_0_16px_rgba(255,79,115,0.45)]"
              >
                <span
                  id="masterPlayIcon"
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {masterPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                aria-label="Share"
                onClick={() => onShowToast('Stem link copied to clipboard')}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#e5bdc0] hover:text-[#dfe2ee] hover:bg-[#1c2028] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">share</span>
              </button>
            </div>
          </div>

          {/* Mini Progress Scrubber */}
          <div className="w-full mt-2 pt-1 flex items-center gap-2">
            <span className="text-[11px] text-[#e5bdc0] font-mono">01:42</span>
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = ((e.clientX - rect.left) / rect.width) * 100;
                setPlaybackProgress(pct);
              }}
              className="relative flex-1 h-1.5 bg-[#262a33] rounded-full overflow-hidden cursor-pointer"
            >
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#ff4f73] to-[#dbb8ff] rounded-full transition-all"
                style={{ width: `${playbackProgress}%` }}
              />
            </div>
            <span className="text-[11px] text-[#e5bdc0] font-mono">03:54</span>
          </div>
        </div>

        {/* Quick Stem Mixer Integration Section */}
        <div className="w-full rounded-2xl bg-[#1c2028] p-4 shadow-md space-y-4 border border-[#262a33]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping" />
              <span className="text-base text-[#dfe2ee] font-bold font-headline">
                4-Track Stem Mixer
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#e5bdc0] text-xs font-label">
              <span className="material-symbols-outlined text-[14px]">tune</span>
              <span>Track 01 Isolator</span>
            </div>
          </div>

          {/* 4 Stem Faders Grid */}
          <div className="grid grid-cols-2 gap-3">
            {tracks.map((track) => {
              const isJunoActive = track.id === 'juno';
              return (
                <div
                  key={track.id}
                  className={`bg-[#181c24] rounded-xl p-3 flex flex-col justify-between space-y-2 border transition-all ${
                    track.isSolo
                      ? 'border-[#ff4f73] shadow-[0_0_16px_rgba(255,79,115,0.25)]'
                      : track.isMute
                      ? 'border-[#31353e] opacity-60'
                      : 'border-[#262a33]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ color: track.color }}
                      >
                        {track.icon}
                      </span>
                      <span className="text-xs text-[#dfe2ee] font-bold font-headline">
                        {track.name}
                      </span>
                    </div>
                    <span
                      className="text-[11px] font-mono font-bold"
                      style={{ color: track.color }}
                    >
                      {track.db}
                    </span>
                  </div>

                  {/* Vertical Level Visualizer & Slider */}
                  <div className="relative h-16 w-full bg-[#31353e] rounded-xl flex items-end p-1 overflow-hidden">
                    <div
                      className={`w-full rounded-md flex items-end justify-around px-1 py-0.5 gap-0.5 ${
                        isJunoActive ? 'bg-[#ff4f73]/20' : 'bg-[#31353e]'
                      }`}
                      style={{ height: `${track.level}%` }}
                    >
                      <div
                        className="w-1 rounded-full"
                        style={{
                          backgroundColor: track.color,
                          height: '65%',
                        }}
                      />
                      <div
                        className={`w-1 rounded-full ${
                          masterPlaying || isJunoActive ? 'animate-pulse' : ''
                        }`}
                        style={{
                          backgroundColor: track.color,
                          height: '95%',
                        }}
                      />
                      <div
                        className="w-1 rounded-full"
                        style={{
                          backgroundColor: track.color,
                          height: '80%',
                        }}
                      />
                      <div
                        className={`w-1 rounded-full ${
                          masterPlaying || isJunoActive ? 'animate-pulse' : ''
                        }`}
                        style={{
                          backgroundColor: track.color,
                          height: '100%',
                        }}
                      />
                      <div
                        className="w-1 rounded-full"
                        style={{
                          backgroundColor: track.color,
                          height: '70%',
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1 pt-1">
                    <button
                      onClick={() => handleSolo(track.id)}
                      className={`flex-1 py-1 rounded text-[11px] font-bold text-center transition-colors ${
                        track.isSolo
                          ? 'bg-[#ff4f73] text-[#5a001b]'
                          : 'bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee]'
                      }`}
                    >
                      {track.isSolo ? 'SOLO' : 'Solo'}
                    </button>
                    <button
                      onClick={() => handleMute(track.id)}
                      className={`flex-1 py-1 rounded text-[11px] font-semibold text-center transition-colors ${
                        track.isMute
                          ? 'bg-[#dbb8ff] text-[#470083] font-bold'
                          : 'bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee]'
                      }`}
                    >
                      Mute
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Shortcut to Parametric EQ */}
          <button
            onClick={onOpenEQRack}
            className="w-full py-3 px-4 rounded-full bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] flex items-center justify-between group transition-all border border-[#31353e]"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#dbb8ff]">tune</span>
              <span className="text-xs font-semibold text-[#dfe2ee]">
                Open Full 4-Band Parametric EQ &amp; FX Rack
              </span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#ffb2ba] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        {/* Real-Time Community Stems Feed */}
        <div className="w-full space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#ffb2ba]">forum</span>
              <span className="text-base text-[#dfe2ee] font-bold font-headline">
                Community Stem Feed
              </span>
            </div>
            <span className="text-[11px] text-[#e5bdc0]">Live Syncing (18 Online)</span>
          </div>

          {COMMUNITY_STEMS.map((stem) => {
            const isPlaying = playingCommunityStem === stem.fileName;
            return (
              <div
                key={stem.id}
                className="w-full rounded-2xl bg-[#1c2028] p-4 shadow-md space-y-3 border border-[#262a33]"
              >
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-[#ffb2ba]/40 shrink-0">
                      <img
                        alt={stem.authorName}
                        className="w-full h-full object-cover"
                        src={stem.authorAvatar}
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#dfe2ee] font-headline">
                          {stem.authorName}
                        </span>
                        <span className="text-[11px] text-[#ffb2ba] font-semibold">
                          {stem.authorHandle}
                        </span>
                      </div>
                      <span className="text-xs text-[#e5bdc0]">{stem.description}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#181c24] px-2.5 py-1 rounded-full border border-[#262a33]">
                    <span className="material-symbols-outlined text-[14px] text-[#4edea3]">
                      speed
                    </span>
                    <span className="text-[11px] text-[#dfe2ee] font-mono">
                      {stem.bpm} BPM
                    </span>
                    <span className="text-[#e5bdc0] text-[10px]">•</span>
                    <span className="text-[11px] text-[#dbb8ff] font-mono font-semibold">
                      {stem.key}
                    </span>
                  </div>
                </div>

                {/* Waveform Visualizer Module */}
                <div className="w-full bg-[#0a0e16] rounded-xl p-3 space-y-2 border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCardAudio(stem.fileName)}
                        className="w-8 h-8 rounded-full bg-[#6807ba] text-[#d0a6ff] flex items-center justify-center shrink-0 active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                      </button>
                      <span className="text-xs text-[#dfe2ee] font-medium font-mono truncate">
                        {stem.fileName}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#e5bdc0] font-mono">
                      {stem.audioSpec}
                    </span>
                  </div>

                  {/* Waveform visual bars */}
                  <div className="h-10 w-full flex items-center justify-between gap-[3px] px-1 py-1 cursor-pointer">
                    {[30, 65, 40, 85, 100, 75, 90, 60, 45, 30, 70, 55, 80, 40, 25, 60, 35, 20].map(
                      (h, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all ${
                            isPlaying
                              ? i < 8
                                ? 'bg-[#ff4f73]'
                                : 'bg-[#4edea3]'
                              : i < 4
                              ? 'bg-[#dbb8ff]'
                              : i < 8
                              ? 'bg-[#ff4f73]'
                              : 'bg-[#31353e]'
                          }`}
                          style={{ height: `${h}%` }}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3 text-[#e5bdc0]">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#4edea3]">
                        cached
                      </span>
                      <span className="text-[11px] font-mono">{stem.remixesCount} Remixes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      <span className="text-[11px] font-mono">{stem.fileSize}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        soundEngine.playClick(700, 0.05);
                        onShowToast(`Downloading ${stem.fileName} (${stem.fileSize})...`);
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] flex items-center gap-1 text-xs font-semibold transition-colors border border-[#31353e]"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      <span>Stem</span>
                    </button>
                    <button
                      onClick={() => onSendStemToChat(stem.fileName)}
                      className="px-3.5 py-1.5 rounded-full bg-[#ff4f73] text-[#5a001b] text-xs font-bold flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_12px_rgba(255,79,115,0.4)]"
                    >
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      <span>Send in Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
