import { create } from 'zustand'
import type { TerrainData } from '../terrain'
import { getTileMoveCost, isRiverOrLake, queenShortestPathCells } from '../terrain'

/**
 * Game state types - used across the app for game logic
 */
export type GameState = 'playing' | 'paused' | 'menu' | 'gameover'

export const MOVES_PER_TURN = 5

const AI_START_ROW = 15
const AI_START_COL = 12

const DIRECTIONS: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
]

function isAdjacent8(pr: number, pc: number, row: number, col: number): boolean {
  if (row === pr && col === pc) return false
  return Math.abs(row - pr) <= 1 && Math.abs(col - pc) <= 1
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Grid cells the AI will visit this turn, in order (AiCharacter steps through these). */
export type AiStep = [number, number]

type PlanState = Pick<
  GameStore,
  'aiRow' | 'aiCol' | 'characterRow' | 'characterCol' | 'treePositions' | 'housePositions' | 'terrain'
>

function planAiSteps(state: PlanState): AiStep[] {
  const steps: AiStep[] = []
  let r = state.aiRow
  let c = state.aiCol
  let budget = MOVES_PER_TURN
  while (budget > 0) {
    let moved = false
    for (const [dR, dC] of shuffle(DIRECTIONS)) {
      const nr = r + dR
      const nc = c + dC
      if (nr < 0 || nr > 27 || nc < 0 || nc > 19) continue
      const key = `${nr},${nc}`
      if (state.treePositions.has(key) || state.housePositions.has(key)) continue
      if (nr === state.characterRow && nc === state.characterCol) continue
      const cost = getTileMoveCost(state.terrain, nr, nc)
      if (cost > budget) continue
      r = nr
      c = nc
      budget -= cost
      steps.push([r, c])
      moved = true
      break
    }
    if (!moved) break
  }
  return steps
}

/**
 * gameStore - Zustand store for global game state.
 */
interface GameStore {
  score: number
  gameState: GameState
  characterRow: number
  characterCol: number
  aiRow: number
  aiCol: number
  /** Pending AI path; cleared when playback finishes. Ticks `aiMoveTick`. */
  aiMoveQueue: AiStep[]
  aiMoveTick: number
  /** Pending player click path; stepped in Character. Ticks `playerMoveTick`. */
  playerMoveQueue: AiStep[]
  playerMoveTick: number
  /** Incremented on reset so in-flight step timers do not apply stale moves. */
  aiPlaybackGeneration: number
  terrain: TerrainData | null
  treePositions: Set<string>
  housePositions: Set<string>
  /** One build per player turn; reset on end turn. */
  houseBuiltThisTurn: boolean
  movesRemaining: number
  setScore: (score: number) => void
  addScore: (delta: number) => void
  setGameState: (state: GameState) => void
  setCharacterPosition: (row: number, col: number) => void
  buildHouse: (row: number, col: number) => void
  applyPlayerStep: (row: number, col: number) => void
  endTurn: () => void
  runAiTurn: () => void
  setAiTile: (row: number, col: number) => void
  setTerrain: (terrain: TerrainData) => void
  setTreePositions: (positions: Set<string>) => void
  reset: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  score: 0,
  gameState: 'menu',
  characterRow: 12,
  characterCol: 8,
  aiRow: AI_START_ROW,
  aiCol: AI_START_COL,
  aiMoveQueue: [],
  aiMoveTick: 0,
  playerMoveQueue: [],
  playerMoveTick: 0,
  aiPlaybackGeneration: 0,
  terrain: null,
  treePositions: new Set<string>(),
  housePositions: new Set<string>(),
  houseBuiltThisTurn: false,
  movesRemaining: MOVES_PER_TURN,
  setScore: (score) => set({ score }),
  addScore: (delta) => set((state) => ({ score: state.score + delta })),
  setGameState: (gameState) => set({ gameState }),
  setCharacterPosition: (row, col) => {
    const state = get()
    if (state.movesRemaining <= 0) return
    if (state.playerMoveQueue.length > 0) return
    const newRow = Math.max(0, Math.min(27, row))
    const newCol = Math.max(0, Math.min(19, col))
    if (newRow === state.characterRow && newCol === state.characterCol) return
    const steps = queenShortestPathCells(
      state.characterRow,
      state.characterCol,
      newRow,
      newCol,
      state.movesRemaining,
      state.terrain,
      state.treePositions,
      state.housePositions,
      state.aiRow,
      state.aiCol
    )
    if (!steps || steps.length === 0) return
    set((s) => ({
      playerMoveQueue: steps,
      playerMoveTick: s.playerMoveTick + 1,
    }))
  },
  buildHouse: (row, col) =>
    set((state) => {
      if (state.houseBuiltThisTurn) return state
      if (state.playerMoveQueue.length > 0) return state
      const key = `${row},${col}`
      if (state.treePositions.has(key) || state.housePositions.has(key)) return state
      if (state.aiRow === row && state.aiCol === col) return state
      if (state.characterRow === row && state.characterCol === col) return state
      if (!isAdjacent8(state.characterRow, state.characterCol, row, col)) return state
      if (!state.terrain) return state
      if (isRiverOrLake(state.terrain, row, col)) return state
      const next = new Set(state.housePositions)
      next.add(key)
      return { housePositions: next, houseBuiltThisTurn: true }
    }),
  applyPlayerStep: (row, col) =>
    set((state) => ({
      characterRow: row,
      characterCol: col,
      movesRemaining: state.movesRemaining - getTileMoveCost(state.terrain, row, col),
    })),
  runAiTurn: () => {
    const steps = planAiSteps(get())
    if (steps.length === 0) return
    set((s) => ({
      aiMoveQueue: steps,
      aiMoveTick: s.aiMoveTick + 1,
    }))
  },
  setAiTile: (row, col) => set({ aiRow: row, aiCol: col }),
  endTurn: () => {
    if (get().playerMoveQueue.length > 0) return
    set({ movesRemaining: MOVES_PER_TURN, houseBuiltThisTurn: false })
    get().runAiTurn()
  },
  setTerrain: (terrain) => set({ terrain }),
  setTreePositions: (treePositions) => set({ treePositions }),
  reset: () =>
    set((s) => ({
      score: 0,
      gameState: 'menu',
      characterRow: 12,
      characterCol: 8,
      aiRow: AI_START_ROW,
      aiCol: AI_START_COL,
      aiMoveQueue: [],
      aiMoveTick: 0,
      playerMoveQueue: [],
      playerMoveTick: 0,
      aiPlaybackGeneration: s.aiPlaybackGeneration + 1,
      treePositions: new Set<string>(),
      housePositions: new Set<string>(),
      houseBuiltThisTurn: false,
      movesRemaining: MOVES_PER_TURN,
    })),
}))
