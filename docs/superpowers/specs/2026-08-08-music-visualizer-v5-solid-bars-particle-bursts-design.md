# Music Visualizer V5 Solid Bars with Particle Bursts Design

## Goal

Music Visualizer V5 consists of twelve genuinely solid, separated, music-driven color bars. No resting particles appear inside the bars. Only measured musical events create a brief sparse particle texture at the affected flat bar tops and launch a restrained number of grains that free-fall back to their captured surfaces.

## Canonical Version Boundary

- V4 remains the exact pre-column restoration baseline in its existing committed archives.
- This solid-bar implementation is the only V5 definition.
- The former layered-particle V5 and all V6/V7 experiment names, archives, specifications, plans, and restoration semantics are removed from the current project state.
- V5 retains 18-to-12 spectrum resampling, music-driven height and brightness, existing beat/onset timing, the 40% airborne budget, captured launch surfaces, ballistic physics, radial-feathered event particles, stable renderer lifecycle, pause/reduced-motion behavior, and bounded normal compositing.

## Solid Bar Layer

- Render exactly twelve independently scaled rectangles in one fixed instanced mesh.
- Every bar begins at the shared volume baseline and ends at its smoothed live music height.
- During ordinary playback the complete body is contiguous pure color with a perfectly flat top and no particle texture.
- Preserve dark gaps and the cyan-to-blue-to-violet horizontal palette.
- Bar brightness follows the existing smoothed RMS-plus-local-band brightness.
- The bar shader has no radial feather or holes. Normal playback reaches alpha `1.0`; pause/play presence may smoothly fade the whole visualization.
- Bar geometry, material, attributes, and mesh are created once; each frame updates only twelve transforms and brightness values.

## Event Particle Layer

- The existing fixed pool renders no inactive/resting grains; inactive instances have zero scale.
- A valid beat or onset first creates a short-lived dense transition cluster attached to the selected captured bar top. This cluster visually bridges the solid rectangle and the sparse airborne grains instead of letting isolated particles appear from empty space.
- The same event launches airborne grains using `budget === 0 ? 0 : Math.max(1, Math.ceil(budget * 0.4))`.
- Transition-cluster grains appear and disappear within `0.10-0.18s`. They are densest within the first short band above the flat top, then taper upward in count and opacity so only a few grains visually continue into flight.
- The cluster remains locally aligned to the emitting column, never fills the whole visualizer, and never changes the bar height or opacity.
- Airborne grains retain mostly vertical velocity, restrained horizontal drift, apex, gravity, descent, captured surface, music brightness emphasis, and lifetime fade.
- No random timer, continuous boiling, permanent head texture, or whole-bar transparency pulse is allowed.

## Rendering and Stability

- Use two fixed instanced meshes in one existing scene: twelve solid bars below the fixed event-particle pool.
- Bars render first; feathered particles render above them.
- Reuse the existing renderer, camera, animation loop, resize/visibility gates, transparent clear, canvas self-check, stable fallback, and cleanup.
- Allocate no arrays, objects, meshes, geometry, materials, renderer, canvas, or React state inside the animation loop.
- Both layers use `THREE.NormalBlending`; bars never overlap across gaps, preventing white accumulation.

## Acceptance Criteria

1. Ordinary playback shows twelve truly solid colored bars with completely flat tops and no visible internal grains or pores.
2. Heights and brightness remain visibly music-driven.
3. A real event briefly forms a visibly denser particle cluster directly at the affected bar top, tapering from dense near the surface to sparse above it while the solid bar remains unchanged.
4. Only a small number of grains leave that cluster and fly, using the approved 40% budget, so the motion reads continuously as solid bar to dense breakup to sparse spray to free fall.
5. Airborne grains rise and free-fall back to captured surfaces.
6. After the event, every affected top returns to a completely flat solid state.
7. No bar or particle region flashes white, disappears for a frame, or recreates the canvas.
8. Authenticated playback produces zero blank frames, replacements, or local white flashes over at least 600 frames.
9. `音乐动态显示回到 V5` means this solid-bar implementation; `音乐动态显示回到 V4` remains unchanged.

## Verification

- Pure tests cover bar geometry/gaps, surface-grain timing and bounds, inactive particle hiding, and restrained airborne budgets.
- Existing spectrum, event, physics, brightness, shader-bound, stable-callback, pause, and lifecycle regressions stay green.
- Run targeted ESLint and the Next.js production build.
- Run authenticated 600-frame visual acceptance when a valid Owner session is available; otherwise report it as unverified.
