import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { PLAYER_PIECE_COLOR } from '../pieceColors'
import { getElevationFromTerrain } from '../terrain'

/**
 * Character - A queen-like piece that moves on the TileGrid.
 *
 * Uses the same coordinate system as TileGrid:
 * - Grid (row, col) maps to world (col - offsetX, y, row - offsetZ)
 * - offsetX = (cols - 1) / 2, offsetZ = (rows - 1) / 2
 *
 * Movement is click-only on the grid (white dots show reachability this turn).
 * Clicks queue a shortest path; the piece steps along it one tile at a time.
 * Enter ends the turn (disabled while moving).
 */
const ROWS = 28
const COLS = 20
const TILE_SIZE = 1

const FLOOR_Y = -0.5 // TileGrid base position; tile surface = FLOOR_Y + elevation
const STEP_DELAY_MS = 200

function Character() {
  const characterRow = useGameStore((s) => s.characterRow)
  const characterCol = useGameStore((s) => s.characterCol)
  const terrain = useGameStore((s) => s.terrain)
  const playerMoveTick = useGameStore((s) => s.playerMoveTick)

  // Convert grid (row, col) to world position
  const offsetX = (COLS - 1) / 2
  const offsetZ = (ROWS - 1) / 2
  const x = (characterCol - offsetX) * TILE_SIZE
  const z = (characterRow - offsetZ) * TILE_SIZE
  const elevation = getElevationFromTerrain(terrain, characterRow, characterCol)
  const y = FLOOR_Y + elevation // Sit on top of tile (follows mountains)

  useEffect(() => {
    const q = useGameStore.getState().playerMoveQueue
    if (q.length === 0) return

    const steps = [...q]
    const genAtStart = useGameStore.getState().aiPlaybackGeneration
    let cancelled = false
    const timeoutIds: number[] = []
    const applyPlayerStep = useGameStore.getState().applyPlayerStep

    const finish = () => {
      if (useGameStore.getState().aiPlaybackGeneration !== genAtStart) return
      useGameStore.setState({ playerMoveQueue: [] })
    }

    steps.forEach(([row, col], index) => {
      const id = window.setTimeout(() => {
        if (cancelled) return
        if (useGameStore.getState().aiPlaybackGeneration !== genAtStart) return
        applyPlayerStep(row, col)
        if (index === steps.length - 1) finish()
      }, (index + 1) * STEP_DELAY_MS)
      timeoutIds.push(id)
    })

    return () => {
      cancelled = true
      timeoutIds.forEach((id) => window.clearTimeout(id))
    }
  }, [playerMoveTick])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        useGameStore.getState().endTurn()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Queen-like shape: wide base (cylinder), tapered body, crown (sphere)
  return (
    <group position={[x, y, z]} scale={[1, 2.25, 1]}>
      {/* Base - wide cylinder */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.2, 8]} />
        <meshBasicMaterial color={PLAYER_PIECE_COLOR} />
      </mesh>
      {/* Body - narrower cylinder */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.2, 0.35, 0.3, 8]} />
        <meshBasicMaterial color={PLAYER_PIECE_COLOR} />
      </mesh>
      {/* Crown - sphere on top */}
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshBasicMaterial color={PLAYER_PIECE_COLOR} />
      </mesh>
    </group>
  )
}

export default Character
