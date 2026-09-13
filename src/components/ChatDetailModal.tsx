import React, { useState } from 'react';
import { ChatItem, ChatMessage } from '../types';
import { INITIAL_CONVERSATION } from '../data/mockData';
import { soundEngine } from '../utils/audioEngine';

interface ChatDetailModalProps {
  chat: ChatItem | null;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  attachedStem?: string | null;
  onClearAttachedStem?: () => void;
}

export const ChatDetailModal: React.FC<ChatDetailModalProps> = ({
  chat,
  onClose,
  onShowToast,
  attachedStem,
  onClearAttachedStem,
}) => {
  if (!chat) return null;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return (
      INITIAL_CONVERSATION[chat.id] || [
        {
          id: 'def-1',
          sender: 'other',
          senderName: chat.title,
          text: chat.previewText,
          timestamp: chat.time,
        },
      ]
    );
  });

  const [inputVal, setInputVal] = useState<string>('');
  const [playingStemId, setPlayingStemId] = useState<string | null>(null);

  const handleSendMessage = () => {
    if (!inputVal.trim() && !attachedStem) return;

    soundEngine.playClick(680, 0.05);

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: inputVal.trim() || (attachedStem ? `Attached Stem: ${attachedStem}` : ''),
      timestamp: 'Just now',
      ...(attachedStem
        ? {
            stemAttachment: {
              fileName: attachedStem,
              bpm: 126,
              key: 'F#m',
              duration: '0:32',
            },
          }
        : {}),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');
    if (onClearAttachedStem) onClearAttachedStem();

    // Trigger simulated quick reply after 1.8s
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'other',
        senderName: chat.title,
        text: `Got that! Running it through the analog summing box now.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, replyMsg]);
      soundEngine.playClick(880, 0.08);
      onShowToast(`New message from ${chat.title}`);
    }, 1800);
  };

  const toggleStemAudio = (fileName: string) => {
    if (playingStemId === fileName) {
      soundEngine.stop();
      setPlayingStemId(null);
      onShowToast('Audio playback paused');
    } else {
      setPlayingStemId(fileName);
      soundEngine.playStemSnippet(
        fileName,
        undefined,
        () => setPlayingStemId(null)
      );
      onShowToast(`Streaming stem: ${fileName}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0f131c] animate-fade-in">
      {/* Chat Top Header */}
      <header className="h-16 px-4 bg-[#0a0e16]/95 backdrop-blur-xl border-b border-[#262a33] flex items-center justify-between z-10">
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={onClose}
            className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-[#e5bdc0] hover:text-[#dfe2ee] hover:bg-[#262a33] transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>

          <div className="relative flex-shrink-0">
            {chat.avatar ? (
              <img
                src={chat.avatar}
                alt={chat.title}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-[#ff4f73]/40"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-[#6807ba] text-[#d0a6ff] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  {chat.iconName || 'groups'}
                </span>
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4edea3] ring-2 ring-[#0f131c]" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5 truncate">
              <span className="text-sm font-bold text-[#dfe2ee] truncate font-headline">
                {chat.title}
              </span>
              {chat.isVerified && (
                <span
                  className="material-symbols-outlined text-[#ff4f73] text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#4edea3] font-medium truncate flex items-center gap-1 font-label">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" />
              126 BPM Synced • Live
            </span>
          </div>
        </div>

        {/* Video / Voice Call Triggers */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onShowToast(`Calling ${chat.title} via encrypted studio audio...`)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#e5bdc0] hover:text-[#dfe2ee] hover:bg-[#262a33] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">call</span>
          </button>
          <button
            onClick={() => onShowToast(`Starting live video jam with ${chat.title}...`)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#ffb2ba] hover:bg-[#262a33] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">videocam</span>
          </button>
        </div>
      </header>

      {/* Messages Scroll View */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3.5 max-w-2xl mx-auto w-full">
        <div className="flex justify-center my-2">
          <span className="px-3 py-1 rounded-full bg-[#181c24] text-[#ac888b] text-[11px] font-mono border border-[#262a33]">
            Encrypted Studio Channel • Master Bus
          </span>
        </div>

        {messages.map((m) => {
          const isMe = m.sender === 'me';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl ${
                  isMe
                    ? 'bg-gradient-to-tr from-[#ff4f73] via-[#ff3366] to-[#e0245e] text-white rounded-br-sm shadow-[0_4px_16px_rgba(255,79,115,0.35)]'
                    : 'bg-[#1c2028] text-[#dfe2ee] border border-[#262a33] rounded-bl-sm shadow-md'
                }`}
              >
                {m.text && <p className="text-sm leading-relaxed">{m.text}</p>}

                {/* Inline Stem Audio Player */}
                {m.stemAttachment && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-[#0a0e16]/80 border border-white/10 flex flex-col space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <button
                          onClick={() => toggleStemAudio(m.stemAttachment!.fileName)}
                          className="w-8 h-8 rounded-full bg-[#ff4f73] text-[#5a001b] flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-transform"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {playingStemId === m.stemAttachment.fileName
                              ? 'pause'
                              : 'play_arrow'}
                          </span>
                        </button>
                        <span className="text-xs font-mono font-bold text-[#dfe2ee] truncate">
                          {m.stemAttachment.fileName}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#4edea3] font-mono px-1.5 py-0.5 rounded bg-[#262a33]">
                        {m.stemAttachment.bpm} BPM
                      </span>
                    </div>

                    {/* Waveform graphic */}
                    <div className="flex items-center space-x-0.5 h-6 px-1">
                      {[30, 60, 85, 45, 90, 70, 40, 95, 65, 35, 80, 50, 75, 40, 85, 60, 30].map(
                        (h, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 rounded-full ${
                              playingStemId === m.stemAttachment?.fileName
                                ? idx < 8
                                  ? 'bg-[#4edea3]'
                                  : 'bg-[#ff4f73]'
                                : 'bg-[#31353e]'
                            }`}
                            style={{ height: `${h}%` }}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Voice memo preview */}
                {m.voiceMemo && (
                  <div className="mt-2 p-2 rounded-xl bg-[#0a0e16]/70 border border-white/10 flex items-center space-x-2">
                    <button
                      onClick={() => toggleStemAudio('VoiceMemo_01')}
                      className="w-7 h-7 rounded-full bg-[#00a572] text-[#00311f] flex items-center justify-center shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {playingStemId === 'VoiceMemo_01' ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <div className="flex-1 flex items-center space-x-0.5 h-4">
                      {[40, 70, 50, 85, 60, 30, 65, 40, 75, 90, 55, 35].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-[#4edea3] rounded-full"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-[#e5bdc0]">
                      {m.voiceMemo.duration}
                    </span>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-[#ac888b] mt-1 px-1 font-mono">
                {m.timestamp}
              </span>
            </div>
          );
        })}
      </main>

      {/* Attached Stem Notice Banner if any */}
      {attachedStem && (
        <div className="px-4 py-1.5 bg-[#6807ba]/30 border-t border-[#6807ba]/50 flex items-center justify-between text-xs text-[#d0a6ff]">
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-[16px]">audio_file</span>
            <span className="font-semibold">Attached: {attachedStem}</span>
          </div>
          <button
            onClick={onClearAttachedStem}
            className="text-xs hover:text-white underline"
          >
            Remove
          </button>
        </div>
      )}

      {/* Bottom Message Composer */}
      <footer className="p-3 bg-[#0a0e16]/95 border-t border-[#262a33] pb-safe">
        <div className="max-w-2xl mx-auto flex items-center space-x-2">
          <button
            onClick={() => onShowToast('Audio Stem file picker opened (.wav, .flac)')}
            className="w-10 h-10 rounded-full bg-[#1c2028] text-[#e5bdc0] hover:text-[#dfe2ee] flex items-center justify-center transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
          </button>

          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Send stem, drop feedback, or note..."
              className="w-full py-2.5 pl-4 pr-10 rounded-full bg-[#1c2028] text-[#dfe2ee] placeholder-[#ac888b] text-sm focus:outline-none focus:ring-1 focus:ring-[#ff4f73] border border-[#262a33]"
            />
            <button
              onClick={() => {
                soundEngine.playClick(500, 0.05);
                onShowToast('Voice memo recording initiated... Speak now');
              }}
              className="absolute right-2.5 text-[#ac888b] hover:text-[#4edea3] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">mic</span>
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputVal.trim() && !attachedStem}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
              inputVal.trim() || attachedStem
                ? 'bg-[#ff4f73] text-[#5a001b] shadow-[0_0_12px_rgba(255,79,115,0.5)] active:scale-95'
                : 'bg-[#262a33] text-[#ac888b] cursor-not-allowed opacity-60'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
