import React from 'react';
import { CameraMode, ChapterData } from '../../types';
import { Camera, Compass, Play, Pause, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

interface TopNavbarProps {
  currentChapter: ChapterData;
  cameraMode: CameraMode;
  onSelectCameraMode: (mode: CameraMode) => void;
  isMuted: boolean;
  onToggleSound: () => void;
  isAutoCruise: boolean;
  onToggleAutoCruise: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentChapter,
  cameraMode,
  onSelectCameraMode,
  isMuted,
  onToggleSound,
  isAutoCruise,
  onToggleAutoCruise,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-4 md:px-8 py-3.5 flex items-center justify-between border-b border-cyan-500/15 bg-gray-950/40 backdrop-blur-md">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-hud font-bold tracking-wider text-white">
              AUTONOMOUS AI LAB
            </h1>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono-tech bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
              APEX-1 DIGITAL TWIN
            </span>
          </div>
          <p className="text-[10px] md:text-[11px] font-mono-tech text-cyan-400/80 tracking-widest uppercase">
            SMARTER ROADS. SAFER TOMORROW.
          </p>
        </div>
      </div>

      {/* Center Controls: Camera Modes & Cruise Mode */}
      <div className="hidden lg:flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-cyan-500/20 backdrop-blur-md">
        <button
          onClick={() => onSelectCameraMode('cinematic')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 transition-all ${
            cameraMode === 'cinematic'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>CINEMATIC</span>
        </button>

        <button
          onClick={() => onSelectCameraMode('chase')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 transition-all ${
            cameraMode === 'chase'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>CHASE</span>
        </button>

        <button
          onClick={() => onSelectCameraMode('topdown')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 transition-all ${
            cameraMode === 'topdown'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span>BIRD'S-EYE</span>
        </button>

        <button
          onClick={() => onSelectCameraMode('sensor_lidar')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 transition-all ${
            cameraMode === 'sensor_lidar'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span>SENSOR POD</span>
        </button>
      </div>

      {/* Right Controls: Auto Cruise, Audio, Chapter Tag */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Auto Cruise Toggle */}
        <button
          onClick={onToggleAutoCruise}
          className={`px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 transition-all ${
            isAutoCruise
              ? 'bg-cyan-500 text-black font-semibold shadow-lg shadow-cyan-500/30'
              : 'bg-black/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/40'
          }`}
          title="Toggle Autonomous Auto-Drive Camera"
        >
          {isAutoCruise ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isAutoCruise ? 'CRUISING' : 'AUTO CRUISE'}</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-lg border text-xs font-mono-tech transition-colors ${
            !isMuted
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
              : 'bg-black/60 border-gray-800 text-gray-400 hover:text-white'
          }`}
          title={isMuted ? 'Enable Sound' : 'Mute Sound'}
        >
          {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
