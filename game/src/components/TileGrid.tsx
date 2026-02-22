import { useMemo, useEffect, type ReactNode } from 'react'
import { useGameStore } from '../store/gameStore'
import * as THREE from 'three'
import { Edges } from '@react-three/drei'

/**
 * TileGrid - A floor made of tiles arranged in a grid.
 *
 * River and lake spawn first, then mountains spawn far from both.
 */
interface TileGridProps {
  rows?: number
  cols?: number
  tileSize?: number
  position?: [number, number, number]
}

const MIN_GAP = 8
const RIVER_MOUNTAIN_GAP = 5 // Min gap between mountains and river

function manhattanDist([r1, c1]: [number, number], [r2, c2]: [number, number]): number {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2)
}

function addSegmentTiles(
  tiles: [number, number][],
  [r1, c1]: [number, number],
  [r2, c2]: [number, number]
): void {
  if (r1 === r2) {
    for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) tiles.push([r1, c])
  } else {
    for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) tiles.push([r, c1])
  }
}

function pickRandomRiverTiles(rows: number, cols: number): [number, number][] {
  const riverTiles: [number, number][] = []
  const numRivers = 1
  const used = new Set<string>()

  for (let i = 0; i < numRivers; i++) {
    const horizontal = Math.random() < 0.5
    const segment: [number, number][] = []
    const numBends = 2 + Math.floor(Math.random() * 3) // 2 to 4 bends

    if (horizontal) {
      // Winding left-to-right: alternate horizontal and vertical segments
      const waypoints: [number, number][] = []
      let r = 2 + Math.floor(Math.random() * (rows - 4))
      waypoints.push([r, 0])
      const colSteps = Math.max(2, Math.floor((cols - 2) / (numBends + 1)))
      for (let b = 0; b < numBends; b++) {
        const c = Math.min(cols - 1, (b + 1) * colSteps + Math.floor(Math.random() * 2))
        waypoints.push([r, c])
        const dr = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 2))
        r = Math.max(1, Math.min(rows - 2, r + dr))
        waypoints.push([r, c])
      }
      waypoints.push([r, cols - 1])
      for (let w = 0; w < waypoints.length - 1; w++) {
        addSegmentTiles(segment, waypoints[w], waypoints[w + 1])
      }
    } else {
      // Winding top-to-bottom: alternate vertical and horizontal segments
      const waypoints: [number, number][] = []
      let c = 2 + Math.floor(Math.random() * (cols - 4))
      waypoints.push([0, c])
      const rowSteps = Math.max(2, Math.floor((rows - 2) / (numBends + 1)))
      for (let b = 0; b < numBends; b++) {
        const r = Math.min(rows - 1, (b + 1) * rowSteps + Math.floor(Math.random() * 2))
        waypoints.push([r, c])
        const dc = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 2))
        c = Math.max(1, Math.min(cols - 2, c + dc))
        waypoints.push([r, c])
      }
      waypoints.push([rows - 1, c])
      for (let w = 0; w < waypoints.length - 1; w++) {
        addSegmentTiles(segment, waypoints[w], waypoints[w + 1])
      }
    }
    for (const t of segment) {
      const key = `${t[0]},${t[1]}`
      if (!used.has(key)) {
        riverTiles.push(t)
        used.add(key)
      }
    }
  }
  return riverTiles
}

function pickRandomLakeTiles(rows: number, cols: number, riverTiles: [number, number][]): [number, number][] {
  const riverSet = new Set(riverTiles.map(([r, c]) => `${r},${c}`))
  const targetSize = 10 + Math.floor(Math.random() * 6) // 10–15 tiles, irregular
  const centerR = 2 + Math.floor(Math.random() * (rows - 4))
  const centerC = 2 + Math.floor(Math.random() * (cols - 4))
  const lakeTiles: [number, number][] = [[centerR, centerC]]
  const inLake = new Set<string>([`${centerR},${centerC}`])
  let frontier: [number, number][] = [...getAdjacent(centerR, centerC, rows, cols)]
  while (lakeTiles.length < targetSize && frontier.length > 0) {
    const idx = Math.floor(Math.random() * frontier.length)
    const [r, c] = frontier[idx]
    frontier.splice(idx, 1)
    const key = `${r},${c}`
    if (inLake.has(key) || riverSet.has(key)) continue
    inLake.add(key)
    lakeTiles.push([r, c])
    for (const [nr, nc] of getAdjacent(r, c, rows, cols)) {
      if (!inLake.has(`${nr},${nc}`) && !frontier.some(([fr, fc]) => fr === nr && fc === nc)) {
        frontier.push([nr, nc])
      }
    }
  }
  return lakeTiles
}

function pickRandomBlackTiles(
  rows: number,
  cols: number,
  riverTiles: [number, number][],
  lakeTiles: [number, number][]
): [number, number][] {
  const numClusters = 5 + Math.floor(Math.random() * 2) // 5 to 6 clusters
  const allTiles: [number, number][] = []
  let clustersAdded = 0
  let attempts = 0
  const maxAttempts = numClusters * 100
  const maxTiles = 16
  while (clustersAdded < numClusters && allTiles.length < maxTiles && attempts < maxAttempts) {
    attempts++
    const remaining = maxTiles - allTiles.length
    const clusterSize = Math.min(2 + Math.floor(Math.random() * 3), remaining) // 2 to 4 per cluster, cap at remaining
    const r = Math.floor(Math.random() * rows)
    const c = Math.floor(Math.random() * cols)
    const cluster: [number, number][] = [[r, c]]
    const adj = getAdjacent(r, c, rows, cols)
    for (let i = 0; i < clusterSize - 1 && adj.length > 0; i++) {
      const idx = Math.floor(Math.random() * adj.length)
      const [ar, ac] = adj[idx]
      adj.splice(idx, 1)
      cluster.push([ar, ac])
    }
    const tooCloseToOther = allTiles.some((t) =>
      cluster.some((ct) => manhattanDist(t, ct) <= MIN_GAP)
    )
    const overlapsRiver = cluster.some(([cr, cc]) =>
      riverTiles.some(([rr, rc]) => cr === rr && cc === rc)
    )
    const overlapsLake = cluster.some(([cr, cc]) =>
      lakeTiles.some(([lr, lc]) => cr === lr && cc === lc)
    )
    const tooCloseToRiver = cluster.some(([cr, cc]) =>
      riverTiles.some(([rr, rc]) => manhattanDist([cr, cc], [rr, rc]) < RIVER_MOUNTAIN_GAP)
    )
    const tooCloseToLake = cluster.some(([cr, cc]) =>
      lakeTiles.some(([lr, lc]) => manhattanDist([cr, cc], [lr, lc]) < RIVER_MOUNTAIN_GAP)
    )
    if (!tooCloseToOther && !overlapsRiver && !overlapsLake && !tooCloseToRiver && !tooCloseToLake) {
      allTiles.push(...cluster)
      clustersAdded++
    }
  }
  return allTiles
}

function getAdjacent(row: number, col: number, rows: number, cols: number): [number, number][] {
  const adj: [number, number][] = []
  if (row > 0) adj.push([row - 1, col])
  if (row < rows - 1) adj.push([row + 1, col])
  if (col > 0) adj.push([row, col - 1])
  if (col < cols - 1) adj.push([row, col + 1])
  return adj
}

function TileGrid({
  rows = 28,
  cols = 20,
  tileSize = 1,
  position = [0, -0.5, 0],
}: TileGridProps) {
  const offsetX = (cols - 1) / 2
  const offsetZ = (rows - 1) / 2
  const { setCharacterPosition, treePositions } = useGameStore()

  const { blackSet, graySet, darkGreenInner, darkGreenOuter, riverSet, riverAdjacentSet, lakeSet, lakeAdjacentSet } = useMemo(() => {
    const riverTiles = pickRandomRiverTiles(rows, cols)
    const lakeTiles = pickRandomLakeTiles(rows, cols, riverTiles)
    const blackTiles = pickRandomBlackTiles(rows, cols, riverTiles, lakeTiles)
    const black = new Set(blackTiles.map(([r, c]) => `${r},${c}`))
    const gray = new Set<string>()
    for (const [r, c] of blackTiles) {
      for (const [ar, ac] of getAdjacent(r, c, rows, cols)) {
        if (!black.has(`${ar},${ac}`)) gray.add(`${ar},${ac}`)
      }
    }
    const darkGreenInner = new Set<string>()
    for (const key of gray) {
      const [r, c] = key.split(',').map(Number)
      for (const [ar, ac] of getAdjacent(r, c, rows, cols)) {
        const k = `${ar},${ac}`
        if (!black.has(k) && !gray.has(k)) darkGreenInner.add(k)
      }
    }
    const darkGreenOuter = new Set<string>()
    for (const key of darkGreenInner) {
      const [r, c] = key.split(',').map(Number)
      for (const [ar, ac] of getAdjacent(r, c, rows, cols)) {
        const k = `${ar},${ac}`
        if (!black.has(k) && !gray.has(k) && !darkGreenInner.has(k)) darkGreenOuter.add(k)
      }
    }
    const river = new Set(riverTiles.map(([r, c]) => `${r},${c}`))
    const lake = new Set(lakeTiles.map(([r, c]) => `${r},${c}`))
    const riverAdjacent = new Set<string>()
    for (const [r, c] of riverTiles) {
      for (const [ar, ac] of getAdjacent(r, c, rows, cols)) {
        if (!river.has(`${ar},${ac}`) && !lake.has(`${ar},${ac}`)) riverAdjacent.add(`${ar},${ac}`)
      }
    }
    const lakeAdjacent = new Set<string>()
    for (const [r, c] of lakeTiles) {
      for (const [ar, ac] of getAdjacent(r, c, rows, cols)) {
        if (!river.has(`${ar},${ac}`) && !lake.has(`${ar},${ac}`)) lakeAdjacent.add(`${ar},${ac}`)
      }
    }
    return { blackSet: black, graySet: gray, darkGreenInner, darkGreenOuter, riverSet: river, riverAdjacentSet: riverAdjacent, lakeSet: lake, lakeAdjacentSet: lakeAdjacent }
  }, [rows, cols])

  // Share terrain with Character so it can sit on top of mountains
  useEffect(() => {
    useGameStore.getState().setTerrain({ blackSet, graySet, darkGreenInner, darkGreenOuter, riverSet, riverAdjacentSet, lakeSet, lakeAdjacentSet })
  }, [blackSet, graySet, darkGreenInner, darkGreenOuter, riverSet, riverAdjacentSet, lakeSet, lakeAdjacentSet])

  const STEP_HEIGHT = 0.3

  const getTileInfo = (row: number, col: number) => {
    const key = `${row},${col}`
    if (blackSet.has(key)) return { color: '#1a1a1a', elevation: 2 * STEP_HEIGHT }
    if (graySet.has(key)) return { color: '#4a4a4a', elevation: STEP_HEIGHT }
    if (darkGreenInner.has(key)) return { color: '#1a5c1a', elevation: STEP_HEIGHT / 2 }
    if (riverSet.has(key)) return { color: '#3498db', elevation: -2 * STEP_HEIGHT }
    if (lakeSet.has(key)) return { color: '#2980b9', elevation: -2 * STEP_HEIGHT }
    if (riverAdjacentSet.has(key)) return { color: '#256325', elevation: -2 * STEP_HEIGHT }
    if (lakeAdjacentSet.has(key)) return { color: '#256325', elevation: -2 * STEP_HEIGHT }
    if (darkGreenOuter.has(key)) return { color: '#2d7a2d', elevation: 0 }
    return { color: '#2d8a2d', elevation: -STEP_HEIGHT }
  }

  const getElevation = (row: number, col: number) => getTileInfo(row, col).elevation

  return (
    <group position={position}>
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const { color, elevation } = getTileInfo(row, col)
          const x = col - offsetX
          const z = row - offsetZ
          const walls: ReactNode[] = []
          // Vertical walls to fill gaps where neighbor is lower
          if (row > 0) {
            const neighborE = getElevation(row - 1, col)
            if (neighborE < elevation) {
              const h = elevation - neighborE
              walls.push(
                <mesh key="w-z" position={[x, (elevation + neighborE) / 2, z - 0.5]}>
                  <planeGeometry args={[tileSize, h]} />
                  <meshBasicMaterial color={color} side={THREE.DoubleSide} />
                </mesh>
              )
            }
          }
          if (row < rows - 1) {
            const neighborE = getElevation(row + 1, col)
            if (neighborE < elevation) {
              const h = elevation - neighborE
              walls.push(
                <mesh key="w+z" position={[x, (elevation + neighborE) / 2, z + 0.5]} rotation={[0, 0, 0]}>
                  <planeGeometry args={[tileSize, h]} />
                  <meshBasicMaterial color={color} side={THREE.DoubleSide} />
                </mesh>
              )
            }
          }
          if (col > 0) {
            const neighborE = getElevation(row, col - 1)
            if (neighborE < elevation) {
              const h = elevation - neighborE
              walls.push(
                <mesh key="w-x" position={[x - 0.5, (elevation + neighborE) / 2, z]} rotation={[0, Math.PI / 2, 0]}>
                  <planeGeometry args={[tileSize, h]} />
                  <meshBasicMaterial color={color} side={THREE.DoubleSide} />
                </mesh>
              )
            }
          }
          if (col < cols - 1) {
            const neighborE = getElevation(row, col + 1)
            if (neighborE < elevation) {
              const h = elevation - neighborE
              walls.push(
                <mesh key="w+x" position={[x + 0.5, (elevation + neighborE) / 2, z]} rotation={[0, -Math.PI / 2, 0]}>
                  <planeGeometry args={[tileSize, h]} />
                  <meshBasicMaterial color={color} side={THREE.DoubleSide} />
                </mesh>
              )
            }
          }
          // Perimeter walls to close gaps at grid borders
          const groundLevel = -2 * STEP_HEIGHT // Lowest level (river valley)
          const perimeterH = elevation - groundLevel
          const perimeterY = (elevation + groundLevel) / 2
          if (perimeterH > 0 && row === 0) {
            walls.push(
              <mesh key="perim-z" position={[x, perimeterY, z - 0.5]}>
                <planeGeometry args={[tileSize, perimeterH]} />
                <meshBasicMaterial color={color} side={THREE.DoubleSide} />
              </mesh>
            )
          }
          if (perimeterH > 0 && row === rows - 1) {
            walls.push(
              <mesh key="perim+z" position={[x, perimeterY, z + 0.5]}>
                <planeGeometry args={[tileSize, perimeterH]} />
                <meshBasicMaterial color={color} side={THREE.DoubleSide} />
              </mesh>
            )
          }
          if (perimeterH > 0 && col === 0) {
            walls.push(
              <mesh key="perim-x" position={[x - 0.5, perimeterY, z]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[tileSize, perimeterH]} />
                <meshBasicMaterial color={color} side={THREE.DoubleSide} />
              </mesh>
            )
          }
          if (perimeterH > 0 && col === cols - 1) {
            walls.push(
              <mesh key="perim+x" position={[x + 0.5, perimeterY, z]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[tileSize, perimeterH]} />
                <meshBasicMaterial color={color} side={THREE.DoubleSide} />
              </mesh>
            )
          }
          const handleClick = () => {
            const key = `${row},${col}`
            if (treePositions.has(key)) return
            setCharacterPosition(row, col)
          }
          return (
            <group key={`${row}-${col}`}>
              <mesh
                position={[x, elevation, z]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={(e) => {
                  e.stopPropagation()
                  handleClick()
                }}
                onPointerOver={() => { document.body.style.cursor = 'pointer' }}
                onPointerOut={() => { document.body.style.cursor = 'default' }}
              >
                <planeGeometry args={[tileSize, tileSize]} />
                <meshBasicMaterial color={color} side={THREE.DoubleSide} />
                <Edges color="#000000" lineWidth={3} />
              </mesh>
              {walls}
            </group>
          )
        })
      )}
    </group>
  )
}

export default TileGrid
