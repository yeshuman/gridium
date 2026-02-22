/**
 * 02_tile_grid.tsx - TileGrid example (8x8 for readability)
 *
 * Demonstrates the concepts from lesson 02_tile_grid.md:
 * - Instances + Instance for efficient tile rendering
 * - Per-instance color via vertexColors
 * - Chess pattern: (row + col) % 2
 * - Grid centering
 *
 * The main scene uses 64x64; this example uses 8x8 so the pattern is easy to see.
 */
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import TileGrid from '../src/components/TileGrid'

export default function TileGridExample() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <TileGrid rows={8} cols={8} />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
