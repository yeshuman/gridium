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
    <div
      style={{
        width: '100%',
        height: '100vh',
        /* radial-gradient: same hues, darker and more saturated */
        background:
          'radial-gradient(ellipse 80% 80% at 50% 20%, #1e9a96 0%, #b83d6b 40%, #c0902a 70%, #b54d2e 100%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
        {/* OrbitControls: drag to rotate, scroll to zoom (from @react-three/drei) */}
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default App
