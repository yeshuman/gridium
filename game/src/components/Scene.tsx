import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

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
  // useRef gives us a mutable reference to the mesh for useFrame
  const meshRef = useRef<Mesh>(null)

  // useFrame runs every frame (game loop) - perfect for animations
  // state: R3F state, delta: time since last frame
  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <>
      {/* ambientLight: soft, even lighting from all directions */}
      <ambientLight intensity={0.5} />
      {/* pointLight: directional light from a point (like a lamp) */}
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Rotating cube - ref used by useFrame for animation */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        {/* args={[1, 1, 1]} = BoxGeometry(1, 1, 1) - unit cube */}
        <boxGeometry args={[1, 1, 1]} />
        {/* meshStandardMaterial: PBR material that responds to lights */}
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* Second cube - static, for visual variety */}
      <mesh position={[2, 0, -1]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </>
  )
}

export default Scene
