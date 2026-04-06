import { useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import { PLAYER_PIECE_COLOR } from '../pieceColors'
import { getElevationFromTerrain } from '../terrain'

const ROWS = 28
const COLS = 20
const FLOOR_Y = -0.5
const OFFSET_X = (COLS - 1) / 2
const OFFSET_Z = (ROWS - 1) / 2

/** Local-space noop raycast so clicks pass through to the tile. */
function noRaycast() {}

/**
 * Player-built houses: simple block + roof, same color as the player piece (only the player can build).
 */
function Houses() {
  const terrain = useGameStore((s) => s.terrain)
  const housePositions = useGameStore((s) => s.housePositions)

  const positions = useMemo(
    () =>
      Array.from(housePositions).map((key) => {
        const [r, c] = key.split(',').map(Number)
        return [r, c] as [number, number]
      }),
    [housePositions]
  )

  if (!terrain || positions.length === 0) return null

  const bodyH = 0.26
  const bodyY = bodyH / 2
  const roofH = 0.18
  const roofY = bodyH + roofH / 2

  return (
    <group>
      {positions.map(([row, col], i) => {
        const x = col - OFFSET_X
        const z = row - OFFSET_Z
        const elev = getElevationFromTerrain(terrain, row, col)
        const y = FLOOR_Y + elev
        return (
          <group key={`house-${row}-${col}-${i}`} position={[x, y, z]}>
            <mesh position={[0, bodyY, 0]} raycast={noRaycast}>
              <boxGeometry args={[0.34, bodyH, 0.34]} />
              <meshBasicMaterial color={PLAYER_PIECE_COLOR} />
            </mesh>
            <mesh position={[0, roofY, 0]} rotation={[0, Math.PI / 4, 0]} raycast={noRaycast}>
              <coneGeometry args={[0.26, roofH, 4]} />
              <meshBasicMaterial color={PLAYER_PIECE_COLOR} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export default Houses
