/**
 * Knight - A procedural chess knight built from Three.js primitives.
 *
 * Structure: base (pedestal) + body (torso) + head (stylized horse head).
 * Fits within one tile (tile size = 1), height ~0.8 units.
 * Group origin is at the base so position places the piece on the floor.
 */
interface KnightProps {
  position?: [number, number, number]
}

const KNIGHT_COLOR = '#2d2d2d'

function Knight({ position = [0, -0.5, 0] }: KnightProps) {
  return (
    <group position={position}>
      {/* Base: short wide cylinder (pedestal) - sits on floor */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.22, 0.24, 0.06, 16]} />
        <meshBasicMaterial color={KNIGHT_COLOR} />
      </mesh>
      {/* Body: taller cylinder (torso) */}
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 0.2, 16]} />
        <meshBasicMaterial color={KNIGHT_COLOR} />
      </mesh>
      {/* Head: sphere for stylized horse head */}
      <mesh position={[0.08, 0.37, 0.05]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial color={KNIGHT_COLOR} />
      </mesh>
      {/* Neck: small cylinder connecting body to head */}
      <mesh position={[0.05, 0.3, 0.02]}>
        <cylinderGeometry args={[0.04, 0.06, 0.12, 8]} />
        <meshBasicMaterial color={KNIGHT_COLOR} />
      </mesh>
    </group>
  )
}

export default Knight
