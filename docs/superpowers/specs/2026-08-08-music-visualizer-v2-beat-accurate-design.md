# Music Visualizer V2 Beat-Accurate Design

## Goal

Create Music Visualizer V2 so the particle field rises and falls primarily from real playback loudness and low-frequency beats instead of runtime randomness.

## Version Boundary

- Music Visualizer V1 remains the restorable baseline recorded in `memory.md` `D-114`.
- V2 changes only the audio-analysis signals and the particle motion mapping used by the visualizer above the left-side volume slider.
- V2 must not change the Dashboard background, player layout, progress position, album art, volume-slider behavior, transport controls, track data, or audio playback routing.

## Root Cause

The analyser already provides live spectrum data, but the renderer obscures it with independent motion sources:

- random fixed gain for every frequency column;
- density targets that randomly change every 2.5 seconds;
- per-frame probabilistic particle launches;
- wide random launch response, gravity, and wobble ranges;
- a second slow envelope after analyser ballistics;
- pointer hover and drag boosts unrelated to playback.

These mechanisms make particle timing and height only loosely correlated with the music.

## Audio Analysis

`useAudioAnalyser` will continue producing the existing band spectrum and coarse bass/mid/treble/energy refs. It will additionally expose:

- `loudnessRef`: normalized time-domain RMS calculated from `AnalyserNode.getByteTimeDomainData`; this represents audible signal magnitude more directly than averaging the entire FFT.
- `beatPulseRef`: a short, decaying low-frequency transient pulse. It compares the fast bass envelope with a slower adaptive bass baseline and emits only when the positive difference crosses a minimum threshold.

The beat pulse must use a short refractory period so one drum hit cannot emit several consecutive beats. It decays every animation frame and returns to zero when paused.

## Particle Mapping

The particle simulation will become deterministic with respect to live audio:

- RMS loudness defines the available vertical energy range but must not add one dominant shared height to every column.
- Each frame normalizes the real spectrum relative to that frame's minimum and maximum band values. Each column's resting height is primarily determined by its normalized band shape.
- A beat is consumed only on its rising edge and applies one synchronized velocity impulse. The impulse magnitude varies deterministically by real band strength and fixed particle seed, so timing is shared but peak heights are not.
- Particles retain vertical velocity and fall under deterministic gravity after the beat. This creates natural arcs instead of directly stretching every column into a rectangular wall.
- Runtime density retargeting, random column gain, probabilistic launch timing, and pointer activity boosts are removed.
- Fixed per-particle seeds may remain for horizontal placement, size, and subtle spatial texture. They must not determine whether or when a beat response occurs.
- Paused playback fades the field out and does not generate hidden random motion.
- Reduced-motion behavior remains supported.

### Strong Peak-Valley Amendment

The approved V2 direction is **B: strong peak-valley enhancement**. It keeps the measured spectrum as the source of truth while deliberately expanding its visible contrast:

- Map normalized band strength through a nonlinear contrast curve so weak bands remain close to the baseline and strong bands rise prominently.
- Do not give every column a large shared minimum height. Loudness scales the available height range instead of filling all columns equally.
- Apply beat lift primarily to currently strong bands; weak bands receive little or no lift. A beat must not raise the entire field into a flat wall.
- Preserve continuous values rather than quantizing columns into decorative steps. The skyline remains music-driven, not a preset equalizer pattern.
- Clamp final base height and beat impulse to the visualizer's available vertical range so extreme input cannot leave the particle region.

### Controlled Particle Compositing

The existing additive blend mode allows many overlapping bright particles to accumulate to pure white during a beat. V2 will replace additive accumulation with controlled alpha compositing:

- Use normal transparent blending for the particle mesh.
- Cap fragment alpha and RGB intensity so overlap increases density without producing a white frame.
- Keep the existing cyan-to-purple palette and localized endpoint glow; the fix must not reduce the entire visualizer to a dim gray field.
- Keep the canvas transparent and preserve the existing WebGL self-check and Canvas2D fallback.

## Data Flow

`HTMLAudioElement` -> `AnalyserNode` -> spectrum + RMS + bass transient -> refs -> relative spectrum shape + beat rising edge -> deterministic base heights and particle velocity impulses -> gravity -> Three.js instance matrices.

No React state is added to the per-frame path, so playback visualization does not cause component rerenders.

## Failure Handling

- Existing Web Audio failure behavior remains: refs stay at zero and the visual layer remains calm.
- Existing WebGL self-check and Canvas2D fallback remain unchanged.
- No diagnostic output may log audio content or sensitive data.

## Testability

Extract the signal math that converts raw loudness, bass, baseline, and elapsed time into smoothed loudness and beat pulse into a small pure TypeScript module. Test it with deterministic numeric sequences before wiring it into the browser hook.

Required automated cases:

1. A quiet steady sequence does not emit a beat.
2. A sudden bass rise emits one positive beat pulse.
3. Sustained bass does not repeatedly retrigger during the refractory window.
4. A larger RMS input produces a larger smoothed loudness value.
5. Pause/reset returns beat and loudness output toward zero.
6. A non-uniform spectrum produces a meaningful column-height spread; the shared loudness contribution cannot collapse it into a flat wall.
7. Weak bands remain close to the baseline while strong bands occupy a substantially larger portion of the available height.
8. Beat impulses retain strong inter-column contrast rather than lifting all columns uniformly.

## Acceptance Criteria

1. During silence or a quiet passage, the particle field stays low without independent random jumps.
2. As playback loudness increases, the field's overall height increases predictably.
3. Each clearly audible low-frequency beat produces one short synchronized particle peak, and stopping playback removes further motion after the existing fade.
4. At normal playback, the visible particle skyline contains clear high and low regions rather than a nearly rectangular top edge.
5. The strongest and weakest visible columns have an unmistakable height difference during ordinary playback, including on dense tracks.
6. Repeated beat peaks do not produce a full-region white flash or a large saturated-white particle cluster.

## Verification

- Run the pure signal-mapping test suite through Node's built-in test runner.
- Run targeted ESLint for all modified files.
- Run the Next.js production build.
- Play a bundled track in `/darktheme`, observe the live analyser refs through temporary browser-only instrumentation, and confirm particle height peaks align with detected beat pulses. Remove diagnostic instrumentation before completion.
- Capture multiple consecutive playback frames and check the particle-region pixels for saturated-white accumulation while also confirming a visibly alternating skyline.
