/**
 * chessGrid - Utilities for mapping chess board tiles to 3D world positions.
 *
 * TileGrid centers the grid around the origin. For an 8x8 board:
 * - offsetX = offsetZ = 3.5
 * - Tile (row, col) center: (col - offsetX, 0, row - offsetZ)
 * - Piece sits ON the tile: y = -0.5 (TileGrid position, floor surface)
 *
 * Chess notation: a1 = bottom-left. (row=0, col=0) = a1.
 */

/**
 * Converts a tile (row, col) to world position [x, y, z].
 * y = -0.5 so the piece base sits on the floor surface (TileGrid position).
 */
export function tileToPosition(
  row: number,
  col: number,
  rows = 8,
  cols = 8
): [number, number, number] {
  const offsetX = (cols - 1) / 2
  const offsetZ = (rows - 1) / 2
  return [col - offsetX, -0.5, row - offsetZ]
}
