import { useMemo } from 'react'
import * as THREE from 'three'
import { Instances, Instance } from '@react-three/drei'

/**
 * TileGrid - A floor made of tiles arranged in a grid (chess-board pattern).
 *
 * Uses InstancedMesh via Drei's Instances + Instance:
 * - One draw call for all tiles (4096 for 64x64) instead of 4096 draw calls
 * - Each Instance gets its own position and color
 * - vertexColors on the material enables per-instance color (required)
 *
 * Chess pattern: (row + col) % 2 alternates between 0 and 1 for light/dark.
 */
interface TileGridProps {
  rows?: number
  cols?: number
  tileSize?: number
  lightColor?: string
  darkColor?: string
  position?: [number, number, number]
}

function TileGrid({
  rows = 64,
  cols = 64,
  tileSize = 1,
  lightColor = '#f0d9b5',
  darkColor = '#b58863',
  position = [0, -0.5, 0],
}: TileGridProps) {
  const count = rows * cols

  // Instance expects THREE.Color objects; strings can break toArray(). Reuse 2 objects.
  const light = useMemo(() => new THREE.Color(lightColor), [lightColor])
  const dark = useMemo(() => new THREE.Color(darkColor), [darkColor])

  // Center the grid: offset so the grid is symmetric around the origin
  const offsetX = (cols - 1) / 2
  const offsetZ = (rows - 1) / 2

  return (
    <Instances limit={count} position={position}>
      {/* Shared geometry: one plane per tile */}
      <planeGeometry args={[tileSize, tileSize]} />
      {/* vertexColors + color="white": base color white so instance colors show correctly */}
      <meshStandardMaterial vertexColors color="white" />
      {/* Map over grid: each Instance is one tile with position, rotation, color */}
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const isLight = (row + col) % 2 === 0
          return (
            <Instance
              key={`${row}-${col}`}
              position={[col - offsetX, 0, row - offsetZ]}
              rotation={[-Math.PI / 2, 0, 0]}
              color={isLight ? light : dark}
            />
          )
        })
      )}
    </Instances>
  )
}

export default TileGrid
