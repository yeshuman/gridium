/**
 * Knight - A procedural chess knight built from Three.js primitives.
 *
 * Structure: base (pedestal) + body (torso) + head (stylized horse head).
 * Fits within one tile (tile size = 1), height ~0.8 units.
 * Group origin is at the base so position places the piece on the floor.
 */
interface KnightProps {
  position?: [number, number, number]
  color?: 'white' | 'black'
}

const KNIGHT_COLORS = {
  white: '#f0f0f0',
  black: '#2d2d2d',
} as const

function Knight({ position = [0, -0.5, 0], color = 'black' }: KnightProps) {
  const pieceColor = KNIGHT_COLORS[color]

  return (
    <group position={position}>
      {/* Base: short wide cylinder (pedestal) - sits on floor */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.22, 0.24, 0.06, 16]} />
        <meshBasicMaterial color={pieceColor} />
      </mesh>
      {/* Body: taller cylinder (torso) */}
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 0.2, 16]} />
        <meshBasicMaterial color={pieceColor} />
      </mesh>
      {/* Head: sphere for stylized horse head */}
      <mesh position={[0.08, 0.37, 0.05]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial color={pieceColor} />
      </mesh>
      {/* Neck: small cylinder connecting body to head */}
      <mesh position={[0.05, 0.3, 0.02]}>
        <cylinderGeometry args={[0.04, 0.06, 0.12, 8]} />
        <meshBasicMaterial color={pieceColor} />
      </mesh>
    </group>
  )
}

export default Knight
