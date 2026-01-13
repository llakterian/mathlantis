# Mathlantis: The Lost City of Numbers

Mathlantis is a modern educational web application that combines mathematical challenges with city-building mechanics. Players solve dynamically generated math problems to recover lost fragments of history and rebuild the legendary City of Numbers across different historical and futuristic zones.

## Overview

The game challenges players to restore Mathlantis by solving arithmetic problems. Each correct answer provides a unique puzzle piece (city block) corresponding to the current world theme. Players must not only solve the math but also strategically place the recovered pieces in their correct grid positions to complete the restoration of each zone.

## Key Features

### Mathematical Challenges
- Multiple Difficulty Levels: Beginner, Intermediate, and Advanced settings to cater to different skill levels.
- Adaptive Problem Generation: Real-time math question generation based on selected difficulty.
- Sound Feedback: Immersive audio cues for correct answers, wrong answers, and building actions.

### City Building and Restoration
- Historical and Futuristic Zones: Rebuild Ancient, Modern, and Cyberpunk versions of Mathlantis.
- Puzzle Grid System: Each zone consists of a 4x4 grid. Players earn specific pieces that belong to unique coordinates.
- Drag and Drop Interface: Intuitive placement of earned blocks from the inventory to the construction site.
- State Persistence: Undo functionality to reverse recent construction actions.

### Reward System
- Math Wizard Encouragement: Receive motivational messages from the Math Wizard as you progress through the game.
- Piece Recovery: Each correct answer earns you a unique piece of the city grid.

## Technology Stack

- Core Framework: React 19
- Build Tool: Vite
- Programming Language: TypeScript
- Styling: Tailwind CSS
- State Management: React Hooks (useState, useCallback, useEffect)

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository to your local machine.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```

### Running the Game

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173 by default.

## Project Structure

- components/: React components for the math interface, city builder, and UI overlays.
- services/: Modular services for sound effects and math engine logic.
- constants.tsx: Configuration for world themes, colors, and grid settings.
- types.ts: TypeScript interfaces and enums for project-wide type safety.
- App.tsx: Root application component managing game state and logic.

## How to Play

1. Select your Difficulty and World Zone from the UI overlay.
2. Solve the math problem displayed on the left side of the screen.
3. Upon solving, a new piece will appear in your inventory (the bottom bar).
4. Drag the piece from your inventory and drop it onto the construction grid on the right.
5. If the piece is placed in its original intended slot, you will hear a success chime.
6. Fill all 16 slots correctly to restore the zone and move to the next world.

## License

This project is private and intended for educational evaluation purposes.
