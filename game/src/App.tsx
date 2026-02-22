import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, calcPosFromAngles } from '@react-three/drei'
import Scene from './components/Scene'

const sunDir = calcPosFromAngles(0.5, 0.1)
const sunPos: [number, number, number] = [sunDir.x * 800, sunDir.y * 800, sunDir.z * 800]

function Sun() {
  return (
    <mesh position={sunPos}>
      <sphereGeometry args={[25, 32, 32]} />
      <meshBasicMaterial color="#ffd700" />
    </mesh>
  )
}

/**
 * App - Root component wrapping the R3F Canvas.
 */
function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#87CEEB']} />
        <Sky
          sunPosition={[sunDir.x, sunDir.y, sunDir.z]}
          turbidity={5}
          rayleigh={0.2}
          mieCoefficient={0.00005}
        />
        <Sun />
        <Scene />
        {/* OrbitControls: drag to rotate, scroll to zoom (from @react-three/drei) */}
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default App
