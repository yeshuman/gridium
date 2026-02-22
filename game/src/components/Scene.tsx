import TileGrid from './TileGrid'
import Knight from './Knight'
import { tileToPosition } from '../utils/chessGrid'

/**
 * Scene - Main 3D scene content.
 *
 * R3F maps Three.js objects to JSX:
 * - THREE.Mesh -> <mesh>
 * - THREE.BoxGeometry -> <boxGeometry>
 * - THREE.MeshStandardMaterial -> <meshStandardMaterial>
 *
 * The `args` prop passes constructor arguments as an array.
 * Geometry args: [width, height, depth] for a box.
 */
function Scene() {
  const knightPosition = tileToPosition(0, 1) // b1

  return (
    <>
      {/* ambientLight: soft, even lighting from all directions - increased for visibility */}
      <ambientLight intensity={1} />
      {/* pointLight: directional light from a point (like a lamp) */}
      <pointLight position={[10, 10, 10]} intensity={1.5} />

      {/* 8x8 chess board */}
      <TileGrid rows={8} cols={8} />

      {/* Knight on b1 */}
      <Knight position={knightPosition} />
    </>
  )
}

export default Scene
