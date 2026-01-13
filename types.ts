
export enum Difficulty {
  BEGINNER = 'Beginner',
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  EXPERT = 'Expert'
}

export enum World {
  MODERN = 'Modern City',
  EGYPT = 'Ancient Egypt',
  MEDIEVAL = 'Medieval Kingdom',
  FUTURE = 'Futuristic Metropolis'
}

export interface Operation {
  symbol: string;
  name: string;
}

export interface Block {
  id: string;
  type: string;
  color: string;
  world: World;
  pieceIndex: number; // Index in the puzzle (0-15 for a 4x4 grid)
}

export interface GridPos {
  x: number;
  y: number;
}

export interface PlacedBlock extends GridPos {
  block: Block;
}

export interface LevelConfig {
  maxNumber: number;
  operations: string[];
}
