import React from 'react';
import { ChapterData } from '../../types';

interface ChapterOverlayProps {
  currentChapter: ChapterData;
  scrollProgress: number;
}

export const ChapterOverlay: React.FC<ChapterOverlayProps> = ({
  currentChapter,
  scrollProgress,
}) => {
  const isEmergency = currentChapter.id === 8;
  const isHero = currentChapter.id === 11;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-center items-center px-6 text-center select-none">
      {/* Cinematic Chapter Announcement */}
      <div className="max-w-3xl space-y-3 transition-all duration-700">
        {/* Micro Chapter Subhead */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono-tech tracking-widest uppercase shadow-lg backdrop-blur-sm">
          <span>CHAPTER {currentChapter.number}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>{currentChapter.tagline}</span>
        </div>

        {/* Major Cinematic Headline */}
        <h2
          className={`text-3xl sm:text-5xl md:text-6xl font-hud font-extrabold tracking-wide uppercase transition-colors duration-500 ${
            isEmergency
              ? 'text-red-500 drop-shadow-[0_0_24px_rgba(239,68,68,0.6)]'
              : isHero
              ? 'text-amber-200 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]'
              : 'text-white drop-shadow-[0_0_24px_rgba(34,211,238,0.4)]'
          }`}
        >
          {currentChapter.title}
        </h2>

        {/* Narrative Description */}
        <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto font-light leading-relaxed drop-shadow-md">
          {currentChapter.description}
        </p>

        {/* Emergency Alert Specific Banner */}
        {isEmergency && (
          <div className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-red-950/80 border border-red-500 text-red-300 text-sm font-mono-tech tracking-wider animate-pulse shadow-2xl">
            ⚠ HIGH RISK DETECTED: 78% | SUB-12MS BRAKE ACTIVE | COLLISION AVOIDED
          </div>
        )}

        {/* Final Hero Specific Banner */}
        {isHero && (
          <div className="mt-6 space-y-2">
            <p className="text-xl sm:text-2xl font-hud font-bold text-amber-300 tracking-wider">
              SMARTER ROADS. SAFER TOMORROW.
            </p>
            <p className="text-xs sm:text-sm font-mono-tech text-gray-400 tracking-widest uppercase">
              AI-DRIVEN MOBILITY BUILT FOR HUMAN SAFETY
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
