import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, calcPosFromAngles } from '@react-three/drei'
import Scene from './components/Scene'
import { useGameStore, MOVES_PER_TURN } from './store/gameStore'

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

function TurnHud() {
  const movesRemaining = useGameStore((s) => s.movesRemaining)
  const houseBuiltThisTurn = useGameStore((s) => s.houseBuiltThisTurn)
  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: 16,
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.55)',
        color: '#fff',
        borderRadius: 8,
        fontFamily: 'system-ui, sans-serif',
        fontSize: 15,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <div>
        Moves left this turn:{' '}
        <strong>
          {movesRemaining} / {MOVES_PER_TURN}
        </strong>
      </div>
      <div style={{ marginTop: 6, fontSize: 13, opacity: 0.9 }}>
        Click a highlighted tile to move — Enter ends turn
      </div>
      <div style={{ marginTop: 6, fontSize: 13, opacity: 0.9 }}>
        Hold <strong>Shift</strong> for gold dots (build sites); Shift+click to build (once per turn:{' '}
        {houseBuiltThisTurn ? 'used' : 'available'})
      </div>
    </div>
  )
}

/**
 * App - Root component wrapping the R3F Canvas.
 */
function App() {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <TurnHud />
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
