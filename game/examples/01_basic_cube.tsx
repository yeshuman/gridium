/**
 * 01_basic_cube.tsx - Minimal R3F scene example
 *
 * This example demonstrates the core concepts from lesson 01_r3f_first_scene.md.
 * Use this as a standalone reference or copy into your Scene component.
 *
 * Key concepts:
 * - Canvas creates Scene + Camera + render loop
 * - JSX maps to Three.js objects (mesh, boxGeometry, meshStandardMaterial)
 * - args prop for constructor arguments
 * - Lighting: ambientLight + pointLight
 */
import { Canvas } from '@react-three/fiber'

function BasicCube() {
  return (
    <mesh position={[0, 0, 0]}>
      {/* BoxGeometry args: [width, height, depth] */}
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

export default function BasicCubeExample() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <BasicCube />
      </Canvas>
    </div>
  )
}
