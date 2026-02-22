import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { getElevationFromTerrain } from '../terrain'

/**
 * Character - A queen-like piece that moves on the TileGrid.
 *
 * Uses the same coordinate system as TileGrid:
 * - Grid (row, col) maps to world (col - offsetX, y, row - offsetZ)
 * - offsetX = (cols - 1) / 2, offsetZ = (rows - 1) / 2
 *
 * Queen movement: horizontal, vertical, or diagonal (8 directions).
 * Arrow keys or WASD to move one tile at a time.
 */
const ROWS = 28
const COLS = 20
const TILE_SIZE = 1

const FLOOR_Y = -0.5 // TileGrid base position; tile surface = FLOOR_Y + elevation

function Character() {
  const { characterRow, characterCol, terrain, moveCharacter } = useGameStore()

  // Convert grid (row, col) to world position
  const offsetX = (COLS - 1) / 2
  const offsetZ = (ROWS - 1) / 2
  const x = (characterCol - offsetX) * TILE_SIZE
  const z = (characterRow - offsetZ) * TILE_SIZE
  const elevation = getElevationFromTerrain(terrain, characterRow, characterCol)
  const y = FLOOR_Y + elevation // Sit on top of tile (follows mountains)

  // Queen movement: 8 directions (horizontal, vertical, diagonal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let dRow = 0
      let dCol = 0
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          dRow = -1
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          dRow = 1
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          dCol = -1
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          dCol = 1
          break
        case 'q':
        case 'Q':
          dRow = -1
          dCol = -1
          break
        case 'e':
        case 'E':
          dRow = -1
          dCol = 1
          break
        case 'z':
        case 'Z':
          dRow = 1
          dCol = -1
          break
        case 'c':
        case 'C':
          dRow = 1
          dCol = 1
          break
        default:
          return
      }
      e.preventDefault()
      moveCharacter(dRow, dCol)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [moveCharacter])

  // Queen-like shape: wide base (cylinder), tapered body, crown (sphere)
  return (
    <group position={[x, y, z]} scale={[1, 2.25, 1]} pointerEvents="none">
      {/* Base - wide cylinder */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.2, 8]} />
        <meshBasicMaterial color="#3d2314" />
      </mesh>
      {/* Body - narrower cylinder */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.2, 0.35, 0.3, 8]} />
        <meshBasicMaterial color="#3d2314" />
      </mesh>
      {/* Crown - sphere on top */}
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshBasicMaterial color="#3d2314" />
      </mesh>
    </group>
  )
}

export default Character
