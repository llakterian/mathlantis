
import React, { useState, useCallback, useEffect } from 'react';
import { Difficulty, World, Block, PlacedBlock } from './types';
import { WORLD_THEMES, GRID_SIZE } from './constants';
import MathQuest from './components/MathQuest';
import CityBuilder from './components/CityBuilder';
import UIOverlay from './components/UIOverlay';
import { soundService } from './services/soundService';

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.BEGINNER);
  const [world, setWorld] = useState<World>(World.MODERN);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [city, setCity] = useState<PlacedBlock[]>([]);
  const [history, setHistory] = useState<PlacedBlock[][]>([]);
  const [stats, setStats] = useState({ solved: 0, level: 1 });
  const [encouragement, setEncouragement] = useState("Solve math to rebuild Mathlantis!");
  const [isDay, setIsDay] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastBlockAddedId, setLastBlockAddedId] = useState<string | null>(null);

  useEffect(() => {
    soundService.setEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    setCity([]);
    setBlocks([]);
    setHistory([]);
    setEncouragement(`Zone: ${world}. Rebuild the city.`);
  }, [world]);

  const toggleDayNight = useCallback(() => {
    setIsDay(prev => !prev);
  }, []);

  const fetchEncouragement = useCallback((solvedCount: number) => {
    const wizardMessages = [
      "Your mathematical prowess is restoring the city's foundations!",
      "The numbers align in your favor, apprentice!",
      "A brilliant calculation! Mathlantis shines brighter today!",
      "You are decrypting the ancient secrets of calculation!",
      "Magnificent! The city's spirit grows stronger with every answer!",
      "Your logic is as sharp as a wizard's blade!",
      "The equation is solved, and the path is clear!",
      "You are becoming a true Master of Numbers!"
    ];

    const message = wizardMessages[Math.floor(Math.random() * wizardMessages.length)];
    setEncouragement(message);
  }, [world]);

  const handleSolve = useCallback((correct: boolean) => {
    if (correct) {
      soundService.playCorrect();

      const totalPieces = GRID_SIZE * GRID_SIZE;
      const placedIndices = city.map(pb => pb.block.pieceIndex);
      const inventoryIndices = blocks.map(b => b.pieceIndex);
      const usedIndices = new Set([...placedIndices, ...inventoryIndices]);

      const remainingIndices = Array.from({ length: totalPieces }, (_, i) => i)
        .filter(i => !usedIndices.has(i));

      if (remainingIndices.length > 0) {
        const randomIndex = remainingIndices[Math.floor(Math.random() * remainingIndices.length)];
        const theme = WORLD_THEMES[world];
        const newBlock: Block = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'puzzle-piece',
          color: theme.blockColors[Math.floor(Math.random() * theme.blockColors.length)],
          world: world,
          pieceIndex: randomIndex
        };
        setBlocks(prev => [...prev, newBlock]);
        setLastBlockAddedId(newBlock.id);
        setTimeout(() => setLastBlockAddedId(null), 3000);
      } else {
        setEncouragement("All pieces recovered! Arrange them to finish.");
      }

      setStats(prev => {
        const newSolved = prev.solved + 1;
        if (newSolved % 5 === 0) fetchEncouragement(newSolved);
        return { ...prev, solved: newSolved };
      });
    } else {
      soundService.playWrong();
    }
  }, [world, city, blocks, fetchEncouragement]);

  const placeBlock = useCallback((x: number, y: number, block: Block) => {
    const isCorrectSlot = block.pieceIndex === (y * GRID_SIZE + x);

    if (isCorrectSlot) {
      soundService.playSuccessPlace();
    } else {
      soundService.playPlace();
    }

    setHistory(prev => [city, ...prev].slice(0, 7));
    setCity(prev => [...prev, { x, y, block }]);
    setBlocks(prev => prev.filter(b => b.id !== block.id));

    const totalPieces = GRID_SIZE * GRID_SIZE;
    if (city.length + 1 === totalPieces) {
      const allCorrect = [...city, { x, y, block }].every(pb => pb.block.pieceIndex === (pb.y * GRID_SIZE + pb.x));
      if (allCorrect) {
        setTimeout(() => {
          setEncouragement(`Success! The ${world} is restored!`);
          soundService.playCorrect();
        }, 500);
      }
    }
  }, [city, world]);

  const removeBlock = useCallback((x: number, y: number) => {
    const blockToMove = city.find(pb => pb.x === x && pb.y === y);
    if (blockToMove) {
      setCity(prev => prev.filter(pb => !(pb.x === x && pb.y === y)));
      setBlocks(prev => [...prev, blockToMove.block]);
      soundService.playPlace();
    }
  }, [city]);

  const undo = useCallback(() => {
    if (history.length > 0) {
      const lastState = history[0];
      const lastPlaced = city[city.length - 1];
      if (lastPlaced) {
        setBlocks(prev => [...prev, lastPlaced.block]);
      }
      setCity(lastState);
      setHistory(prev => prev.slice(1));
      soundService.playPlace();
    }
  }, [history, city]);

  return (
    <div className={`fixed inset-0 w-full h-full flex flex-col transition-colors duration-1000 overflow-hidden ${isDay ? WORLD_THEMES[world].bg : 'bg-slate-950 text-white'}`}>
      <UIOverlay
        stats={stats} world={world} setWorld={setWorld}
        difficulty={difficulty} setDifficulty={setDifficulty}
        encouragement={encouragement} isDay={isDay} toggleDayNight={toggleDayNight}
        undo={undo} canUndo={history.length > 0}
        soundEnabled={soundEnabled} toggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      <main className="flex-1 min-h-0 flex flex-col md:flex-row items-center justify-center p-2 md:p-4 gap-4 md:gap-8 overflow-hidden">
        <div className="w-full md:w-auto flex-shrink-0 flex items-center justify-center">
          <MathQuest difficulty={difficulty} onSolve={handleSolve} />
        </div>

        <div className="flex-1 w-full h-full flex items-center justify-center min-h-0 overflow-hidden">
          <CityBuilder
            world={world}
            city={city}
            inventory={blocks}
            onPlace={placeBlock}
            onRemove={removeBlock}
          />
        </div>
      </main>

      <footer className="h-20 md:h-28 bg-white/10 backdrop-blur-xl border-t border-white/20 p-2 flex items-center gap-3 overflow-x-auto no-scrollbar shrink-0">
        <div className="px-3 border-r border-white/10 hidden sm:flex flex-col justify-center">
          <div className="text-[9px] font-black uppercase tracking-widest text-indigo-100 leading-none">PIECES</div>
          <div className="text-[7px] text-white/50 font-black uppercase tracking-widest leading-none mt-1">{blocks.length} OWNED</div>
        </div>

        {blocks.length === 0 ? (
          <div className="flex-1 flex justify-center items-center gap-3 italic text-white/30 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] animate-pulse text-center">
            SOLVE MATH TO EARN CITY BLOCKS ({city.length}/16 RESTORED)
          </div>
        ) : (
          <div className="flex gap-2.5 h-full items-center px-2">
            {blocks.map((block) => {
              const theme = WORLD_THEMES[world];
              const bx = block.pieceIndex % GRID_SIZE;
              const by = Math.floor(block.pieceIndex / GRID_SIZE);
              const isNew = lastBlockAddedId === block.id;

              return (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('blockId', block.id);
                  }}
                  className={`w-14 h-14 md:w-20 md:h-20 rounded-xl shadow-xl cursor-grab active:cursor-grabbing hover:scale-110 transition-all flex-shrink-0 border-2 border-white/80 overflow-hidden relative group ${isNew ? 'animate-bounce ring-2 ring-yellow-400' : ''}`}
                  style={{
                    backgroundImage: `url(${theme.imageUrl})`,
                    backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                    backgroundPosition: `${(bx / (GRID_SIZE - 1)) * 100}% ${(by / (GRID_SIZE - 1)) * 100}%`,
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 right-0 bg-black/60 px-1 text-[7px] font-black text-white uppercase tracking-tighter">#{block.pieceIndex + 1}</div>
                </div>
              );
            })}
          </div>
        )}
      </footer>
    </div>
  );
};

export default App;
