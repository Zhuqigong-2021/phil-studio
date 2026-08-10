# Music Visualizer V5 Solid Bars with Particle Bursts Design

## Goal

Music Visualizer V5 consists of twenty-four genuinely solid, separated, music-driven color bars. No resting particles appear inside the bars. Only measured musical events create a brief local erosion chain at the affected flat bar tops and launch a restrained number of grains that free-fall back to their captured surfaces.

## Canonical Version Boundary

- V4 remains the exact pre-column restoration baseline in its existing committed archives.
- This solid-bar implementation is the only V5 definition.
- The former layered-particle V5 and all V6/V7 experiment names, archives, specifications, plans, and restoration semantics are removed from the current project state.
- V5 smoothly maps the analyser's eighteen bands into twenty-four fixed display bars, while retaining music-driven height and brightness, existing beat/onset timing, the 40% airborne budget, captured launch surfaces, ballistic physics, radial-feathered event particles, stable renderer lifecycle, pause/reduced-motion behavior, and bounded normal compositing.

## Solid Bar Layer

- Render exactly twenty-four independently scaled rectangles in one fixed instanced mesh.
- Resample the eighteen analyser and onset bands into the existing twenty-four-element buffers without per-frame allocation; preserve both spectrum edges and local peaks.
- Every bar begins at the shared volume baseline and ends at its smoothed live music height.
- During ordinary playback the complete body is contiguous pure color with a perfectly flat top and no particle texture.
- Preserve dark gaps and the cyan-to-blue-to-violet horizontal palette.
- Keep every bar vertically uniform and fully opaque. Apply a bounded `1.18` RGB presentation lift to the whole bar while retaining the existing music-driven brightness range, normal blending, and cyan-to-violet horizontal palette.
- Bar brightness follows the existing smoothed RMS-plus-local-band brightness.
- Bar height uses a detrended spectrum instead of per-band adaptive normalization or frame-wide min/max normalization. Log-compress each real band, subtract a five-band broad trend, preserve peaks during 18-to-24 mapping, then compute the residual RMS and maximum excursion. When real variance exists, normalize the signed local contour into a bounded visible amplitude with a quiet-section floor; use loudness for the overall baseline and additional contour range. Gate the expansion to zero for genuinely flat input. No autonomous drift, random height, or fabricated variation is allowed.
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
- Before grains detach, the local top performs a short `0.06-0.09s` upward bounce. Debris initially shares that lift as one attached cluster, then releases in deterministic stages; early grains receive the strongest vertical impulse and later grains form the short connecting trail.
- Each event exposes `10-14` tightly grouped top fragments for roughly `0.07s`. About `70%` remain low debris that completes a small ballistic hop and returns visually to the captured top; about `30%` become the existing restrained primary airborne grains.
- Every primary airborne grain renders `2-4` subordinate trail grains reconstructed from that primary grain's current position and velocity. Trail grains shrink and darken with lag, never choose their own source, never trigger independently, and disappear immediately with their parent.
- V5 water-droplet motion divides each `10-14` fragment cluster into approximately `60%` low arcs, `30%` medium arcs, and `10%` high primary droplets. The cluster first elongates upward from one local bulge, then separates over `0.04-0.08s`; horizontal spread increases only after release. Primary trajectories use light air drag for rounded ascent/descent, and trail lags grow non-linearly so the tail reads as a continuous stretched droplet rather than equally spaced dots.
- Airborne grains retain mostly vertical velocity, restrained horizontal drift, apex, gravity, descent, captured surface, music brightness emphasis, and lifetime fade.
- No random timer, continuous boiling, permanent head texture, or whole-bar transparency pulse is allowed.

## Rendering and Stability

- Use two fixed instanced meshes in one existing scene: twenty-four solid bars below the fixed event-particle pool.
- Bars render first; feathered particles render above them.
- Reuse the existing renderer, camera, animation loop, resize/visibility gates, transparent clear, canvas self-check, stable fallback, and cleanup.
- Allocate no arrays, objects, meshes, geometry, materials, renderer, canvas, or React state inside the animation loop.
- Both layers use `THREE.NormalBlending`; bars never overlap across gaps, preventing white accumulation.

## Acceptance Criteria

1. Ordinary playback shows twenty-four truly solid colored bars with completely flat tops and no visible internal grains or pores.
2. Heights and brightness remain visibly music-driven.
3. A bass-heavy spectrum with real local detail must retain multiple visible peaks and valleys instead of becoming a low-frequency plateau followed by a smooth descending slope; overall loudness still raises and lowers the field.
4. Every bar has vertically uniform color, is visibly brighter overall, and retains music-driven brightness without white clipping.
4. A real event briefly creates a narrow local erosion point and a visible `0.06-0.09s` attached upward bounce at the affected bar top.
5. Dense debris rises with that bounce before releasing in stages, stretching into a sparse directional trail connected to the airborne launch origin.
6. Each event reads as a `10-14` grain local cluster: most grains perform a low hop while about `30%` become the approved restrained airborne particles.
7. Every primary airborne particle carries `2-4` progressively smaller and darker trail grains aligned to its trajectory.
8. The visible cluster separates into low, medium, and high water-drop arcs near a `60/30/10` distribution, with rounded motion and non-uniform tail spacing.
8. Airborne grains rise and free-fall back to captured surfaces.
9. After the event, every affected top returns to a completely flat solid state.
10. No bar or particle region flashes white, disappears for a frame, or recreates the canvas.
11. Authenticated playback produces zero blank frames, replacements, or local white flashes over at least 600 frames.
12. `音乐动态显示回到 V5` means this solid-bar implementation; `音乐动态显示回到 V4` remains unchanged.

## Verification

- Pure tests cover bar geometry/gaps, surface-grain timing and bounds, inactive particle hiding, and restrained airborne budgets.
- Existing spectrum, event, physics, brightness, shader-bound, stable-callback, pause, and lifecycle regressions stay green.
- Run targeted ESLint and the Next.js production build.
- Run authenticated 600-frame visual acceptance when a valid Owner session is available; otherwise report it as unverified.
