import React, { useState } from 'react';
import { USER_PROFILE_URL } from '../data/mockData';
import { soundEngine } from '../utils/audioEngine';

interface ProfileModalProps {
  onClose?: () => void;
  onShowToast: (msg: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, onShowToast }) => {
  const [broadcastDrops, setBroadcastDrops] = useState<boolean>(true);
  const [lowLatency, setLowLatency] = useState<boolean>(true);
  const [stemCollabOpen, setStemCollabOpen] = useState<boolean>(true);
  const [testPlaying, setTestPlaying] = useState<boolean>(false);

  const testAudioOutput = () => {
    if (testPlaying) {
      soundEngine.stop();
      setTestPlaying(false);
      onShowToast('Audio stream test ended');
    } else {
      setTestPlaying(true);
      soundEngine.playStemSnippet(
        'test-tone',
        undefined,
        () => setTestPlaying(false)
      );
      onShowToast('Running 48kHz stereo master bus test...');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-24 pt-4 space-y-4 animate-fade-in">
      {/* Producer Hero Header Card */}
      <div className="relative rounded-3xl bg-[#1c2028] border border-[#262a33] overflow-hidden shadow-xl">
        {/* Banner Cover Gradient */}
        <div className="h-32 w-full bg-gradient-to-r from-[#6807ba] via-[#ff4f73] to-[#4edea3] opacity-85 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c2028] to-transparent" />
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Profile Info Row */}
        <div className="px-5 pb-5 -mt-12 relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end space-x-3.5">
            <div className="relative">
              <img
                src={USER_PROFILE_URL}
                alt="Profile Avatar"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-[#1c2028] shadow-xl"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#4edea3] ring-2 ring-[#1c2028] shadow-[0_0_8px_rgba(78,222,163,0.9)]" />
            </div>
            <div className="flex flex-col pb-1">
              <div className="flex items-center space-x-1.5">
                <h2 className="text-lg font-bold text-[#dfe2ee] font-headline">
                  Mehak Sound Lab
                </h2>
                <span
                  className="material-symbols-outlined text-[#ff4f73] text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
              <span className="text-xs text-[#ffb2ba] font-mono">@mehak.sound</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onShowToast('Profile edit sheet opened')}
              className="px-3.5 py-1.5 rounded-full bg-[#262a33] text-[#dfe2ee] text-xs font-semibold hover:bg-[#31353e] transition-colors"
            >
              Edit Studio Bio
            </button>
            <button
              onClick={testAudioOutput}
              className="px-3.5 py-1.5 rounded-full bg-[#ff4f73] text-[#5a001b] text-xs font-bold shadow-md active:scale-95 transition-transform flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">
                {testPlaying ? 'stop' : 'volume_up'}
              </span>
              <span>{testPlaying ? 'Stop Bus' : 'Test Bus'}</span>
            </button>
          </div>
        </div>

        <div className="px-5 pb-4">
          <p className="text-xs text-[#e5bdc0] leading-relaxed">
            Modular sound designer, analog synthesist, and mixing engineer. Tokyo / LA. Dialing
            vintage Juno-106 chorus patches &amp; heavyweight sidechain stems for Meki drops.
          </p>
        </div>

        {/* Studio Stats Grid */}
        <div className="grid grid-cols-4 border-t border-[#262a33] bg-[#181c24]/60 py-3 px-4 text-center">
          <div>
            <span className="block text-base font-bold text-[#dfe2ee] font-mono">24</span>
            <span className="text-[10px] text-[#ac888b] uppercase">Stems</span>
          </div>
          <div>
            <span className="block text-base font-bold text-[#4edea3] font-mono">142</span>
            <span className="text-[10px] text-[#ac888b] uppercase">Remixes</span>
          </div>
          <div>
            <span className="block text-base font-bold text-[#dbb8ff] font-mono">18</span>
            <span className="text-[10px] text-[#ac888b] uppercase">Collabs</span>
          </div>
          <div>
            <span className="block text-base font-bold text-[#ff4f73] font-mono">8.4k</span>
            <span className="text-[10px] text-[#ac888b] uppercase">Listens</span>
          </div>
        </div>
      </div>

      {/* Hardware & DAW Specs Card */}
      <div className="p-4 rounded-2xl bg-[#1c2028] border border-[#262a33] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[20px] text-[#ff4f73]">piano</span>
            <h3 className="text-sm font-bold text-[#dfe2ee]">Studio Rig &amp; Routing</h3>
          </div>
          <span className="text-[11px] text-[#4edea3] font-mono">Live WebRTC 18ms</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-2.5 rounded-xl bg-[#181c24] border border-[#262a33]">
            <span className="text-[10px] text-[#ac888b] block">Primary Synth</span>
            <span className="text-xs font-semibold text-[#dfe2ee]">Roland Juno-106 (1984)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#181c24] border border-[#262a33]">
            <span className="text-[10px] text-[#ac888b] block">Drum Machine</span>
            <span className="text-xs font-semibold text-[#dfe2ee]">Akai MPC Live II</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#181c24] border border-[#262a33]">
            <span className="text-[10px] text-[#ac888b] block">Audio Interface</span>
            <span className="text-xs font-semibold text-[#dfe2ee]">Apollo Twin X Quad</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#181c24] border border-[#262a33]">
            <span className="text-[10px] text-[#ac888b] block">Master Resolution</span>
            <span className="text-xs font-semibold text-[#dfe2ee]">48kHz / 32-bit Float</span>
          </div>
        </div>
      </div>

      {/* Real-time Settings Toggles */}
      <div className="p-4 rounded-2xl bg-[#1c2028] border border-[#262a33] space-y-3.5">
        <h3 className="text-sm font-bold text-[#dfe2ee]">Live Collaboration Preferences</h3>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#dfe2ee]">Broadcast Live Drops</span>
            <span className="text-[11px] text-[#ac888b]">
              Notify followers when rendering stems in real-time
            </span>
          </div>
          <button
            onClick={() => setBroadcastDrops(!broadcastDrops)}
            className={`w-11 h-6 rounded-full p-1 transition-colors ${
              broadcastDrops ? 'bg-[#ff4f73]' : 'bg-[#31353e]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                broadcastDrops ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#dfe2ee]">Low Latency Socket.io</span>
            <span className="text-[11px] text-[#ac888b]">
              Keep audio buffer below 20ms for direct MIDI sync
            </span>
          </div>
          <button
            onClick={() => setLowLatency(!lowLatency)}
            className={`w-11 h-6 rounded-full p-1 transition-colors ${
              lowLatency ? 'bg-[#4edea3]' : 'bg-[#31353e]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                lowLatency ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#dfe2ee]">Open Stem Collabs</span>
            <span className="text-[11px] text-[#ac888b]">
              Allow producers to remix your shared stems in chat
            </span>
          </div>
          <button
            onClick={() => setStemCollabOpen(!stemCollabOpen)}
            className={`w-11 h-6 rounded-full p-1 transition-colors ${
              stemCollabOpen ? 'bg-[#6807ba]' : 'bg-[#31353e]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                stemCollabOpen ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
