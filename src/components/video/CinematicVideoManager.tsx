import React, { useEffect, useRef, useState } from 'react';
import { ChapterData } from '../../types';
import { Eye, Layers, Maximize2, Minimize2, Video } from 'lucide-react';

interface CinematicVideoManagerProps {
  currentChapter: ChapterData;
  scrollProgress: number;
  isMuted: boolean;
}

export const CinematicVideoManager: React.FC<CinematicVideoManagerProps> = ({
  currentChapter,
  scrollProgress,
  isMuted,
}) => {
  const [viewMode, setViewMode] = useState<'hologram' | 'full' | 'hidden'>('hologram');
  const [videoSourceError, setVideoSourceError] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Map chapter to video asset index (1 to 7)
  const getVideoIndex = (chapterId: number): number => {
    switch (chapterId) {
      case 1: return 1; // Lab turntable reveal
      case 2: return 2; // Sensor diagnostic scan
      case 3: return 2; // Multi-sensor fusion
      case 4: return 3; // Metropolis gate rollout
      case 5: return 3; // Vision bounding boxes
      case 6: return 4; // Turn navigation & replanning
      case 7: return 4; // Decision tree trajectory
      case 8: return 5; // Emergency brake & collision avoided
      case 9: return 6; // Safe path detour & construction
      case 10: return 6; // Autonomous parking 360
      case 11: return 7; // Safety analytics 98/100 & sunrise hero
      default: return 1;
    }
  };

  const videoIdx = getVideoIndex(currentChapter.id);

  // Procedural Cinematic Video Synthesizer:
  // Render high-fidelity 60fps cinematic video frame matching the exact scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const renderFrame = () => {
      time += 0.016;
      const w = canvas.width;
      const h = canvas.height;

      // Base background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      // Chapter-specific cinematic graphic generation matching user's videos
      switch (videoIdx) {
        case 1: { // LAB ACTIVATION
          // Dark room with circular turntable and neon ring
          const grad = ctx.createRadialGradient(w/2, h/2 + 60, 40, w/2, h/2 + 60, 240);
          grad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
          grad.addColorStop(1, 'rgba(3, 7, 18, 0.95)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Turntable ellipse
          ctx.beginPath();
          ctx.ellipse(w/2, h/2 + 80, 180, 60, 0, 0, Math.PI * 2);
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Particle burst
          for (let i = 0; i < 28; i++) {
            const angle = (i / 28) * Math.PI * 2 + time * 0.5;
            const r = 60 + Math.sin(time * 2 + i) * 80;
            ctx.beginPath();
            ctx.arc(w/2 + Math.cos(angle) * r, h/2 + 60 + Math.sin(angle) * (r * 0.35), 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#38bdf8';
            ctx.fill();
          }

          // Vehicle silhouette
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.roundRect(w/2 - 70, h/2 + 45, 140, 36, 12);
          ctx.fill();

          // Headlights
          ctx.fillStyle = '#67e8f9';
          ctx.fillRect(w/2 - 68, h/2 + 55, 12, 4);
          ctx.fillRect(w/2 + 56, h/2 + 55, 12, 4);

          // Top Title Overlay
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 20px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('AUTONOMOUS AI LAB', w/2, 48);
          ctx.fillStyle = '#38bdf8';
          ctx.font = '12px monospace';
          ctx.fillText('3D INTELLIGENT SIMULATION PLATFORM', w/2, 70);
          break;
        }

        case 2: { // SENSOR DIAGNOSTIC SCAN
          ctx.fillStyle = '#050c1a';
          ctx.fillRect(0, 0, w, h);

          // Vehicle front center
          ctx.fillStyle = '#1e242d';
          ctx.beginPath();
          ctx.roundRect(w/2 - 80, h/2 - 20, 160, 60, 16);
          ctx.fill();

          // Cyan LED headlights
          ctx.fillStyle = '#22d3ee';
          ctx.fillRect(w/2 - 70, h/2 + 8, 24, 6);
          ctx.fillRect(w/2 + 46, h/2 + 8, 24, 6);

          // Sonar scan rings pulsing outward
          for (let r = 0; r < 4; r++) {
            const ringR = (time * 60 + r * 45) % 180;
            ctx.beginPath();
            ctx.arc(w/2, h/2 + 10, ringR, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(34, 211, 238, ${Math.max(0, 1 - ringR / 180)})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Green checkmarks HUD
          ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
          ctx.fillRect(24, 24, 180, 52);
          ctx.strokeStyle = '#10b981';
          ctx.strokeRect(24, 24, 180, 52);
          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 13px monospace';
          ctx.textAlign = 'left';
          ctx.fillText('✓ AI SYSTEM ONLINE', 34, 46);
          ctx.fillText('✓ SENSORS 5/5 ONLINE', 34, 64);
          break;
        }

        case 3: { // NEO-METROPOLIS ROADWAY & DRIVABLE AREA
          // Cyber city night street
          ctx.fillStyle = '#030712';
          ctx.fillRect(0, 0, w, h);

          // Skyscrapers silhouette
          for (let b = 0; b < 12; b++) {
            const bx = b * 42;
            const bh = 90 + Math.sin(b * 3) * 50;
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(bx, h/2 - bh, 36, bh);
            // Window lights
            ctx.fillStyle = b % 2 === 0 ? '#06b6d4' : '#8b5cf6';
            ctx.fillRect(bx + 12, h/2 - bh + 15, 4, 30);
          }

          // Road perspective
          ctx.fillStyle = '#090e17';
          ctx.beginPath();
          ctx.moveTo(w/2 - 20, h/2);
          ctx.lineTo(w/2 + 20, h/2);
          ctx.lineTo(w + 40, h);
          ctx.lineTo(-40, h);
          ctx.fill();

          // Drivable Area blue corridor
          ctx.fillStyle = 'rgba(14, 165, 233, 0.25)';
          ctx.beginPath();
          ctx.moveTo(w/2 - 8, h/2);
          ctx.lineTo(w/2 + 8, h/2);
          ctx.lineTo(w/2 + 90, h);
          ctx.lineTo(w/2 - 90, h);
          ctx.fill();

          // APEX-1 driving forward
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.roundRect(w/2 - 40, h - 90, 80, 42, 10);
          ctx.fill();
          // Taillights
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(w/2 - 34, h - 80, 68, 6);

          // HUD Tag: Drivable Area
          ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
          ctx.fillRect(w/2 - 60, h/2 + 30, 120, 24);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('[ DRIVABLE AREA ]', w/2, h/2 + 46);
          break;
        }

        case 4: { // TURN LEFT / DECISION TRAJECTORY
          ctx.fillStyle = '#020617';
          ctx.fillRect(0, 0, w, h);

          // Glowing blue trajectory line curving left
          ctx.beginPath();
          ctx.moveTo(w/2, h - 20);
          ctx.bezierCurveTo(w/2, h - 100, w/2 - 40, h/2, w/2 - 140, h/2 - 40);
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 10;
          ctx.stroke();

          // APEX-1 rear
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.roundRect(w/2 - 36, h - 80, 72, 40, 8);
          ctx.fill();
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(w/2 - 30, h - 70, 60, 5);

          // TURN LEFT Holographic HUD box
          ctx.fillStyle = 'rgba(6, 18, 38, 0.85)';
          ctx.fillRect(30, 30, 190, 80);
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 2;
          ctx.strokeRect(30, 30, 190, 80);

          ctx.fillStyle = '#22d3ee';
          ctx.font = 'bold 22px monospace';
          ctx.textAlign = 'left';
          ctx.fillText('↰ TURN LEFT', 45, 65);

          ctx.fillStyle = '#10b981';
          ctx.font = '12px monospace';
          ctx.fillText('Signal: Green | Clear', 45, 92);

          // REPLANNING PATH Badge
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(w - 180, 40, 150, 28);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('● REPLANNING PATH', w - 170, 58);
          break;
        }

        case 5: { // EMERGENCY BRAKE & COLLISION AVOIDED
          ctx.fillStyle = '#020617';
          ctx.fillRect(0, 0, w, h);

          const isAvoided = Math.sin(time * 2) > 0;

          // Crosswalk
          for (let c = 0; c < 7; c++) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(80 + c * 48, h/2 + 20, 32, 80);
          }

          // Pedestrian with red bounding box
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(w/2 + 40, h/2 + 20, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(w/2 + 35, h/2 + 30, 10, 36);

          // Red detection box
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          ctx.strokeRect(w/2 + 20, h/2 + 5, 42, 68);

          // APEX-1 Front
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.roundRect(w/2 - 60, h - 85, 120, 50, 12);
          ctx.fill();
          // LED lights
          ctx.fillStyle = '#67e8f9';
          ctx.fillRect(w/2 - 50, h - 70, 20, 6);
          ctx.fillRect(w/2 + 30, h - 70, 20, 6);

          if (!isAvoided) {
            // RED EMERGENCY BANNER
            ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
            ctx.fillRect(0, 20, w, 50);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('⚠ EMERGENCY DETECTED : RISK 78%', w/2, 52);
          } else {
            // CYAN COLLISION AVOIDED BANNER
            ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
            ctx.fillRect(0, 20, w, 50);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('✓ COLLISION AVOIDED : SAFE STOP', w/2, 52);
          }
          break;
        }

        case 6: { // SAFE PATH DETOUR & AUTONOMOUS PARKING
          ctx.fillStyle = '#040914';
          ctx.fillRect(0, 0, w, h);

          // Parking stall with cyan borders
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 3;
          ctx.strokeRect(w/2 - 50, h/2 - 80, 100, 150);

          // APEX-1 parked inside
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.roundRect(w/2 - 35, h/2 - 60, 70, 110, 12);
          ctx.fill();

          // Green/Cyan Banner
          ctx.fillStyle = 'rgba(6, 18, 38, 0.9)';
          ctx.fillRect(w/2 - 120, 30, 240, 44);
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.strokeRect(w/2 - 120, 30, 240, 44);

          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 16px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('PARKING COMPLETE', w/2, 58);

          // Circular Sonar Sweep
          ctx.beginPath();
          ctx.arc(w/2, h/2 - 5, (time * 50) % 90, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
          ctx.stroke();
          break;
        }

        case 7: { // SUNRISE HERO & SAFETY 98/100
          // Golden Sunrise Horizon
          const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
          skyGrad.addColorStop(0, '#f59e0b'); // Golden dawn
          skyGrad.addColorStop(0.4, '#d97706');
          skyGrad.addColorStop(0.8, '#0f172a');
          skyGrad.addColorStop(1, '#020617');
          ctx.fillStyle = skyGrad;
          ctx.fillRect(0, 0, w, h);

          // Sunrise Sun
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(w/2, h/2 - 20, 35, 0, Math.PI * 2);
          ctx.fill();

          // Highway bridge perspective
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.moveTo(w/2 - 10, h/2 - 10);
          ctx.lineTo(w/2 + 10, h/2 - 10);
          ctx.lineTo(w + 30, h);
          ctx.lineTo(-30, h);
          ctx.fill();

          // APEX-1 cruising into sunrise
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.roundRect(w/2 - 24, h - 60, 48, 28, 6);
          ctx.fill();
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(w/2 - 20, h - 54, 40, 4);

          // Final Brand Overlays
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 18px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('AUTONOMOUS AI LAB', w/2, h - 90);
          ctx.fillStyle = '#fef08a';
          ctx.font = '12px monospace';
          ctx.fillText('SMARTER ROADS. SAFER TOMORROW.', w/2, h - 72);

          // Safety Badge Top Left
          ctx.fillStyle = 'rgba(3, 7, 18, 0.8)';
          ctx.fillRect(20, 20, 160, 50);
          ctx.strokeStyle = '#10b981';
          ctx.strokeRect(20, 20, 160, 50);
          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 22px monospace';
          ctx.textAlign = 'left';
          ctx.fillText('98/100', 30, 48);
          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px monospace';
          ctx.fillText('SAFETY SCORE', 30, 62);
          break;
        }
      }

      animFrameRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [videoIdx]);

  if (viewMode === 'hidden') {
    return (
      <button
        onClick={() => setViewMode('hologram')}
        className="fixed bottom-6 right-6 z-40 bg-black/80 border border-cyan-500/40 text-cyan-400 p-2.5 rounded-lg flex items-center gap-2 text-xs font-mono-tech hover:bg-cyan-950/60 backdrop-blur-md transition-all shadow-lg shadow-cyan-950/40"
        title="Show Cinematic AI Feed"
      >
        <Video className="w-4 h-4" />
        <span>CINEMATIC FEED</span>
      </button>
    );
  }

  return (
    <div
      className={`fixed transition-all duration-500 z-40 ${
        viewMode === 'full'
          ? 'inset-6 md:inset-12 bg-black/90 rounded-2xl p-4 border border-cyan-500/50 shadow-2xl backdrop-blur-2xl flex flex-col'
          : 'bottom-6 right-6 w-80 md:w-96 rounded-xl p-3 bg-gray-950/85 border border-cyan-500/30 shadow-2xl backdrop-blur-xl'
      }`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-900/40 text-xs font-mono-tech">
        <div className="flex items-center gap-2 text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-semibold uppercase">CLIP {videoIdx}/7 : {currentChapter.videoRole}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <button
            onClick={() => setViewMode(viewMode === 'full' ? 'hologram' : 'full')}
            className="hover:text-cyan-300 p-1 transition-colors"
            title={viewMode === 'full' ? 'Dock Window' : 'Expand Viewport'}
          >
            {viewMode === 'full' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setViewMode('hidden')}
            className="hover:text-cyan-300 p-1 transition-colors"
            title="Minimize"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Video / High-fidelity Synthesizer Canvas Screen */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black border border-cyan-500/20 shadow-inner">
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="w-full h-full object-cover"
        />

        {/* Scanlines overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

        {/* Live sync tag */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 border border-cyan-500/30 text-[10px] font-mono-tech text-cyan-300 flex items-center gap-1.5 backdrop-blur-sm">
          <Layers className="w-3 h-3 text-cyan-400" />
          <span>SCENE MATCH: {Math.round(scrollProgress * 100)}%</span>
        </div>
      </div>

      {/* Subtext info */}
      <div className="mt-2 flex items-center justify-between text-[11px] font-mono-tech text-gray-400">
        <span className="text-cyan-500/80">{currentChapter.title}</span>
        <span className="text-gray-500">{currentChapter.decisionState}</span>
      </div>
    </div>
  );
};
