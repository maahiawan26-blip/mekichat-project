import React, { useState } from 'react';

interface EQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToast: (msg: string) => void;
}

export const EQModal: React.FC<EQModalProps> = ({ isOpen, onClose, onApplyToast }) => {
  const [lowGain, setLowGain] = useState<number>(3.5);
  const [lowMidGain, setLowMidGain] = useState<number>(-1.0);
  const [highMidGain, setHighMidGain] = useState<number>(2.0);
  const [highGain, setHighGain] = useState<number>(4.2);
  const [saturation, setSaturation] = useState<number>(35);
  const [reverbDepth, setReverbDepth] = useState<number>(28);
  const [activePreset, setActivePreset] = useState<string>('Club 808 Boost');

  if (!isOpen) return null;

  const presets = [
    { name: 'Club 808 Boost', low: 5.5, lmid: -2.0, hmid: 1.5, high: 3.0, sat: 45, rev: 20 },
    { name: 'Crisp Master', low: 1.5, lmid: -1.0, hmid: 3.5, high: 5.0, sat: 20, rev: 30 },
    { name: 'Warm Tape 1984', low: 4.0, lmid: 2.0, hmid: -1.5, high: -2.0, sat: 65, rev: 40 },
    { name: 'Vocal Air Cut', low: -3.0, lmid: 0.5, hmid: 4.0, high: 6.0, sat: 15, rev: 50 },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setActivePreset(p.name);
    setLowGain(p.low);
    setLowMidGain(p.lmid);
    setHighMidGain(p.hmid);
    setHighGain(p.high);
    setSaturation(p.sat);
    setReverbDepth(p.rev);
    onApplyToast(`EQ Rack Profile Loaded: "${p.name}"`);
  };

  // SVG frequency curve based on gain points
  const points = [
    { x: 20, y: 50 - lowGain * 3 },
    { x: 100, y: 50 - lowMidGain * 3 },
    { x: 200, y: 50 - highMidGain * 3 },
    { x: 280, y: 50 - highGain * 3 },
  ];
  const pathD = `M 0,${points[0].y} C 50,${points[0].y} 70,${points[1].y} 120,${points[1].y} C 160,${points[1].y} 180,${points[2].y} 220,${points[2].y} C 250,${points[2].y} 270,${points[3].y} 300,${points[3].y}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#1c2028] border border-[#31353e] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col space-y-5">
        {/* Ambient glow */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#6807ba]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[#ff4f73]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#6807ba] text-[#d0a6ff] flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-[#dfe2ee]">
                4-Band Parametric EQ &amp; FX Rack
              </h3>
              <span className="text-xs text-[#e5bdc0]">Master Bus Chain • 48kHz 32-bit DSP</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262a33] text-[#e5bdc0] hover:text-[#dfe2ee] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Presets Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 relative z-10">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activePreset === p.name
                  ? 'bg-[#ff4f73] text-[#5a001b] shadow-[0_0_12px_rgba(255,79,115,0.4)]'
                  : 'bg-[#262a33] text-[#e5bdc0] hover:text-[#dfe2ee]'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Real-time Visual Curve */}
        <div className="relative z-10 h-28 w-full bg-[#0a0e16] rounded-2xl border border-[#262a33] p-2 flex flex-col justify-between overflow-hidden">
          {/* Frequency grid lines */}
          <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-20">
            <div className="border-r border-[#dfe2ee] h-full" />
            <div className="border-r border-[#dfe2ee] h-full" />
            <div className="border-r border-[#dfe2ee] h-full" />
            <div className="border-r border-[#dfe2ee] h-full" />
          </div>

          <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
            {/* Center zero line */}
            <line x1="0" y1="50" x2="300" y2="50" stroke="#31353e" strokeDasharray="4 4" strokeWidth="1" />
            {/* Filled area */}
            <path d={`${pathD} L 300,100 L 0,100 Z`} fill="url(#eqGlow)" opacity="0.3" />
            {/* Curve */}
            <path d={pathD} fill="none" stroke="#4edea3" strokeWidth="2.5" />
            {/* Control node dots */}
            {points.map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#ff4f73" stroke="#fff" strokeWidth="1.5" />
            ))}
            <defs>
              <linearGradient id="eqGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4edea3" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#4edea3" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <div className="flex items-center justify-between text-[10px] text-[#ac888b] font-mono px-2 relative z-10">
            <span>80 Hz</span>
            <span>450 Hz</span>
            <span>2.5 kHz</span>
            <span>10 kHz</span>
          </div>
        </div>

        {/* 4 EQ Band Faders */}
        <div className="grid grid-cols-4 gap-2 relative z-10">
          <div className="flex flex-col items-center bg-[#181c24] p-2.5 rounded-2xl border border-[#262a33]">
            <span className="text-[10px] text-[#ac888b] uppercase font-bold">Low 80Hz</span>
            <span className="text-xs font-mono text-[#4edea3] my-1">
              {lowGain > 0 ? `+${lowGain.toFixed(1)}` : lowGain.toFixed(1)} dB
            </span>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={lowGain}
              onChange={(e) => setLowGain(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#262a33] accent-[#4edea3] rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex flex-col items-center bg-[#181c24] p-2.5 rounded-2xl border border-[#262a33]">
            <span className="text-[10px] text-[#ac888b] uppercase font-bold">L-Mid 450</span>
            <span className="text-xs font-mono text-[#dbb8ff] my-1">
              {lowMidGain > 0 ? `+${lowMidGain.toFixed(1)}` : lowMidGain.toFixed(1)} dB
            </span>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={lowMidGain}
              onChange={(e) => setLowMidGain(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#262a33] accent-[#dbb8ff] rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex flex-col items-center bg-[#181c24] p-2.5 rounded-2xl border border-[#262a33]">
            <span className="text-[10px] text-[#ac888b] uppercase font-bold">H-Mid 2.5k</span>
            <span className="text-xs font-mono text-[#ff4f73] my-1">
              {highMidGain > 0 ? `+${highMidGain.toFixed(1)}` : highMidGain.toFixed(1)} dB
            </span>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={highMidGain}
              onChange={(e) => setHighMidGain(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#262a33] accent-[#ff4f73] rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex flex-col items-center bg-[#181c24] p-2.5 rounded-2xl border border-[#262a33]">
            <span className="text-[10px] text-[#ac888b] uppercase font-bold">High 10k</span>
            <span className="text-xs font-mono text-[#4edea3] my-1">
              {highGain > 0 ? `+${highGain.toFixed(1)}` : highGain.toFixed(1)} dB
            </span>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={highGain}
              onChange={(e) => setHighGain(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#262a33] accent-[#4edea3] rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Master FX Knobs */}
        <div className="grid grid-cols-2 gap-3 relative z-10 pt-1">
          <div className="p-3 rounded-2xl bg-[#181c24] border border-[#262a33] flex flex-col space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#dfe2ee] font-semibold">Tape Saturation</span>
              <span className="text-[#ff4f73] font-mono">{saturation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={saturation}
              onChange={(e) => setSaturation(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#262a33] accent-[#ff4f73] rounded-lg cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-2xl bg-[#181c24] border border-[#262a33] flex flex-col space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#dfe2ee] font-semibold">Lush Reverb</span>
              <span className="text-[#dbb8ff] font-mono">{reverbDepth}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={reverbDepth}
              onChange={(e) => setReverbDepth(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#262a33] accent-[#dbb8ff] rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Footer Apply Button */}
        <div className="relative z-10 pt-1">
          <button
            onClick={() => {
              onApplyToast('Master Bus EQ & FX Profile Saved');
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ff4f73] to-[#6807ba] text-white font-bold text-sm shadow-[0_4px_20px_rgba(255,79,115,0.4)] active:scale-98 transition-all"
          >
            Apply to Master Stem Output
          </button>
        </div>
      </div>
    </div>
  );
};
