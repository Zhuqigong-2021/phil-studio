# Music Visualizer V3 Rhythm Fountain Design

## Goal

Create Music Visualizer V3 as a rhythm-driven upward particle fountain: grains break free from rigid frequency columns, launch on real musical transients, slow at the apex, and return under gravity like falling sand.

## Version Boundary

- Music Visualizer V1 remains the restoration baseline recorded in `memory.md` `D-114`.
- The current flash-free, strong peak-valley implementation becomes the immutable Music Visualizer V2 restoration baseline before V3 code begins.
- V3 changes only particle emission and motion inside the left-side volume visualizer.
- V3 must preserve V2 audio playback, analyser wiring, stable WebGL lifecycle, bounded alpha compositing, volume slider, player layout, progress position, album art, controls, track data, and Dashboard background.

## Approved Visual Direction

The Owner selected an upward fountain rather than a diagonal storm. The supplied reference defines the desired **motion quality**, not a fixed left-heavy composition:

- most grains remain concentrated near the thin baseline;
- whichever measured frequency regions are currently strong create visibly taller, irregular bursts;
- a small number of grains escape upward with open space between them;
- the composition stays delicate and compact rather than becoming a dense equalizer wall or full-width firework.

Burst location must follow live spectrum energy across the full visualizer width. Low-frequency music may burst on the left, mid-frequency accents may burst near the center, and high-frequency accents may burst on the right. V3 must not hard-code a preferred side or permanent hotspot.

## Emission Rules

V3 must never use random timers or per-frame probability to decide when particles launch.

- A primary burst occurs only on the rising edge of the existing detected low-frequency beat pulse.
- A secondary, smaller burst may occur only when a real frequency band has a meaningful positive onset relative to its recent envelope.
- RMS loudness controls how many grains may be emitted.
- Current band strength controls which horizontal regions emit and how much vertical impulse they receive.
- Quiet, steady passages generate no new visible burst. Existing airborne grains continue their physical trajectory.
- Pause and silence stop emission immediately; existing grains settle or fade without new launches.
- Deterministic seeds may vary grain size and small trajectory details, but cannot determine emission timing or musical strength.

## Particle Physics

Each active grain has independent persistent state:

- horizontal position and a small horizontal velocity;
- vertical position and upward launch velocity;
- gravity;
- age and lifetime;
- active/inactive state for pooling.

Frequency bands define spawn positions only. After launch, grains are not clipped or visually packed into their original column. Most motion remains vertical, with restrained sideways drift so particles can cross neighboring band boundaries without turning V3 into the rejected diagonal-storm direction.

Every launch follows a continuous ballistic arc: upward acceleration is never applied after the initial impulse, gravity slows the grain to an apex, and the same gravity brings it down. A grain returns to the pool only after it reaches the baseline or exceeds its bounded lifetime; it must not disappear at the apex.

## Two-Layer Rhythm Fountain

- **Continuous sand bed:** every frame maps RMS loudness and the full live spectrum into a persistent irregular bed. Its visible range targets roughly 7% at the quiet floor and up to 38% in strong regions. A nonlinear contrast curve must make strong bands stand clearly above weak neighbors without turning the bed into rigid equalizer columns.
- **Primary beat fountain:** a clearly visible group launch driven by the beat-pulse rising edge. Stronger beats produce more active grains and greater vertical velocity.
- **Secondary spectral accents:** sparse, shorter launches driven by measured positive band onsets. These keep non-bass musical accents responsive without creating autonomous continuous boiling.

The continuous bed is audio-driven on every frame; the two airborne launch layers are event-driven by measured audio. No layer may move or emit on a decorative clock. This enhancement changes only the bed-height mapping: it must not change burst detection, launch timing, particle physics, renderer lifecycle, or white-flash safeguards.

## Rendering and Stability

- Reuse the existing Three.js instanced particle mesh and bounded `THREE.NormalBlending` shader.
- Reuse particle objects through a fixed-size pool; do not allocate particles or React state inside the animation loop.
- Keep the memoized fallback callback so playback-progress rerenders never recreate the renderer.
- Preserve transparent clearing, WebGL self-check, Canvas2D fallback, reduced-motion behavior, and pause fade.
- Clamp launch velocity, horizontal drift, and lifetime to the available 78 x 70 visual region.

## Data Flow

`HTMLAudioElement` -> spectrum + RMS + beat pulse -> deterministic onset/burst events -> pooled particle activation -> independent velocity + gravity integration -> instanced mesh matrices.

The analyser decides **when and how strongly** a burst occurs. Physics decides **how each emitted grain travels and falls**.

## Testing

Pure tests must verify:

1. Steady audio does not generate autonomous burst events.
2. A beat rising edge generates one primary burst, not repeated bursts across its decay frames.
3. A positive band onset generates a smaller secondary accent.
4. Stronger measured input produces a larger emission count or launch impulse.
5. Particle vertical velocity decreases under gravity, crosses zero at the apex, and becomes negative during descent.
6. Horizontal movement can cross a source-band boundary but remains bounded.
7. Pause prevents new activation.
8. The player continues passing a stable fallback callback.

## Acceptance Criteria

1. The skyline no longer reads as particles packed into 18 rectangular cells.
2. Audible beats cause clearly timed upward sprays matching the supplied reference.
3. Airborne grains visibly rise, slow, and fall instead of stretching or disappearing.
4. Sparse secondary accents follow real musical onsets and never look like random idle motion.
5. At least some grains cross into neighboring band space while the dominant direction remains upward.
6. Burst origins move across the full width according to live band energy rather than remaining artificially concentrated on the left.
7. During continuous playback, the same WebGL canvas remains mounted with zero blank frames and zero local white flashes.
8. `回到 V2` restores the exact pre-V3 visualizer; `回到 V3` restores this fountain version only.
9. The continuous bed remains visible in quiet passages and shows substantially stronger peak-to-valley height contrast during loud, spectrally uneven passages; it must not leave a flat low strip between airborne bursts.

## Verification

- Run pure emission and physics tests using Node's test runner.
- Run targeted ESLint for all modified files.
- Run the Next.js production build.
- Play bundled tracks with clear beats and observe at least 600 consecutive frames without high-frequency screenshots.
- Instrument canvas identity, blank frames, emitted burst timing, active particle count, and representative particle ascent/descent; remove temporary diagnostics before completion.
- Capture one normal reference screenshot only after runtime verification passes.
