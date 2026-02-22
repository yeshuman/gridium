# Lesson 02: Tile Grid - InstancedMesh for Performance

This lesson covers building a floor from many tiles using **InstancedMesh**. You'll learn why instancing matters for large grids and how Drei's `Instances` + `Instance` make it declarative.

## Mesh Recap

A **mesh** = geometry (shape) + material (appearance). A tile is a flat plane mesh with a color.

## The Problem: Many Tiles

A 64x64 tile grid = 4096 tiles. If each tile were its own `<mesh>`:

- 4096 draw calls per frame
- 4096 React components
- Poor performance, especially on lower-end devices

## The Solution: InstancedMesh

**InstancedMesh** renders many copies of the same geometry/material in a **single draw call**. The GPU draws one geometry repeatedly, with per-instance data (position, rotation, color) stored in buffers.

| Approach | Draw calls (64x64) | Performance |
|----------|--------------------|-------------|
| Individual meshes | 4096 | Poor |
| InstancedMesh | 1 | Good |

## Drei's Instances + Instance

`@react-three/drei` provides a declarative API:

- **Instances**: Wraps an `InstancedMesh`. Children include shared geometry, material, and `Instance` components.
- **Instance**: One "copy" in the grid. Props: `position`, `rotation`, `color`, etc.

```tsx
import { Instances, Instance } from '@react-three/drei'

<Instances limit={64 * 64}>
  <planeGeometry args={[1, 1]} />
  <meshStandardMaterial vertexColors />
  {tiles.map((tile) => (
    <Instance key={tile.id} position={tile.position} color={tile.color} />
  ))}
</Instances>
```

## Per-Instance Color: vertexColors

For each instance to have its own color, the material must use `vertexColors`:

```tsx
<meshStandardMaterial vertexColors />
```

Without this, all instances would use the material's default color. With it, the `color` prop on each `<Instance>` is read from the `instanceColor` buffer.

## Chess Pattern

Alternating light/dark tiles: `(row + col) % 2` gives 0 or 1:

```tsx
const isLight = (row + col) % 2 === 0
const color = isLight ? lightColor : darkColor
```

## Grid Positioning: Centering

To center the grid around the origin:

```tsx
const offsetX = (cols - 1) / 2
const offsetZ = (rows - 1) / 2
// Position for tile at (row, col):
position={[col - offsetX, 0, row - offsetZ]}
```

For 64 cols: offset = 31.5, so x ranges from -31.5 to 32.5.

## Tile vs Grid (Clarification)

- **Tile**: A discrete mesh (one plane with a color). In our case, each `<Instance>` represents one tile.
- **Grid**: The 2D arrangement (rows x cols). The grid is the layout; tiles are the objects.
- **Drei Grid**: A different thing entirely - it's a line-drawing helper, not tiles. Don't confuse it with a tile grid.

## Example

See [examples/02_tile_grid.tsx](../examples/02_tile_grid.tsx) for a standalone TileGrid example (8x8 for readability).

The main scene uses `TileGrid` at 64x64 - see `src/components/TileGrid.tsx` and `src/components/Scene.tsx`.

## References

- [Drei Instances](https://drei.docs.pmnd.rs/performances/instances)
- [Three.js InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh)
