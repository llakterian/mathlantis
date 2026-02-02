
import { Difficulty, World, LevelConfig } from './types';

export const LEVEL_CONFIGS: Record<Difficulty, LevelConfig> = {
  [Difficulty.BEGINNER]: { maxNumber: 10, operations: ['+'] },      // Ages 5-6: Basic addition
  [Difficulty.EASY]: { maxNumber: 20, operations: ['+', '-'] },    // Ages 7-8: Addition & Subtraction
  [Difficulty.MEDIUM]: { maxNumber: 50, operations: ['+', '-'] },  // Ages 9-10: Larger numbers
  [Difficulty.HARD]: { maxNumber: 12, operations: ['+', '-', '*'] }, // Ages 11: Introduction to Multiplication (tables up to 12)
  [Difficulty.EXPERT]: { maxNumber: 100, operations: ['+', '-', '*', '/'] } // Age 12: All operations, division
};

export const WORLD_THEMES: Record<World, {
  bg: string;
  gridColor: string;
  blockColors: string[];
  icon: string;
  imageUrl: string;
}> = {
  [World.MODERN]: {
    bg: 'from-blue-100 to-blue-200',
    gridColor: 'rgba(59, 130, 246, 0.2)',
    blockColors: ['bg-blue-500', 'bg-red-500'],
    icon: 'MOD',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1000&auto=format&fit=crop'
  },
  [World.EGYPT]: {
    bg: 'from-orange-100 to-yellow-200',
    gridColor: 'rgba(234, 179, 8, 0.2)',
    blockColors: ['bg-yellow-600', 'bg-orange-600'],
    icon: 'EGY',
    imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1000&auto=format&fit=crop'
  },
  [World.MEDIEVAL]: {
    bg: 'from-emerald-100 to-green-200',
    gridColor: 'rgba(16, 185, 129, 0.2)',
    blockColors: ['bg-stone-500', 'bg-emerald-700'],
    icon: 'MED',
    imageUrl: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?q=80&w=1000&auto=format&fit=crop'
  },
  [World.FUTURE]: {
    bg: 'from-purple-100 to-indigo-200',
    gridColor: 'rgba(139, 92, 246, 0.2)',
    blockColors: ['bg-cyan-400', 'bg-fuchsia-500'],
    icon: 'FUT',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop'
  }
};

export const GRID_SIZE = 4; // 4x4 puzzle
