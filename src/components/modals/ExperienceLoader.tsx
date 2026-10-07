import React, { useEffect, useState } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface ExperienceLoaderProps {
  onEnter: () => void;
}

export const ExperienceLoader: React.FC<ExperienceLoaderProps> = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('INITIALIZING DIGITAL TWIN...');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const steps = [
      { p: 25, label: 'LOADING ENVIRONMENT & METROPOLIS ASSETS...' },
      { p: 55, label: 'CONFIGURING APEX-1 DRIVE & SENSORS...' },
      { p: 80, label: 'CALIBRATING NEURAL DECISION MATRICES...' },
      { p: 100, label: 'DIGITAL TWIN SIMULATION READY' },
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 3;
        if (next >= steps[currentIdx]?.p) {
          setCurrentStep(steps[currentIdx]?.label || 'READY');
          if (currentIdx < steps.length - 1) {
            currentIdx++;
          }
        }
        if (next >= 100) {
          clearInterval(interval);
          setReady(true);
          return 100;
        }
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#030712] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      {/* Main loading container */}
      <div className="relative max-w-md w-full space-y-6">
        {/* Brand Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-2xl shadow-cyan-950/80">
          <ShieldCheck className="w-8 h-8 text-cyan-400" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-hud font-extrabold tracking-widest text-white">
            AUTONOMOUS AI LAB
          </h1>
          <p className="text-xs md:text-sm font-mono-tech text-cyan-400 tracking-widest uppercase">
            SMARTER ROADS. SAFER TOMORROW.
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2 pt-4">
          <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden border border-cyan-500/20">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-150 shadow-[0_0_12px_#22d3ee]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] font-mono-tech text-gray-400">
            <span>{currentStep}</span>
            <span className="text-cyan-300 font-bold">{progress}%</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          {ready ? (
            <button
              onClick={onEnter}
              className="w-full py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-hud font-bold text-sm tracking-wider uppercase transition-all shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
              <span>ENTER EXPERIENCE</span>
            </button>
          ) : (
            <div className="text-xs font-mono-tech text-gray-400 animate-pulse">
              SYNCHRONIZING 3D WEBGL ENGINE & TELEMETRY...
            </div>
          )}
        </div>

        {/* Sub note */}
        <p className="text-[10px] font-mono-tech text-gray-400">
          Scroll or enable Autonomous Cruise to explore all 11 chapters.
        </p>
      </div>
    </div>
  );
};
