# Music Visualizer V5 Layered Particle Columns Design

## Goal

Create Music Visualizer V5 as twelve clearly separated music-driven particle columns. Each column transitions vertically from an optically solid pile at the bottom, through a porous granular middle, into sparse visible grains at the top; real musical events launch grains vertically from the live column surface and gravity returns them to that surface.

## Version Boundary

- Music Visualizer V4 remains the exact restoration baseline in `src/components/dashboard/EnergySandVolume.v4.jsx.b64` and `src/lib/dashboard/particle-brightness.v4.ts.b64`.
- The component archive decodes to SHA-256 `ADE1B4E77B797BBD9213D8121646DAB7A36D8BCF3488CE4E0FB0440464B766EB`.
- The brightness archive decodes to SHA-256 `996C38DCBD775B0BC87F7B3E9B79D3CE10F18BD833E1A3F97CEC876CFC3EB751`.
- V5 changes the resting spatial distribution, displayed column count, and launch surface. It preserves analyser data, event timing, gravity-based flight, V4 music brightness, V4-B global lift, per-grain feathering, normal blending, stable renderer lifecycle, player layout, and volume/progress controls.

## Twelve-Column Display Mapping

- Keep the analyser's existing 18 frequency bands unchanged.
- Resample all 18 bands into 12 display columns with deterministic overlap-weighted averaging so no source frequency range is discarded.
- The resampling function must also support an 18-column identity mode. If the Owner later requests option C, only the display-column count changes; emission physics and rendering architecture remain the same.
- Twelve columns span the visual width with approximately one physical pixel of visible dark separation at the current 78px width.
- Resting particles stay inside their home column and do not blur across the dark separation gaps.

## Vertical Density Profile

Each column uses the same fixed particle pool and deterministic rank values, but maps rank to height through a nonlinear density profile:

- **Bottom approximately 35% of column height:** many overlapping grains with strong coverage; individual gaps are visually negligible, so the pile reads as an optically solid color made from particles rather than a separate rectangle.
- **Middle approximately 40%:** coverage decreases progressively; holes and individual grains become visible.
- **Top approximately 25%:** only sparse, irregular grains remain, avoiding a flat rectangular cap.

The transition must be continuous, not three hard horizontal bands. Column height follows the resampled live spectrum and RMS envelope. Strong frequency regions produce taller columns; weak regions remain shorter while retaining the dense-to-sparse profile inside their available height.

## Column Shape and Color

- Every column has a clear vertical body and an irregular particle-defined top.
- Horizontal jitter is bounded within the column body so gaps remain visible.
- Preserve the cyan-to-blue-to-violet horizontal palette and V4 audio-driven brightness.
- Preserve the `1.25` RGB lift, `1.10` alpha lift, `0.62` alpha cap, and individual radial edge feather.
- The visual change from solid-looking bottom to sparse top is produced by particle coverage and alpha density, not a non-particle CSS or shader rectangle.

## Surface Launch and Free Fall

- Beat and band-onset detection remain unchanged and continue to determine when emission occurs.
- A launch originates from the current top surface of its source display column rather than from the global baseline.
- Capture the launch surface height in fixed per-particle state. Airborne vertical motion is relative to that captured surface, preventing later spectrum changes from teleporting the particle.
- Most launch velocity is vertical. Existing restrained horizontal drift remains, allowing airborne grains to cross neighboring column space after launch.
- Gravity slows the grain to an apex and returns it toward its captured column surface. The grain returns to the pool when it reaches that surface while descending, not after falling through the dense column to the global baseline.
- Launch timing must remain audio-event-driven; no random launch timer or decorative continuous boiling is allowed.

## Rendering and Stability

- Continue using one fixed instanced particle mesh and typed-array particle state.
- Do not allocate particle objects, arrays, React state, materials, geometry, renderers, or canvases in the animation loop.
- Keep transparent clearing, memoized fallback callback, Canvas2D fallback, reduced-motion behavior, and `THREE.NormalBlending`.
- Preserve final-alpha bounds and self-check logic so dense bottom overlap cannot reintroduce local white flashes.

## Testing

Pure tests must verify:

1. Eighteen source bands resample deterministically into exactly twelve display values without dropping edge bands.
2. Eighteen-column identity mode returns the original spectrum values.
3. The density profile is monotonic and places substantially more particle ranks in the lower 35% than the upper 25%.
4. Horizontal resting positions remain inside the column gap boundaries.
5. Strong display bands produce taller column targets than weak display bands.
6. Launch height equals the current source-column surface at the event frame.
7. Airborne motion rises, reaches an apex, falls, and deactivates at the captured surface.
8. Existing brightness, V4-B lift, feather, event timing, pause, stable callback, and normal-blending tests remain green.

## Acceptance Criteria

1. The visualizer reads immediately as twelve separate vertical columns rather than one continuous triangular particle bed.
2. Each column appears dense and nearly solid at the bottom, progressively porous in the middle, and visibly granular at the top.
3. Column heights remain clearly different and respond to the music's live spectrum and overall intensity.
4. Real beats and onsets launch grains vertically from the appropriate column tops across the full width.
5. Emitted grains visibly rise, slow, and free-fall back to their captured launch surfaces.
6. V4 brightness response and soft particle edges remain visible without saturated-white accumulation.
7. During authenticated continuous playback, the same canvas remains mounted with zero blank frames, replacements, or local white flashes across at least 600 frames.
8. `回到 V4` restores the exact pre-V5 appearance. Switching V5 from A to C changes only `12` display columns to `18`.

## Verification

- Run pure spectrum-resampling, density-profile, launch-surface, brightness, physics, and source-guard tests.
- Run targeted ESLint and the Next.js production build.
- In an authenticated browser session, play bundled tracks and observe at least 600 frames for column separation, density transition, column-top launches, free fall, canvas identity, blank frames, and white saturation.

