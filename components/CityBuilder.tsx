
import React, { useState } from 'react';
import { World, PlacedBlock, Block } from '../types';
import { WORLD_THEMES, GRID_SIZE } from '../constants';

interface Props {
  world: World;
  city: PlacedBlock[];
  inventory: Block[];
  onPlace: (x: number, y: number, block: Block) => void;
  onRemove: (x: number, y: number) => void;
}

const CityBuilder: React.FC<Props> = ({ world, city, inventory, onPlace, onRemove }) => {
  const [dragOverCell, setDragOverCell] = useState<{ x: number, y: number } | null>(null);

  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
    x: i % GRID_SIZE,
    y: Math.floor(i / GRID_SIZE)
  }));

  const handleDragOver = (e: React.DragEvent, x: number, y: number) => {
    e.preventDefault();
    setDragOverCell({ x, y });
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent, x: number, y: number) => {
    e.preventDefault();
    setDragOverCell(null);
    const blockId = e.dataTransfer.getData('blockId');
    const block = inventory.find(b => b.id === blockId);
    if (block) {
      onPlace(x, y, block);
    }
  };

  const getBlockAt = (x: number, y: number) => {
    return city.find(b => b.x === x && b.y === y);
  };

  const theme = WORLD_THEMES[world];
  const allCorrect = city.length === GRID_SIZE * GRID_SIZE && city.every(pb => pb.block.pieceIndex === (pb.y * GRID_SIZE + pb.x));
  const isFilled = city.length === GRID_SIZE * GRID_SIZE;

  return (
    <div className={`relative p-2 w-full h-full flex items-center justify-center overflow-hidden transition-all duration-700 flex-1 min-h-0 ${allCorrect ? 'scale-[1.05]' : ''}`}>
      <div className="bg-white/90 backdrop-blur-2xl p-1 sm:p-2 md:p-4 rounded-2xl md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 sm:border-4 md:border-[6px] border-white relative w-auto h-auto max-h-full max-w-full aspect-square flex items-center justify-center overflow-hidden">

        <div
          className="absolute inset-1 sm:inset-2 md:inset-4 opacity-[0.15] pointer-events-none transition-all duration-1000 rounded-[0.5rem] md:rounded-[2rem] overflow-hidden border border-indigo-100/30"
          style={{
            backgroundImage: `url(${theme.imageUrl})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            filter: 'contrast(1.2) brightness(1.1) grayscale(0.5)'
          }}
        />

        <div
          className="grid gap-0.5 sm:gap-1 md:gap-2 relative z-10 w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
          }}
        >
          {cells.map((cell) => {
            const placed = getBlockAt(cell.x, cell.y);
            const isCorrectSlot = placed && placed.block.pieceIndex === (cell.y * GRID_SIZE + cell.x);
            const isTargeted = dragOverCell?.x === cell.x && dragOverCell?.y === cell.y;

            return (
              <div
                key={`${cell.x}-${cell.y}`}
                onDragOver={(e) => handleDragOver(e, cell.x, cell.y)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, cell.x, cell.y)}
                onClick={() => placed && onRemove(cell.x, cell.y)}
                className={`w-full h-full relative group transition-all rounded-md md:rounded-xl overflow-hidden border cursor-pointer ${isTargeted ? 'ring-2 md:ring-4 ring-indigo-600 ring-offset-1 md:ring-offset-2 scale-95 z-30 shadow-2xl' : 'border-indigo-100/5'}`}
              >
                {placed ? (
                  <div
                    className={`w-full h-full shadow-2xl border transition-all duration-700 ${isCorrectSlot ? 'border-green-500 scale-100' : 'border-red-600 opacity-95 scale-[0.98]'}`}
                    style={{
                      backgroundImage: `url(${theme.imageUrl})`,
                      backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                      backgroundPosition: `${(placed.block.pieceIndex % GRID_SIZE / (GRID_SIZE - 1)) * 100}% ${(Math.floor(placed.block.pieceIndex / GRID_SIZE) / (GRID_SIZE - 1)) * 100}%`,
                    }}
                  >
                    {!isCorrectSlot && (
                      <div className="absolute inset-0 bg-red-950/70 flex items-center justify-center backdrop-blur-[1px] group-hover:bg-red-900/40 transition-colors">
                        <span className="text-white text-[6px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-tighter text-center px-0.5 drop-shadow-lg leading-none">CHECK</span>
                      </div>
                    )}
                    {isCorrectSlot && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                    )}
                  </div>
                ) : (
                  <div className={`w-full h-full bg-indigo-900/5 hover:bg-indigo-600/10 transition-all border border-dashed border-indigo-200/20 rounded-md md:rounded-lg ${isTargeted ? 'bg-indigo-600/40 border-indigo-600/50' : ''}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {allCorrect && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none px-4">
          <div className="bg-indigo-950/90 backdrop-blur-md px-4 py-3 md:px-10 md:py-8 rounded-[1rem] md:rounded-[3rem] shadow-2xl border-2 md:border-4 border-yellow-400 animate-bounce text-center">
            <h3 className="text-sm sm:text-lg md:text-3xl font-black text-white uppercase tracking-tighter shadow-sm leading-none">ZONE RESTORED</h3>
            <p className="text-[6px] sm:text-[8px] md:text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1 md:mt-2">MATHLANTIS RISES</p>
          </div>
        </div>
      )}

      {isFilled && !allCorrect && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-red-600 px-4 py-1.5 rounded-full shadow-xl border-2 border-white animate-pulse">
            <p className="text-[8px] md:text-xs font-black text-white uppercase tracking-widest">SOME PIECES ARE MISALIGNED!</p>
          </div>
        </div>
      )}

      <div className="absolute top-0 right-0 bg-indigo-950 w-6 h-6 sm:w-8 sm:h-8 md:w-14 md:h-14 flex items-center justify-center rounded-lg md:rounded-xl shadow-lg text-[6px] sm:text-[8px] md:text-lg animate-bounce-subtle z-40 border-2 border-white font-black text-white uppercase tracking-tighter">
        {theme.icon}
      </div>
    </div>
  );
};

export default CityBuilder;
