# Music Visualizer V6 Solid Columns with Sparse Bursts Design

## Goal

Create Music Visualizer V6 as twelve separated music-driven columns whose complete resting bodies read as dense, nearly solid particle color. Only a real musical burst temporarily loosens the top of the affected column, emits a restrained number of grains, and lets those grains rise and free-fall back to the captured surface.

## Version Boundary

- Preserve the current V5 implementation as an exact restoration snapshot before changing runtime code.
- Music Visualizer V4 archives remain unchanged and continue to restore the pre-column brightness version.
- V6 retains V5's 18-band analyser to 12-display-column resampling, separated column geometry, music-driven heights, captured launch surfaces, V4 brightness response, shader lifts, radial feather, normal blending, fixed particle pool, renderer lifecycle, pause behavior, reduced-motion behavior, and fallback behavior.
- V6 changes only resting vertical coverage, transient top loosening, and emission quantity.

## Resting Column Body

- Each of the twelve columns is filled with particles from the common baseline to its current music-driven surface.
- Particle coverage stays optically dense across the full column height, including the upper body. The resting state must no longer show a permanent bottom-dense-to-top-sparse gradient.
- The result should read as a nearly solid colored column built from overlapping grains, not as a separate CSS rectangle or opaque shader block.
- Preserve the visible dark separation between adjacent columns.
- Preserve slightly irregular particle-defined column tops so the result does not look like a perfectly clipped geometric rectangle.

## Event-Driven Top Loosening

- A column top becomes sparse only when the existing beat or band-onset detector triggers emission from that column.
- The transient loose region occupies the upper 18% of the live column height.
- Loosening is local to affected columns and follows the same measured music event that causes the launch. No random timer, autonomous boiling, or continuous decorative thinning is allowed.
- The loose head appears as grains being pulled out of the surface rather than the whole column fading or collapsing.
- After the event, the top coverage recovers quickly and smoothly as the transient decays; the dense lower 80% to 85% remains visually stable throughout.

## Restrained Spray and Free Fall

- Map V5's integer emission budget to `budget === 0 ? 0 : Math.max(1, Math.ceil(budget * 0.4))`.
- Launches originate from the affected column's current surface and retain the per-particle captured launch height introduced in V5.
- Motion remains primarily vertical with restrained horizontal drift.
- Existing gravity slows each grain to an apex and returns it to the captured surface, where it re-enters the fixed pool.
- Returning grains do not need to be individually inserted into a visible hole; the transient head-density envelope restores the surface continuously.

## Audio and Brightness Behavior

- Twelve column heights continue to follow the overlap-resampled live spectrum and RMS loudness.
- Existing beat rising edges and band-onset rising edges remain the only emission triggers.
- Preserve V4 music-driven resting and airborne brightness, 15% to 20% airborne emphasis, lifetime fade, `1.25` RGB lift, `1.10` alpha lift, `0.62` alpha cap, and individual radial edge feather.
- Dense full-height columns must continue using bounded alpha and `THREE.NormalBlending` so overlap cannot accumulate into white flashes.

## Rendering and State

- Continue using one instanced mesh and fixed typed-array particle state.
- Add only fixed per-column transient head-loosening state; allocate it once during effect setup.
- Do not allocate arrays, particle objects, materials, geometry, renderers, canvases, or React state inside the animation loop.
- A burst raises the affected column's loosening envelope; an attack/release calculation decays it smoothly back to zero.
- Resting particle visibility or vertical placement inside the upper 18% uses the envelope and fixed particle seeds, making the head porous during the event without frame-to-frame randomness.

## Testing

Pure and source-level tests must verify:

1. Resting rank mapping distributes particle ranks throughout the full column height without the V5 bottom-heavy `rank ** 2.5` profile.
2. With zero loosening, upper-column coverage remains dense.
3. A measured burst makes only the upper 18% progressively sparse and leaves the lower body unchanged.
4. The loosening envelope decays monotonically back to the dense state.
5. A V5 emission budget maps through `budget === 0 ? 0 : Math.max(1, Math.ceil(budget * 0.4))`.
6. Launch height remains the current captured column surface and ballistic particles still rise, reach an apex, fall, and deactivate at that surface.
7. Existing resampling, column gaps, music height, brightness, shader bounds, normal blending, stable callback, pause, and event-timing tests remain green.

## Acceptance Criteria

1. During ordinary playback, every visible column reads as dense color from baseline to current top rather than a permanent sand gradient.
2. The twelve column separations remain immediately visible.
3. A real beat or onset temporarily creates a porous grain-defined head only on affected columns.
4. Roughly 40% of V5's former spray quantity leaves the surface, making individual trajectories easier to read.
5. Emitted grains rise mostly vertically and visibly free-fall to their captured surfaces.
6. The dense column body does not pulse transparent, disappear, or flash white during a burst.
7. After the burst, the column head returns smoothly to its full dense appearance.
8. Authenticated continuous playback keeps the same canvas mounted with zero blank frames, replacements, or local white flashes for at least 600 frames.
9. `音乐动态显示回到 V5` restores the exact pre-V6 twelve-column layered implementation; `音乐动态显示回到 V4` continues to restore the exact V4 archive.

## Verification

- Run pure tests for full-height density, transient head loosening, envelope decay, and the 40% emission budget.
- Run existing resampling, fountain physics, brightness, audio reactivity, and visualizer source guards.
- Run targeted ESLint and the Next.js production build.
- In an authenticated browser session, play bundled tracks and inspect at least 600 consecutive frames for full-height dense bodies, music-triggered sparse heads, reduced spray count, captured-surface free fall, stable canvas identity, blank frames, and white saturation.
