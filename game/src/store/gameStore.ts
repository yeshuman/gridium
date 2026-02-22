import { create } from 'zustand'

/**
 * Game state types - used across the app for game logic
 */
export type GameState = 'playing' | 'paused' | 'menu' | 'gameover'

/**
 * gameStore - Zustand store for global game state.
 *
 * Zustand is lightweight and works well with R3F:
 * - No provider needed
 * - Components subscribe only to the slices they use
 * - Can be read/updated from useFrame (outside React's render cycle)
 *
 * Use: const { score, gameState } = useGameStore()
 */
interface GameStore {
  score: number
  gameState: GameState
  setScore: (score: number) => void
  addScore: (delta: number) => void
  setGameState: (state: GameState) => void
  reset: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  score: 0,
  gameState: 'menu',
  setScore: (score) => set({ score }),
  addScore: (delta) => set((state) => ({ score: state.score + delta })),
  setGameState: (gameState) => set({ gameState }),
  reset: () => set({ score: 0, gameState: 'menu' }),
}))
