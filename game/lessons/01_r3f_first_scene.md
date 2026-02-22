# Lesson 01: React Three Fiber - Your First Scene

This lesson introduces React Three Fiber (R3F), a React renderer for Three.js. You'll learn how to render a 3D scene using familiar React patterns.

## What is React Three Fiber?

R3F lets you build Three.js scenes using JSX. Instead of imperative Three.js code, you declare your scene as a tree of components. R3F handles:

- Creating the Scene, Camera, and WebGL renderer
- The render loop (runs every frame)
- Resizing when the window changes
- Pointer events (clicks, hover) via raycasting

## The Canvas Component

The `<Canvas>` component from `@react-three/fiber` is your entry point. It:

1. Creates a Three.js `Scene` and `PerspectiveCamera`
2. Sets up the WebGL renderer
3. Runs `requestAnimationFrame` in a loop
4. Renders whatever you put inside it

```tsx
import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <Canvas>
      {/* 3D content goes here */}
    </Canvas>
  )
}
```

**Important:** The Canvas fills its parent element. Give the parent explicit dimensions (e.g. `height: 100vh`) or the canvas may have zero size.

## JSX to Three.js Mapping

R3F maps Three.js classes to JSX elements. Use camelCase:

| Three.js | R3F JSX |
|----------|---------|
| `THREE.Mesh` | `<mesh>` |
| `THREE.BoxGeometry` | `<boxGeometry>` |
| `THREE.MeshStandardMaterial` | `<meshStandardMaterial>` |
| `THREE.AmbientLight` | `<ambientLight>` |
| `THREE.PointLight` | `<pointLight>` |

## Constructor Arguments: The `args` Prop

Three.js constructors often take parameters. In R3F, pass them via the `args` prop as an array:

```tsx
// BoxGeometry(width, height, depth)
<boxGeometry args={[1, 1, 1]} />

// SphereGeometry(radius, widthSegments, heightSegments)
<sphereGeometry args={[1, 32, 32]} />
```

## Basic Lighting

Three.js materials need light to be visible. A common setup:

- **ambientLight**: Soft, even light from all directions. Prevents pure black shadows.
- **pointLight**: Light from a point in space (like a lamp). Creates shading and depth.

```tsx
<ambientLight intensity={0.5} />
<pointLight position={[10, 10, 10]} intensity={1} />
```

## Minimal Complete Example

See [examples/01_basic_cube.tsx](../examples/01_basic_cube.tsx) for a runnable minimal scene:

```tsx
<Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
  <ambientLight intensity={0.5} />
  <pointLight position={[10, 10, 10]} intensity={1} />
  <mesh position={[0, 0, 0]}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="orange" />
  </mesh>
</Canvas>
```

## The Game Loop: useFrame

For animations and game logic that runs every frame, use the `useFrame` hook:

```tsx
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}
```

`delta` is the time in seconds since the last frame. Multiplying by `delta` keeps animation speed consistent regardless of frame rate.

## Game State: Zustand

For global game state (score, game over, etc.), we use [Zustand](https://github.com/pmndrs/zustand). It works well with R3F because:

- No provider needed
- Can be used inside `useFrame` (outside React's normal render cycle)
- Lightweight and simple

See `src/store/gameStore.ts` for the game store definition.

## Next Steps

- Add `OrbitControls` from `@react-three/drei` for camera control (drag to rotate, scroll to zoom)
- Load 3D models (GLTF) with `useGLTF`
- Add physics with `@react-three/rapier`
- Build a simple game loop with score and game states

## References

- [R3F Documentation](https://r3f.docs.pmnd.rs/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Drei Helpers](https://github.com/pmndrs/drei)
