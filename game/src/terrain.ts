/**
 * Terrain - Shared elevation logic for TileGrid and Character.
 *
 * Both components need the same tile elevations so the character
 * sits on top of mountains when moving onto elevated tiles.
 */
export const STEP_HEIGHT = 0.3

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
