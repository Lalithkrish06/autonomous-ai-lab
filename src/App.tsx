import React, { useEffect, useRef, useState } from 'react';
import { CameraMode, ChapterData, CHAPTERS } from './types';
import { AutonomousScene } from './components/3d/AutonomousScene';
import { TopNavbar } from './components/hud/TopNavbar';
import { TelemetryHUD } from './components/hud/TelemetryHUD';
import { ChapterOverlay } from './components/hud/ChapterOverlay';
import { CinematicVideoManager } from './components/video/CinematicVideoManager';
import { ExperienceLoader } from './components/modals/ExperienceLoader';
import { soundManager } from './audio/soundManager';

export default function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentChapter, setCurrentChapter] = useState<ChapterData>(CHAPTERS[0]);
  const [cameraMode, setCameraMode] = useState<CameraMode>('cinematic');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isAutoCruise, setIsAutoCruise] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const autoCruiseAnimRef = useRef<number | null>(null);
  const prevChapterIdRef = useRef<number>(1);

  // Helper to determine chapter from scroll 0 -> 1
  const findChapter = (progress: number): ChapterData => {
    const ch = CHAPTERS.find(
      (c) => progress >= c.scrollStart && progress <= c.scrollEnd
    );
    return ch || (progress >= 0.95 ? CHAPTERS[10] : CHAPTERS[0]);
  };

  // Scroll handler
  useEffect(() => {
    if (!hasEntered) return;

    const handleScroll = () => {
      const el = document.documentElement;
      const totalScroll = el.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      const progress = Math.min(1.0, Math.max(0.0, window.scrollY / totalScroll));
      setScrollProgress(progress);

      const ch = findChapter(progress);
      setCurrentChapter(ch);

      // Audio alerts and sound updates
      soundManager.updateSpeed(ch.speedKmh);

      if (ch.id !== prevChapterIdRef.current) {
        soundManager.playTransitionChime();
        if (ch.id === 8) {
          soundManager.playEmergencyAlert();
        } else if (ch.id === 2 || ch.id === 3) {
          soundManager.playScanPing();
        }
        prevChapterIdRef.current = ch.id;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasEntered]);

  // Autonomous Cruise Mode (auto-scroll)
  useEffect(() => {
    if (!isAutoCruise || !hasEntered) {
      if (autoCruiseAnimRef.current) cancelAnimationFrame(autoCruiseAnimRef.current);
      return;
    }

    let lastTimestamp = performance.now();

    const cruiseLoop = (time: number) => {
      const delta = (time - lastTimestamp) / 1000;
      lastTimestamp = time;

      const el = document.documentElement;
      const totalScroll = el.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        // Slight slowdown during emergency chapter
        const isEmergency = window.scrollY / totalScroll >= 0.68 && window.scrollY / totalScroll <= 0.78;
        const speedMultiplier = isEmergency ? 0.35 : 1.0;
        const scrollDelta = (totalScroll * 0.04) * delta * speedMultiplier;

        if (window.scrollY + scrollDelta >= totalScroll) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.scrollBy({ top: scrollDelta, behavior: 'auto' });
        }
      }

      autoCruiseAnimRef.current = requestAnimationFrame(cruiseLoop);
    };

    autoCruiseAnimRef.current = requestAnimationFrame(cruiseLoop);

    return () => {
      if (autoCruiseAnimRef.current) cancelAnimationFrame(autoCruiseAnimRef.current);
    };
  }, [isAutoCruise, hasEntered]);

  // Jump to specific chapter
  const handleJumpToChapter = (chapter: ChapterData) => {
    const el = document.documentElement;
    const totalScroll = el.scrollHeight - window.innerHeight;
    const targetY = totalScroll * ((chapter.scrollStart + chapter.scrollEnd) / 2);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
    soundManager.playTransitionChime();
  };

  // Sound toggle
  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsAutoCruise((prev) => !prev);
      } else if (e.code === 'KeyM') {
        handleToggleSound();
      } else if (e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key) - 1;
        if (CHAPTERS[idx]) {
          handleJumpToChapter(CHAPTERS[idx]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMuted]);

  // Enter Experience handler
  const handleEnterExperience = () => {
    setHasEntered(true);
    soundManager.init();
    soundManager.setMuted(false);
    setIsMuted(false);
    soundManager.playTransitionChime();
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-white overflow-x-hidden select-none">
      {/* 1. Intro Loader */}
      {!hasEntered && (
        <ExperienceLoader onEnter={handleEnterExperience} />
      )}

      {/* 2. Persistent 3D WebGL Canvas Scene */}
      <AutonomousScene
        scrollProgress={scrollProgress}
        currentChapter={currentChapter}
        cameraMode={cameraMode}
      />

      {/* 3. Cinematic Video Synchronized Layer */}
      <CinematicVideoManager
        currentChapter={currentChapter}
        scrollProgress={scrollProgress}
        isMuted={isMuted}
      />

      {/* 4. Top Navigation Bar */}
      <TopNavbar
        currentChapter={currentChapter}
        cameraMode={cameraMode}
        onSelectCameraMode={setCameraMode}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        isAutoCruise={isAutoCruise}
        onToggleAutoCruise={() => setIsAutoCruise((prev) => !prev)}
      />

      {/* 5. Telemetry HUD (Left Corner) */}
      <TelemetryHUD
        currentChapter={currentChapter}
        scrollProgress={scrollProgress}
      />

      {/* 6. Chapter Cinematic Overlay (Center Narrative) */}
      <ChapterOverlay
        currentChapter={currentChapter}
        scrollProgress={scrollProgress}
      />

      {/* 7. Invisible Scroll Height Driver (SCROLL = CAMERA CONTROL) */}
      {/* Creates a continuous 12,000px smooth scroll track driving WebGL camera & chapter state */}
      <div
        ref={scrollContainerRef}
        className="relative pointer-events-none w-full"
        style={{ height: '12000px' }}
      />
    </div>
  );
}
