import { create } from 'zustand'
import type { TerrainData } from '../terrain'

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
  // Character position on the tile grid (row, col)
  characterRow: number
  characterCol: number
  // Terrain data (from TileGrid) so Character can read elevation
  terrain: TerrainData | null
  // Tree positions (from Trees) - character cannot move onto these tiles
  treePositions: Set<string>
  setScore: (score: number) => void
  addScore: (delta: number) => void
  setGameState: (state: GameState) => void
  setCharacterPosition: (row: number, col: number) => void
  moveCharacter: (dRow: number, dCol: number) => void
  setTerrain: (terrain: TerrainData) => void
  setTreePositions: (positions: Set<string>) => void
  reset: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  score: 0,
  gameState: 'menu',
  characterRow: 12,
  characterCol: 8,
  terrain: null,
  treePositions: new Set<string>(),
  setScore: (score) => set({ score }),
  addScore: (delta) => set((state) => ({ score: state.score + delta })),
  setGameState: (gameState) => set({ gameState }),
  setCharacterPosition: (row, col) => set({ characterRow: row, characterCol: col }),
  moveCharacter: (dRow, dCol) =>
    set((state) => {
      const newRow = state.characterRow + dRow
      const newCol = state.characterCol + dCol
      const treeKey = `${newRow},${newCol}`
      if (state.treePositions.has(treeKey)) return state
      return {
        characterRow: Math.max(0, Math.min(27, newRow)),
        characterCol: Math.max(0, Math.min(19, newCol)),
      }
    }),
  setTerrain: (terrain) => set({ terrain }),
  setTreePositions: (treePositions) => set({ treePositions }),
  reset: () => set({ score: 0, gameState: 'menu', characterRow: 12, characterCol: 8, treePositions: new Set<string>() }),
}))
