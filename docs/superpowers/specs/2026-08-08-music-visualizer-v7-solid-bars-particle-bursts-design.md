# Music Visualizer V7 Solid Bars with Particle Bursts Design

## Goal

Create Music Visualizer V7 as twelve genuinely solid, separated, music-driven color bars. Resting particles disappear completely; only real musical events create a short particle breakup at an affected flat bar top, launch a restrained number of grains, and return those grains to the captured surface under gravity.

## Root Cause and Architectural Correction

V6 still renders every column body from individually feathered particle quads. Linear rank distribution makes those grains more evenly spaced, but transparent radial edges and uncovered gaps remain visible. Increasing overlap cannot guarantee a continuous solid fill and raises white-saturation and performance risks.

V7 separates the responsibilities:

- A dedicated solid-bar mesh renders the complete resting body.
- The existing particle mesh renders only transient top breakup and airborne grains.

The solid appearance must come from contiguous bar geometry, not denser particles or a particle shader approximation.

## Version Boundary

- Preserve the current V6 component and `solid-column-bursts` module as exact restoration archives before changing runtime code.
- V7 retains V6's 18-band analyser to 12-display-column resampling, column gaps, music-driven heights, event timing, 40% emission-budget mapping, captured launch surfaces, ballistic physics, audio-driven brightness, stable renderer lifecycle, pause/reduced-motion behavior, fallback behavior, and bounded normal alpha compositing.
- V7 removes all continuously visible resting particle bodies.
- V5, V4, and earlier visualizer restoration archives remain unchanged.

## Solid Bar Layer

- Render exactly twelve independently scaled vertical rectangles in one fixed instanced mesh.
- Each bar starts at the shared volume baseline and ends at its current smoothed music-driven height.
- Each bar fills its complete body with continuous color and has a perfectly flat top during ordinary playback.
- Preserve the existing visible dark separation between adjacent columns.
- Preserve the horizontal cyan-to-blue-to-violet palette by assigning each bar the same normalized column-center color coordinate used by the particle gradient.
- Bar brightness follows the same smoothed RMS-plus-local-band value as the corresponding V4/V6 resting grains.
- Use bounded opacity and `THREE.NormalBlending`; adjacent bars must not overlap across gaps.
- The fixed bar geometry, material, attributes, and mesh are created once. Each animation frame updates only twelve instance transforms and twelve brightness values.

## Particle Layer

- Do not render inactive pool particles as a resting bed. Inactive particle instances are scaled to zero and remain available for future launches.
- On a beat or band-onset event, create a short-lived particle breakup localized to the selected bar top.
- The breakup consists of two groups drawn by the existing particle pool:
  - Surface grains: a small deterministic set that stays close to the captured top, creating a momentary sparse/granular transition.
  - Airborne grains: the approved restrained spray whose integer budget remains `budget === 0 ? 0 : Math.max(1, Math.ceil(budget * 0.4))`.
- Surface-grain and airborne timing comes only from existing measured music events. No random timer, continuous boiling, or permanent top texture is allowed.
- Surface grains use fixed seeds, short lifetimes, small vertical offsets, and fade/return quickly so the underlying bar top becomes fully flat again.
- Airborne grains retain mostly vertical launch velocity, restrained horizontal drift, gravity, apex, descent, captured launch surface, V4 airborne brightness emphasis, and lifetime fade.

## Bar-Top Transition

- The solid bar remains present and stable throughout an event; it does not fade, shorten, flash, or become transparent.
- The particle breakup overlays the top edge rather than cutting holes into the bar body.
- Only the local top region gains grain texture. The bar below the surface remains a continuous solid fill.
- When the short surface-particle lifetime ends, only any still-airborne grains remain; after they return, the complete visual returns to twelve flat solid bars.

## Rendering and Stability

- Use two fixed instanced meshes in the same existing Three.js scene: one with 12 solid-bar instances and one with the existing fixed particle pool.
- Reuse the renderer, scene, camera, requestAnimationFrame loop, resize observer, visibility gating, stable fallback callback, transparent clear, and cleanup lifecycle.
- Do not allocate arrays, objects, geometries, materials, renderers, canvases, React state, or particle instances inside the animation loop.
- Solid bars use a dedicated simple shader without radial edge feather. Particle grains keep the existing radial feather, RGB/alpha lifts, alpha cap, and `THREE.NormalBlending`.
- Preserve the canvas self-check and ensure bar visibility counts as valid rendered alpha.

## Testing

Pure and source-level tests must verify:

1. Twelve bar transforms start at the baseline, use the requested live heights, stay within column-gap boundaries, and never overlap neighboring bars.
2. Strong display bands produce taller bars than weak bands through the existing bed-height mapping.
3. Bar brightness preserves the current global/local music response and upper bounds.
4. Inactive particle instances have zero rendered size rather than forming a resting bed.
5. A valid event creates a deterministic, short-lived top-surface grain group and a 40% airborne budget.
6. With no event, no surface or airborne particle becomes visible.
7. Surface grains remain near the captured bar top and expire quickly without changing bar height or opacity.
8. Airborne grains still rise, reach an apex, fall, and deactivate at the captured surface.
9. Existing resampling, event timing, brightness, shader bounds, normal blending, stable callback, pause, and lifecycle guards remain green.

## Acceptance Criteria

1. During ordinary playback, the visualization reads as twelve truly solid colored bars with no visible grains, pores, or particle texture inside their bodies.
2. Every ordinary bar top is completely flat.
3. Column heights and brightness continue to respond visibly to the live music.
4. A real musical event creates only a brief sparse particle texture above the affected bar top; the solid bar remains unchanged beneath it.
5. Only a small number of grains leave the surface, using the existing 40% restrained budget.
6. Airborne grains rise mostly vertically and visibly free-fall to their captured surfaces.
7. After the event, the surface texture disappears and the affected bar returns visually to a fully flat top.
8. No solid bar or particle region flashes white, disappears for a frame, or recreates the canvas.
9. Authenticated continuous playback produces zero blank frames, canvas replacements, or local white flashes across at least 600 frames.
10. `音乐动态显示回到 V6` restores the exact pre-V7 particle-column implementation; older restoration commands remain unchanged.

## Verification

- Run pure tests for bar geometry, gap bounds, inactive particle hiding, deterministic surface grains, surface lifetime, and restrained airborne budgets.
- Run existing spectrum, fountain physics, brightness, audio-reactivity, and visualizer regression tests.
- Run targeted ESLint and the Next.js production build.
- In an authenticated browser session, play bundled tracks and inspect at least 600 consecutive frames for solid fill, flat tops, event-only particle breakup, reduced airborne spray, captured-surface free fall, stable canvas identity, blank frames, and white saturation.
