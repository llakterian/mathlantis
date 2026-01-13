
import React from 'react';
import { Difficulty, World } from '../types';

interface Props {
  stats: { solved: number; level: number };
  world: World;
  setWorld: (w: World) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  encouragement: string;
  isDay: boolean;
  toggleDayNight: () => void;
  undo: () => void;
  canUndo: boolean;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const UIOverlay: React.FC<Props> = ({ 
  stats, world, setWorld, difficulty, setDifficulty, encouragement, isDay, toggleDayNight, undo, canUndo, soundEnabled, toggleSound 
}) => {
  return (
    <div className="z-20 p-1.5 md:p-3 flex flex-col gap-1.5 w-full shrink-0">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-white/95 p-1 rounded-lg shadow-lg border border-indigo-50">
          <div className="bg-indigo-600 text-white px-1.5 py-0.5 rounded text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-none">HUB</div>
          <h1 className="text-[10px] md:text-sm font-black text-indigo-900 leading-none hidden sm:block">MATHLANTIS</h1>
        </div>

        <div className="flex-1 max-w-xs hidden md:block overflow-hidden">
          <div className="bg-indigo-900/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex items-center gap-2">
            <span className="text-[7px] font-black text-indigo-500 uppercase tracking-widest bg-white px-1.5 rounded-full">AI</span>
            <p className="text-[9px] font-bold italic truncate text-indigo-900 uppercase tracking-tight">{encouragement}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={toggleSound} className={`p-1.5 md:p-2 rounded-lg bg-white shadow-md border text-[7px] md:text-[9px] font-black uppercase tracking-widest ${soundEnabled ? 'text-indigo-600 border-indigo-100' : 'text-gray-300 border-gray-100'}`}>
            {soundEnabled ? 'VOL' : 'MUT'}
          </button>
          <button onClick={toggleDayNight} className="p-1.5 md:p-2 rounded-lg bg-white shadow-md border border-indigo-100 text-[7px] md:text-[9px] font-black uppercase tracking-widest text-indigo-600">
            {isDay ? 'LITE' : 'DARK'}
          </button>
          <button onClick={undo} disabled={!canUndo} className={`p-1.5 md:p-2 rounded-lg bg-white shadow-md border text-[7px] md:text-[9px] font-black uppercase tracking-widest ${!canUndo ? 'opacity-30 border-gray-100 text-gray-300' : 'border-red-100 text-red-600'}`}>
            UNDO
          </button>
          <div className="bg-white/95 px-2 py-1.5 md:px-3 md:py-2 rounded-lg shadow-md border border-indigo-100 flex items-center gap-1.5">
            <span className="text-[7px] md:text-[8px] font-black text-indigo-300 uppercase tracking-widest leading-none">PTS</span>
            <span className="text-[10px] md:text-xs font-black text-indigo-600 leading-none">{stats.solved}</span>
          </div>
        </div>
      </div>

      {/* Control Panels: Horizontal Scroll on Small screens */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-white/50 shrink-0">
          <span className="text-[6px] md:text-[7px] font-black text-indigo-300 uppercase px-1 tracking-widest">RANK</span>
          <div className="flex gap-1">
            {Object.values(Difficulty).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-1.5 py-0.5 rounded text-[7px] md:text-[8px] font-black transition-all uppercase tracking-widest whitespace-nowrap ${
                  difficulty === d ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:bg-indigo-50'
                }`}
              >
                {d.charAt(0)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-white/50 shrink-0">
          <span className="text-[6px] md:text-[7px] font-black text-indigo-300 uppercase px-1 tracking-widest">ZONE</span>
          <div className="flex gap-1">
            {Object.values(World).map((w) => (
              <button
                key={w}
                onClick={() => setWorld(w)}
                className={`px-1.5 py-0.5 rounded text-[7px] md:text-[8px] font-black transition-all uppercase tracking-widest whitespace-nowrap ${
                  world === w ? 'bg-orange-600 text-white shadow-sm' : 'text-gray-400 hover:bg-orange-50'
                }`}
              >
                {w.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIOverlay;
