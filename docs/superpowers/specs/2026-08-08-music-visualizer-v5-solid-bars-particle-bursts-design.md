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
- A valid beat or onset creates a short-lived local erosion chain at the selected captured bar top instead of overlaying a detached particle cloud. A narrow top fragment visually breaks away from the solid surface, becomes dense debris immediately above the opening, stretches into a sparse trail, and joins the airborne grains.
- The same event launches airborne grains using `budget === 0 ? 0 : Math.max(1, Math.ceil(budget * 0.4))`.
- Erosion grains use staggered birth delays and appear within `0.12-0.24s`; neighboring grains must not appear or disappear on the same frame.
- Each event selects a narrow erosion center inside the emitting column. Grains stay concentrated around that center near the surface, then acquire progressively greater vertical displacement and slight directional drift as they age.
- The solid body remains opaque. Only a small local top-edge notch may be overlaid with the card background during erosion; it must recover within `0.12s`, affect less than `28%` of the column width and `0.012` normalized height, and never flash white.
- The erosion chain remains aligned with the airborne launch origin so the eye can follow one continuous path from bar surface to flying grain.
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
3. A real event briefly creates a narrow local erosion point in the affected bar top rather than a detached cloud or whole-width dissolved edge.
4. Dense debris originates inside that erosion point, stretches into a sparse directional trail, and connects spatially to the airborne launch origin.
5. Only a small number of grains leave that trail and fly, using the approved 40% budget.
6. Airborne grains rise and free-fall back to captured surfaces.
7. After the event, every affected top returns to a completely flat solid state.
8. No bar or particle region flashes white, disappears for a frame, or recreates the canvas.
9. Authenticated playback produces zero blank frames, replacements, or local white flashes over at least 600 frames.
10. `音乐动态显示回到 V5` means this solid-bar implementation; `音乐动态显示回到 V4` remains unchanged.

## Verification

- Pure tests cover bar geometry/gaps, surface-grain timing and bounds, inactive particle hiding, and restrained airborne budgets.
- Existing spectrum, event, physics, brightness, shader-bound, stable-callback, pause, and lifecycle regressions stay green.
- Run targeted ESLint and the Next.js production build.
- Run authenticated 600-frame visual acceptance when a valid Owner session is available; otherwise report it as unverified.
