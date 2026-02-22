import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Scene from './components/Scene'

/**
 * App - Root component wrapping the R3F Canvas.
 *
 * Canvas from @react-three/fiber:
 * - Creates a Three.js Scene and PerspectiveCamera automatically
 * - Runs the render loop (requestAnimationFrame)
 * - Handles window resize
 * - Sets up pointer events for raycasting (clicks, hover)
 *
 * The Canvas fills its parent; we use index.css to make #root 100vh.
 */
function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true }}
      >
        {/* Background color - light gray to verify rendering */}
        <color attach="background" args={['#e0e0e0']} />
        <Scene />
        {/* OrbitControls: drag to rotate, scroll to zoom (from @react-three/drei) */}
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default App
