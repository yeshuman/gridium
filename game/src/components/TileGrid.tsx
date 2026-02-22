import * as THREE from 'three'

/**
 * TileGrid - A floor made of tiles arranged in a grid (chess-board pattern).
 *
 * Each tile is an individual mesh with explicit color for reliable rendering.
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
  rows = 16,
  cols = 16,
  tileSize = 1,
  lightColor = '#ffffff', // White (high contrast light square)
  darkColor = '#1a1a1a',  // Dark gray/black (high contrast dark square)
  position = [0, -0.5, 0],
}: TileGridProps) {
  // Center the grid: offset so the grid is symmetric around the origin
  const offsetX = (cols - 1) / 2
  const offsetZ = (rows - 1) / 2

  return (
    <group position={position}>
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const isLight = (row + col) % 2 === 0
          return (
            <mesh
              key={`${row}-${col}`}
              position={[col - offsetX, 0, row - offsetZ]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[tileSize, tileSize]} />
              <meshBasicMaterial
                color={isLight ? lightColor : darkColor}
                side={THREE.DoubleSide}
              />
            </mesh>
          )
        })
      )}
    </group>
  )
}

export default TileGrid
