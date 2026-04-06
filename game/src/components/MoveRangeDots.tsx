import { useEffect, useMemo, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import {
  getAdjacentHouseBuildableTiles,
  getElevationFromTerrain,
  minCostToAllReachableTiles,
} from '../terrain'

const ROWS = 28
const COLS = 20
const TILE_SIZE = 1
const FLOOR_Y = -0.5
const DOT_Y_OFFSET = 0.08

const MOVE_DOT_COLOR = '#ffffff'
/** Build hints while Shift is held — distinct from move dots. */
const BUILD_DOT_COLOR = '#ffd54f'

/**
 * White dots: tiles you can move to this turn (when Shift is not held).
 * Gold dots: adjacent tiles where you can place a house (while Shift is held).
 * Hidden while the player is stepping along a move path.
 */
function MoveRangeDots() {
  const characterRow = useGameStore((s) => s.characterRow)
  const characterCol = useGameStore((s) => s.characterCol)
  const movesRemaining = useGameStore((s) => s.movesRemaining)
  const terrain = useGameStore((s) => s.terrain)
  const treePositions = useGameStore((s) => s.treePositions)
  const housePositions = useGameStore((s) => s.housePositions)
  const houseBuiltThisTurn = useGameStore((s) => s.houseBuiltThisTurn)
  const aiRow = useGameStore((s) => s.aiRow)
  const aiCol = useGameStore((s) => s.aiCol)
  const playerMoveQueue = useGameStore((s) => s.playerMoveQueue)

  const [shiftHeld, setShiftHeld] = useState(false)

  useEffect(() => {
    const syncShift = (e: KeyboardEvent) => setShiftHeld(e.shiftKey)
    const clearShift = () => setShiftHeld(false)
    window.addEventListener('keydown', syncShift)
    window.addEventListener('keyup', syncShift)
    window.addEventListener('blur', clearShift)
    return () => {
      window.removeEventListener('keydown', syncShift)
      window.removeEventListener('keyup', syncShift)
      window.removeEventListener('blur', clearShift)
    }
  }, [])

  const { cells, dotColor } = useMemo(() => {
    if (playerMoveQueue.length > 0) return { cells: [] as [number, number][], dotColor: MOVE_DOT_COLOR }

    if (shiftHeld) {
      return {
        cells: getAdjacentHouseBuildableTiles(
          characterRow,
          characterCol,
          terrain,
          treePositions,
          housePositions,
          aiRow,
          aiCol,
          houseBuiltThisTurn,
          playerMoveQueue.length
        ),
        dotColor: BUILD_DOT_COLOR,
      }
    }

    if (movesRemaining <= 0) return { cells: [], dotColor: MOVE_DOT_COLOR }

    const dist = minCostToAllReachableTiles(
      characterRow,
      characterCol,
      movesRemaining,
      terrain,
      treePositions,
      housePositions,
      aiRow,
      aiCol
    )
    const startKey = `${characterRow},${characterCol}`
    const out: [number, number][] = []
    for (const [k, cost] of dist) {
      if (k === startKey || cost <= 0) continue
      const [r, c] = k.split(',').map(Number)
      out.push([r, c])
    }
    return { cells: out, dotColor: MOVE_DOT_COLOR }
  }, [
    shiftHeld,
    playerMoveQueue.length,
    characterRow,
    characterCol,
    movesRemaining,
    terrain,
    treePositions,
    housePositions,
    houseBuiltThisTurn,
    aiRow,
    aiCol,
  ])

  const offsetX = (COLS - 1) / 2
  const offsetZ = (ROWS - 1) / 2

  if (cells.length === 0) return null

  return (
    <group>
      {cells.map(([row, col]) => {
        const x = (col - offsetX) * TILE_SIZE
        const z = (row - offsetZ) * TILE_SIZE
        const el = getElevationFromTerrain(terrain, row, col)
        const y = FLOOR_Y + el + DOT_Y_OFFSET
        return (
          <mesh
            key={`${shiftHeld ? 'b' : 'm'}-${row}-${col}`}
            position={[x, y, z]}
            rotation={[-Math.PI / 2, 0, 0]}
            raycast={() => {
              /* no pick: clicks pass through to the tile below */
            }}
          >
            <circleGeometry args={[0.12, 16]} />
            <meshBasicMaterial color={dotColor} />
          </mesh>
        )
      })}
    </group>
  )
}

export default MoveRangeDots
