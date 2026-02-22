import { calcPosFromAngles } from '@react-three/drei'
import TileGrid from './TileGrid'
import Character from './Character'
import Trees from './Trees'

const sunDir = calcPosFromAngles(0.5, 0.1)
const sunPos: [number, number, number] = [sunDir.x * 500, sunDir.y * 500, sunDir.z * 500]

/**
 * Scene - Main 3D scene content.
 */
function Scene() {
  return (
    <>
      {/* ambientLight: soft fill, yellow */}
      <ambientLight intensity={0.5} color="#ffcc00" />
      {/* directionalLight: yellow sun light from sky sun position */}
      <directionalLight position={sunPos} intensity={1.2} color="#ffcc00" castShadow />

      {/* Floor: 28x20 tile grid */}
      <TileGrid rows={28} cols={20} />
      {/* Randomly placed trees on land tiles */}
      <Trees />
      {/* Queen-like character - move with WASD, arrows, or Q/E/Z/C for diagonals */}
      <Character />
    </>
  )
}

export default Scene
