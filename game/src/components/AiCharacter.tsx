import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { AI_PIECE_COLOR } from '../pieceColors'
import { getElevationFromTerrain } from '../terrain'

/**
 * AiCharacter - Autonomous piece; magenta so it stays distinct from the orange player and landscape.
 * Moves when the player presses Enter (see gameStore endTurn / runAiTurn).
 * Path is queued in the store; this component applies each tile after STEP_DELAY_MS
 * so the piece walks instead of jumping to the final cell.
 */
const ROWS = 28
const COLS = 20
const TILE_SIZE = 1
const FLOOR_Y = -0.5
const STEP_DELAY_MS = 200

function AiCharacter() {
  const aiRow = useGameStore((s) => s.aiRow)
  const aiCol = useGameStore((s) => s.aiCol)
  const terrain = useGameStore((s) => s.terrain)
  const aiMoveTick = useGameStore((s) => s.aiMoveTick)

  useEffect(() => {
    const q = useGameStore.getState().aiMoveQueue
    if (q.length === 0) return

    const steps = [...q]
    const genAtStart = useGameStore.getState().aiPlaybackGeneration
    let cancelled = false
    const timeoutIds: number[] = []
    const setAiTile = useGameStore.getState().setAiTile

    const finish = () => {
      if (useGameStore.getState().aiPlaybackGeneration !== genAtStart) return
      useGameStore.setState({ aiMoveQueue: [] })
    }

    steps.forEach(([row, col], index) => {
      const id = window.setTimeout(() => {
        if (cancelled) return
        if (useGameStore.getState().aiPlaybackGeneration !== genAtStart) return
        setAiTile(row, col)
        if (index === steps.length - 1) finish()
      }, (index + 1) * STEP_DELAY_MS)
      timeoutIds.push(id)
    })

    return () => {
      cancelled = true
      timeoutIds.forEach((id) => window.clearTimeout(id))
    }
  }, [aiMoveTick])

  const offsetX = (COLS - 1) / 2
  const offsetZ = (ROWS - 1) / 2
  const x = (aiCol - offsetX) * TILE_SIZE
  const z = (aiRow - offsetZ) * TILE_SIZE
  const elevation = getElevationFromTerrain(terrain, aiRow, aiCol)
  const y = FLOOR_Y + elevation

  return (
    <group position={[x, y, z]} scale={[1, 2.25, 1]}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.2, 8]} />
        <meshBasicMaterial color={AI_PIECE_COLOR} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.2, 0.35, 0.3, 8]} />
        <meshBasicMaterial color={AI_PIECE_COLOR} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshBasicMaterial color={AI_PIECE_COLOR} />
      </mesh>
    </group>
  )
}

export default AiCharacter
