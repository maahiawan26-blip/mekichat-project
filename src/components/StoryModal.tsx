import React, { useState, useEffect } from 'react';
import { CreatorStory } from '../types';
import { soundEngine } from '../utils/audioEngine';

interface StoryModalProps {
  story: CreatorStory | null;
  onClose: () => void;
  onOpenChat: (handle: string) => void;
  onSendStemToMixer: (title: string) => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({
  story,
  onClose,
  onOpenChat,
  onSendStemToMixer,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (story && story.id !== 'post-stem') {
      setIsPlaying(true);
      soundEngine.playStemSnippet(
        story.id,
        (p) => setProgress(p),
        () => setIsPlaying(false)
      );
    }
    return () => {
      soundEngine.stop();
    };
  }, [story]);

  if (!story) return null;

  const togglePlay = () => {
    if (isPlaying) {
      soundEngine.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      soundEngine.playStemSnippet(
        story.id,
        (p) => setProgress(p),
        () => setIsPlaying(false)
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#1c2028] border border-[#31353e] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col space-y-4">
        {/* Top glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#ff4f73]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#6807ba]/25 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Close and Progress */}
        <div className="flex flex-col space-y-2 relative z-10">
          <div className="w-full h-1 bg-[#262a33] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ff4f73] to-[#4edea3] transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2.5">
              {story.avatar ? (
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#ff4f73]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#262a33] flex items-center justify-center text-[#ff4f73]">
                  <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#dfe2ee]">{story.name}</span>
                <span className="text-xs text-[#e5bdc0]">{story.handle || 'Studio Drop'}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#262a33] text-[#e5bdc0] hover:text-[#dfe2ee] flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Live Audio Visualizer Card */}
        <div className="relative z-10 p-4 rounded-2xl bg-[#0f131c] border border-[#262a33] flex flex-col items-center justify-center space-y-3">
          <span className="text-xs uppercase font-semibold tracking-wider text-[#4edea3] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping" />
            Live Audio Stem Snippet
          </span>

          <p className="text-base font-bold text-[#dfe2ee] text-center">
            {story.snippetTitle || 'Active Modular Drop Session'}
          </p>

          {/* Animated audio equalizer bars */}
          <div className="flex items-end justify-center gap-1 h-16 w-full px-4">
            {[40, 75, 95, 60, 85, 100, 70, 90, 45, 80, 65, 95, 55, 30].map((h, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isPlaying ? 'bg-gradient-to-t from-[#ff4f73] to-[#4edea3]' : 'bg-[#31353e]'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, (h * (progress + 20)) % 100)}%` : '15%',
                  animationDelay: `${i * 60}ms`,
                }}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full bg-[#262a33] text-[#dbb8ff] text-[11px] font-mono">
              {story.bpm || 126} BPM
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#262a33] text-[#4edea3] text-[11px] font-mono">
              Key: {story.key || 'F#m'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#262a33] text-[#e5bdc0] text-[11px] font-mono">
              24-bit
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 relative z-10 pt-1">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-2xl bg-[#ff4f73] text-[#5a001b] flex items-center justify-center shadow-lg active:scale-95 transition-transform shrink-0"
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <button
            onClick={() => {
              onSendStemToMixer(story.snippetTitle || `${story.name}'s Stem`);
              onClose();
            }}
            className="flex-1 py-3 px-3 rounded-2xl bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#4edea3]">tune</span>
            <span>Import to Mixer</span>
          </button>

          <button
            onClick={() => {
              onOpenChat(story.handle);
              onClose();
            }}
            className="py-3 px-3.5 rounded-2xl bg-[#6807ba] text-[#d0a6ff] hover:brightness-110 text-xs font-bold flex items-center justify-center gap-1 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>DM</span>
          </button>
        </div>
      </div>
    </div>
  );
};
