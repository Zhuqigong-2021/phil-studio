# Music Visualizer V4 Audio Brightness Design

## Goal

Create Music Visualizer V4 by making particle brightness follow both overall musical intensity and local spectral strength while preserving V3's continuous sand bed, rhythm fountain, particle physics, and flash-free renderer lifecycle.

## Version Boundary

- Music Visualizer V3 remains the restoration baseline in the byte-exact component archive `src/components/dashboard/EnergySandVolume.v3.jsx.b64` and the readable physics snapshot `src/lib/dashboard/fountain-physics.v3.ts`. The component archive decodes to SHA-256 `461B283637ABD08A98065E6E2CFA3F37CDCC76803380F7B233800555FADBE3B0`; the physics snapshot exactly matches the pre-V4 source SHA-256 `87AAD413AEE0BB9BF5EF098F38D77B08CE6D2A98D344A2F3863BBE0D888A0E1D`.
- V4 changes only particle brightness data and shader opacity/color intensity.
- V4 must not change V3 bed heights, beat/onset detection, emission count, launch velocity, gravity, trajectory, particle positions, player layout, volume control, or progress control.
- V2 and V1 snapshots remain unchanged.

## Approved Brightness Model

The Owner selected a combined global-and-local model:

1. Smoothed RMS loudness controls the entire field's brightness range.
2. Each of the 18 live spectrum bands controls the relative brightness of grains associated with that horizontal region.
3. Airborne grains capture the source band's energy and beat/onset strength at launch so their brightness follows the musical event that created them instead of flickering with unrelated later frames.
4. Airborne brightness decays gradually with particle age and altitude; it must not switch abruptly at the apex.
5. Airborne grains receive a restrained brightness emphasis relative to resting grains under the same musical input: approximately 15% for ordinary launches and up to 20% for strong beat launches, without exceeding the shared 85% brightness ceiling.

## Brightness Range and Smoothing

- Quiet playing content retains approximately 18% visible brightness so the sand bed never vanishes.
- Strong measured content may reach approximately 85% brightness.
- Local band energy modulates within the global range: strong bands are visibly brighter than weak neighbors, even when their grain heights overlap.
- Brightness uses a fast attack and slower release envelope to follow musical accents without frame-to-frame flashing.
- Pause continues using the existing field-presence fade; the new brightness mapping does not override pause behavior.

## Rendering Safety

- Keep `THREE.NormalBlending`; do not restore additive blending.
- Keep fragment alpha bounded below full opacity so overlapping particles cannot accumulate into white rectangles.
- Pass brightness through a per-instance attribute or an equivalent fixed typed-array channel. Do not allocate particle objects or React state inside the animation loop.
- Do not recreate the renderer, material, geometry, canvas, or fallback callback when brightness changes.
- Keep the existing transparent clear color and WebGL fallback.

## Data Flow

`RMS loudness + 18 spectrum bands + beat/onset event` -> smoothed global brightness + smoothed local band brightness -> per-grain brightness value -> bounded fragment color/alpha.

Resting grains read the current smoothed global and local brightness. Airborne grains use captured launch brightness multiplied by a smooth lifetime fade.

## Testing

Pure tests must verify:

1. Strong RMS produces higher global brightness than weak RMS.
2. A strong band produces brighter local grains than a weak neighboring band.
3. Quiet playback remains visible at the 18% floor.
4. Brightness never exceeds the 85% target before shader falloff and remains bounded below full-opacity white saturation.
5. A launched particle retains its captured event brightness when later spectrum frames change.
6. Airborne brightness decays smoothly with age instead of switching at the apex.
7. Existing V3 rhythm, bed-height, pause, trajectory, stable-callback, and normal-blending tests remain green.

## Acceptance Criteria

1. The particle field clearly becomes brighter during stronger musical passages and dimmer during weaker passages.
2. Strong frequency regions are brighter than weak regions across the width instead of every grain sharing one brightness.
3. Beat-driven sprays inherit the intensity of the event that launched them and fade naturally during flight.
4. The continuous bed remains visible in quiet passages without looking uniformly bright.
5. No new local white flash, full-screen flash, canvas replacement, or blank particle frame is introduced.
6. `回到 V3` restores the preserved pre-V4 continuous-bed rhythm-fountain state only.

## Verification

- Run pure brightness and existing visualizer tests.
- Run targeted ESLint and the Next.js production build.
- In an authenticated browser session, play bundled tracks and observe at least 600 consecutive frames for canvas identity, blank frames, local white saturation, and visible weak/strong brightness transitions.
