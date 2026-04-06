import { calcPosFromAngles } from '@react-three/drei'
import TileGrid from './TileGrid'
import Character from './Character'
import AiCharacter from './AiCharacter'
import Trees from './Trees'
import Houses from './Houses'
import MoveRangeDots from './MoveRangeDots'

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
      <MoveRangeDots />
      {/* Randomly placed trees on land tiles */}
      <Trees />
      <Houses />
      {/* Queen-like piece - click tiles (white dots); Enter ends turn in Character */}
      <Character />
      <AiCharacter />
    </>
  )
}

export default Scene
