import { useMemo, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { getElevationFromTerrain } from '../terrain'

const ROWS = 28
const COLS = 20
const FLOOR_Y = -0.5
const NUM_TREES = 25
const OFFSET_X = (COLS - 1) / 2
const OFFSET_Z = (ROWS - 1) / 2

/**
 * Trees - Randomly placed trees on the tile grid.
 *
 * Trees spawn on land tiles (not river or lake). Each tree has a brown
 * trunk and green foliage.
 */
function Trees() {
  const terrain = useGameStore((s) => s.terrain)

  const treePositions = useMemo(() => {
    if (!terrain) return []
    const water = new Set([
      ...terrain.riverSet,
      ...terrain.lakeSet,
    ])
    const positions: [number, number][] = []
    let attempts = 0
    while (positions.length < NUM_TREES && attempts < 200) {
      attempts++
      const row = Math.floor(Math.random() * ROWS)
      const col = Math.floor(Math.random() * COLS)
      const key = `${row},${col}`
      if (water.has(key)) continue
      if (row === 12 && col === 8) continue // Avoid character start position
      if (positions.some(([r, c]) => r === row && c === col)) continue
      positions.push([row, col])
    }
    return positions
  }, [terrain])

  useEffect(() => {
    const set = new Set(treePositions.map(([r, c]) => `${r},${c}`))
    useGameStore.getState().setTreePositions(set)
  }, [treePositions])

  if (!terrain || treePositions.length === 0) return null

  return (
    <group>
      {treePositions.map(([row, col], i) => {
        const x = (col - OFFSET_X)
        const z = (row - OFFSET_Z)
        const elevation = getElevationFromTerrain(terrain, row, col)
        const y = FLOOR_Y + elevation
        return (
          <group key={`tree-${i}`} position={[x, y, z]}>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.18, 0.24, 0.9, 6]} />
              <meshBasicMaterial color="#5d4037" />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <coneGeometry args={[0.6, 1.2, 6]} />
              <meshBasicMaterial color="#2e7d32" />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export default Trees
