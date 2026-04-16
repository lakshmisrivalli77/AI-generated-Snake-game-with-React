import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Music2, Gamepad2, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="h-screen bg-background text-foreground p-6 flex flex-col gap-6 max-w-[1200px] mx-auto overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center px-2 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="font-mono text-2xl font-bold tracking-widest text-neon-cyan drop-shadow-[0_0_10px_rgba(0,255,255,0.4)]">
            SYNTH_SNAKE.EXE
          </div>
        </div>
        <div className="font-mono text-xs text-text-dim uppercase tracking-wider hidden md:block">
          LATENCY: 12ms // MEM: 42% // GPU: 68%
        </div>
      </header>

      {/* Bento Grid */}
      <main className="grid grid-cols-1 md:grid-cols-[280px_1fr_240px] grid-rows-[1fr_120px] gap-4 flex-1 min-h-0">
        {/* Library Card */}
        <div className="bento-card flex flex-col min-h-0">
          <span className="section-title">AI Music Collection</span>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-neon-purple/10 border border-neon-purple/30">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-purple to-[#5A13FE] flex items-center justify-center text-lg">
                ♫
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">Neon Dreams</p>
                <p className="text-xs text-text-dim truncate">AI Orchestrator-01</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-[#0055FF] flex items-center justify-center text-lg">
                ≈
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate text-slate-300">Digital Rain</p>
                <p className="text-xs text-text-dim truncate">AI Orchestrator-02</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF00FF] to-[#880088] flex items-center justify-center text-lg">
                ⚡
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate text-slate-300">Cyber Pulse</p>
                <p className="text-xs text-text-dim truncate">AI Orchestrator-03</p>
              </div>
            </div>
          </div>
        </div>

        {/* Game Card */}
        <div className="bento-card flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,#151515_0%,#0a0a0a_100%)] border-neon-green/20">
          <SnakeGame />
          <div className="mt-5 text-text-dim text-[11px] font-mono tracking-widest uppercase">
            Use arrow keys to control
          </div>
        </div>

        {/* Stats Card */}
        <div className="bento-card flex flex-col gap-8">
          <div className="text-center">
            <span className="section-title">Current Score</span>
            <div id="current-score-display" className="font-mono text-4xl font-bold text-neon-green drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]">
              00,000
            </div>
            <div className="text-[10px] text-text-dim uppercase mt-1">Points Earned</div>
          </div>
          
          <div className="text-center">
            <span className="section-title">Session High</span>
            <div id="high-score-display" className="font-mono text-4xl font-bold text-neon-cyan drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
              00,000
            </div>
            <div className="text-[10px] text-text-dim uppercase mt-1">Personal Best</div>
          </div>

          <div className="text-center">
            <span className="section-title">Speed Level</span>
            <div className="font-mono text-4xl font-bold text-neon-purple drop-shadow-[0_0_10px_rgba(188,19,254,0.3)]">
              08
            </div>
            <div className="text-[10px] text-text-dim uppercase mt-1">BPM Synced</div>
          </div>
        </div>

        {/* Player Card */}
        <div className="bento-card md:col-span-3 flex items-center justify-between px-10 h-[120px]">
          <MusicPlayer />
        </div>
      </main>

      <footer className="text-center py-4 opacity-30">
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase">
          SynthSnake OS v1.0.4 // © 2024 Neon Synth Arcade
        </p>
      </footer>
    </div>
  );
}
