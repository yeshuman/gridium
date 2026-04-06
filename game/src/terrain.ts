/**
 * Terrain - Shared elevation logic for TileGrid and Character.
 *
 * Both components need the same tile elevations so the character
 * sits on top of mountains when moving onto elevated tiles.
 */
export const STEP_HEIGHT = 0.3

/** Movement cost to enter a tile (keyboard one step or summed along click path). */
export const MOVE_COST_BLACK = 3
export const MOVE_COST_GRAY_OR_WATER = 2
export const MOVE_COST_DEFAULT = 1

export interface TerrainData {
  blackSet: Set<string>
  graySet: Set<string>
  darkGreenInner: Set<string>
  darkGreenOuter: Set<string>
  riverSet: Set<string>
  riverAdjacentSet: Set<string>
  lakeSet: Set<string>
  lakeAdjacentSet: Set<string>
}

export function getTileMoveCost(terrain: TerrainData | null, row: number, col: number): number {
  if (!terrain) return MOVE_COST_DEFAULT
  const key = `${row},${col}`
  if (terrain.blackSet.has(key)) return MOVE_COST_BLACK
  if (terrain.graySet.has(key)) return MOVE_COST_GRAY_OR_WATER
  if (terrain.riverSet.has(key) || terrain.lakeSet.has(key)) return MOVE_COST_GRAY_OR_WATER
  return MOVE_COST_DEFAULT
}

/** True if the cell is river or lake water (houses/trees cannot be placed here). */
export function isRiverOrLake(terrain: TerrainData | null, row: number, col: number): boolean {
  if (!terrain) return false
  const key = `${row},${col}`
  return terrain.riverSet.has(key) || terrain.lakeSet.has(key)
}

/** Eight directions (queen step: orthogonal + diagonal). */
export const QUEEN_STEP_DIRS: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
]

const ROWS_DEFAULT = 28
const COLS_DEFAULT = 20

/**
 * Land tiles next to the player where `buildHouse` would succeed (Shift+click targets).
 * Rules match the store’s build action: not while walking, not after this turn’s build, no trees/houses/AI/river/lake.
 */
export function getAdjacentHouseBuildableTiles(
  characterRow: number,
  characterCol: number,
  terrain: TerrainData | null,
  treePositions: Set<string>,
  housePositions: Set<string>,
  aiRow: number,
  aiCol: number,
  houseBuiltThisTurn: boolean,
  playerMoveQueueLength: number,
  rows: number = ROWS_DEFAULT,
  cols: number = COLS_DEFAULT
): [number, number][] {
  if (!terrain || houseBuiltThisTurn || playerMoveQueueLength > 0) return []
  const out: [number, number][] = []
  for (const [dr, dc] of QUEEN_STEP_DIRS) {
    const row = characterRow + dr
    const col = characterCol + dc
    if (row < 0 || row >= rows || col < 0 || col >= cols) continue
    const key = `${row},${col}`
    if (treePositions.has(key) || housePositions.has(key)) continue
    if (row === aiRow && col === aiCol) continue
    if (isRiverOrLake(terrain, row, col)) continue
    out.push([row, col])
  }
  return out
}

/**
 * Minimum enter-cost from (sr, sc) to every tile reachable within `budget`,
 * using queen steps (8 dirs), paying getTileMoveCost for each cell entered.
 * Start has cost 0. Blocked: trees, houses, and the AI tile (cannot stand on or pass through).
 */
export function minCostToAllReachableTiles(
  sr: number,
  sc: number,
  budget: number,
  terrain: TerrainData | null,
  treePositions: Set<string>,
  housePositions: Set<string>,
  aiRow: number,
  aiCol: number,
  rows: number = ROWS_DEFAULT,
  cols: number = COLS_DEFAULT
): Map<string, number> {
  const dist = new Map<string, number>()
  const key = (r: number, c: number) => `${r},${c}`
  dist.set(key(sr, sc), 0)
  const visited = new Set<string>()

  while (true) {
    let bestD = Infinity
    let bestKey = ''
    let bestR = 0
    let bestC = 0
    for (const [k, d] of dist) {
      if (visited.has(k)) continue
      if (d > budget) continue
      if (d < bestD) {
        bestD = d
        bestKey = k
        const parts = k.split(',').map(Number)
        bestR = parts[0]
        bestC = parts[1]
      }
    }
    if (bestKey === '' || !Number.isFinite(bestD)) break
    visited.add(bestKey)

    for (const [dr, dc] of QUEEN_STEP_DIRS) {
      const nr = bestR + dr
      const nc = bestC + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      const nk = key(nr, nc)
      if (visited.has(nk)) continue
      if (treePositions.has(nk) || housePositions.has(nk)) continue
      if (nr === aiRow && nc === aiCol) continue
      const stepCost = getTileMoveCost(terrain, nr, nc)
      const nd = bestD + stepCost
      if (nd > budget) continue
      const prev = dist.get(nk)
      if (prev === undefined || nd < prev) dist.set(nk, nd)
    }
  }

  return dist
}

/**
 * Shortest queen-walk from (sr,sc) to (er,ec) within `budget` (sum of enter costs).
 * Returns each cell visited in order, excluding the start and including the end; unreachable → null.
 */
export function queenShortestPathCells(
  sr: number,
  sc: number,
  er: number,
  ec: number,
  budget: number,
  terrain: TerrainData | null,
  treePositions: Set<string>,
  housePositions: Set<string>,
  aiRow: number,
  aiCol: number,
  rows: number = ROWS_DEFAULT,
  cols: number = COLS_DEFAULT
): [number, number][] | null {
  const key = (r: number, c: number) => `${r},${c}`
  const startKey = key(sr, sc)
  const targetKey = key(er, ec)
  if (startKey === targetKey) return []

  const dist = new Map<string, number>()
  const parent = new Map<string, string>()
  dist.set(startKey, 0)
  const visited = new Set<string>()

  while (true) {
    let bestD = Infinity
    let bestKey = ''
    let bestR = 0
    let bestC = 0
    for (const [k, d] of dist) {
      if (visited.has(k)) continue
      if (d > budget) continue
      if (d < bestD) {
        bestD = d
        bestKey = k
        const parts = k.split(',').map(Number)
        bestR = parts[0]
        bestC = parts[1]
      }
    }
    if (bestKey === '' || !Number.isFinite(bestD)) return null

    if (bestKey === targetKey) {
      const steps: [number, number][] = []
      let cur = targetKey
      while (cur !== startKey) {
        const parts = cur.split(',').map(Number)
        steps.push([parts[0], parts[1]])
        const p = parent.get(cur)
        if (p === undefined) return null
        cur = p
      }
      steps.reverse()
      return steps
    }

    visited.add(bestKey)

    for (const [dr, dc] of QUEEN_STEP_DIRS) {
      const nr = bestR + dr
      const nc = bestC + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      const nk = key(nr, nc)
      if (visited.has(nk)) continue
      if (treePositions.has(nk) || housePositions.has(nk)) continue
      if (nr === aiRow && nc === aiCol) continue
      const stepCost = getTileMoveCost(terrain, nr, nc)
      const nd = bestD + stepCost
      if (nd > budget) continue
      const prev = dist.get(nk)
      if (prev === undefined || nd < prev) {
        dist.set(nk, nd)
        parent.set(nk, bestKey)
      }
    }
  }
}

/** Cells entered moving row-first, then col (Manhattan), excluding start, including end. */
export function manhattanPathCells(sr: number, sc: number, er: number, ec: number): [number, number][] {
  const cells: [number, number][] = []
  let r = sr
  let c = sc
  while (r !== er) {
    r += er > r ? 1 : -1
    cells.push([r, c])
  }
  while (c !== ec) {
    c += ec > c ? 1 : -1
    cells.push([r, c])
  }
  return cells
}

export function getElevationFromTerrain(
  terrain: TerrainData | null,
  row: number,
  col: number
): number {
  if (!terrain) return -STEP_HEIGHT
  const key = `${row},${col}`
  if (terrain.blackSet.has(key)) return 2 * STEP_HEIGHT
  if (terrain.graySet.has(key)) return STEP_HEIGHT
  if (terrain.darkGreenInner.has(key)) return STEP_HEIGHT / 2
  if (terrain.riverSet.has(key)) return -2 * STEP_HEIGHT
  if (terrain.lakeSet.has(key)) return -2 * STEP_HEIGHT
  if (terrain.riverAdjacentSet.has(key)) return -2 * STEP_HEIGHT
  if (terrain.lakeAdjacentSet.has(key)) return -2 * STEP_HEIGHT
  if (terrain.darkGreenOuter.has(key)) return 0
  return -STEP_HEIGHT
}
