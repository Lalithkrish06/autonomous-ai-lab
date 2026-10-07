import React from 'react';
import { ChapterData } from '../../types';
import { Activity, Cpu, Gauge, Radio, Shield } from 'lucide-react';

interface TelemetryHUDProps {
  currentChapter: ChapterData;
  scrollProgress: number;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  currentChapter,
  scrollProgress,
}) => {
  const isEmergency = currentChapter.id === 8;
  const isComplete = currentChapter.id === 10 || currentChapter.id === 11;

  return (
    <aside aria-label="Vehicle Telemetry" className="fixed top-20 left-4 md:left-8 z-20 pointer-events-none select-none max-w-[280px] md:max-w-[320px]">
      <div className="bg-gray-950/75 border border-cyan-500/25 rounded-xl p-3.5 backdrop-blur-md shadow-2xl text-xs font-mono-tech space-y-3">
        {/* Header telemetry badge */}
        <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2">
          <div className="flex items-center gap-2 text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-semibold tracking-wider">APEX-1 DRIVE BUS</span>
          </div>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              isEmergency
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {currentChapter.systemStatus}
          </span>
        </div>

        {/* Speed & Safety Metric Row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-black/50 border border-cyan-500/15 flex flex-col">
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-cyan-400" /> SPEED
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl md:text-2xl font-bold font-hud text-white">
                {currentChapter.speedKmh}
              </span>
              <span className="text-[10px] text-cyan-400">KM/H</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-black/50 border border-cyan-500/15 flex flex-col">
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" /> SAFETY
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl md:text-2xl font-bold font-hud text-emerald-300">
                {currentChapter.safetyScore}
              </span>
              <span className="text-[10px] text-gray-400">/100</span>
            </div>
          </div>
        </div>

        {/* Sensor & Decision States */}
        <div className="space-y-1.5 pt-1 text-[11px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-cyan-400" /> SENSORS:
            </span>
            <span className="text-cyan-300 font-semibold">{currentChapter.sensorState}</span>
          </div>

          <div className="flex items-center justify-between text-gray-400">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-cyan-400" /> DECISION:
            </span>
            <span
              className={`font-semibold ${
                isEmergency ? 'text-red-400' : isComplete ? 'text-emerald-300' : 'text-gray-200'
              }`}
            >
              {currentChapter.decisionState}
            </span>
          </div>
        </div>

        {/* Micro system bus bars */}
        <div className="pt-2 border-t border-cyan-900/30 space-y-1">
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>NEURAL PIPELINE LATENCY</span>
            <span className="text-cyan-400">11.4 ms</span>
          </div>
          <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full"
              style={{ width: `${80 + Math.sin(scrollProgress * 20) * 15}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
