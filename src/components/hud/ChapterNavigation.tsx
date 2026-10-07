import React from 'react';
import { ChapterData, CHAPTERS } from '../../types';

interface ChapterNavigationProps {
  currentChapter: ChapterData;
  scrollProgress: number;
  onJumpToChapter: (chapter: ChapterData) => void;
}

export const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  currentChapter,
  scrollProgress,
  onJumpToChapter,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 px-3 md:px-8 py-2.5 bg-gray-950/70 border-t border-cyan-500/20 backdrop-blur-md">
      {/* Micro progress line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gray-900">
        <div
          className="h-full bg-cyan-400 transition-all duration-150 shadow-[0_0_8px_#22d3ee]"
          style={{ width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar max-w-7xl mx-auto py-0.5">
        {CHAPTERS.map((ch) => {
          const isActive = ch.id === currentChapter.id;
          return (
            <button
              key={ch.id}
              onClick={() => onJumpToChapter(ch)}
              className={`flex items-center gap-1.5 px-2 md:px-3 py-1 rounded-md text-[11px] font-mono-tech whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-semibold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/50'
              }`}
            >
              <span className={isActive ? 'text-cyan-400' : 'text-gray-600'}>
                {ch.number}
              </span>
              <span className="hidden sm:inline">{ch.title}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
