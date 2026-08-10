# Music Visualizer V2 Beat-Accurate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the volume-area particle visualizer rise predictably with real loudness and produce one synchronized peak for each detected low-frequency beat.

**Architecture:** Put deterministic loudness smoothing, bass-transient detection, and relative spectrum target calculation in a small pure TypeScript module. In the renderer, consume only the beat pulse's rising edge, apply deterministic per-particle velocity impulses weighted by real band shape, and let gravity create varied arcs above spectrum-driven resting heights.

**Approved amendment:** Expand measured spectral differences with a strong nonlinear peak-valley curve, and replace additive particle accumulation with bounded normal alpha compositing so overlapping grains cannot saturate the visualizer region to white.

**Tech Stack:** Next.js 16.2.10, React 19.2.4, TypeScript, Web Audio API, Three.js 0.185.1, Node 22 built-in test runner.

## Global Constraints

- Preserve Music Visualizer V1 as recorded in `memory.md` `D-114`.
- Do not modify Dashboard backgrounds, player layout, playback progress, album art, volume-slider behavior, transport controls, track metadata, or audio routing.
- Runtime randomness must not determine beat timing or field height.
- Existing WebGL fallback, pause fade, and reduced-motion support remain intact.
- Preserve unrelated changes in the dirty working tree and do not commit without explicit user direction.

---

### Task 1: Deterministic audio-reactivity math

**Files:**
- Create: `src/lib/dashboard/audio-reactivity.ts`
- Create: `src/lib/dashboard/audio-reactivity.test.ts`

**Interfaces:**
- Consumes: `rawRms`, `rawBass`, `dtMs`, and `playing`
- Produces: `createAudioReactivityState()` and `stepAudioReactivity(state, input)` returning `loudness`, `fastBass`, `slowBass`, `beatPulse`, and `cooldownMs`

- [ ] **Step 1: Write five failing behavior tests**

Use `node:test` and `node:assert/strict` with literal input sequences to verify: quiet stability, one pulse on sudden bass rise, no retrigger during cooldown, monotonic loudness response, and decay/reset while paused.

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
node --experimental-strip-types --test src/lib/dashboard/audio-reactivity.test.ts
```

Expected: FAIL because `audio-reactivity.ts` does not exist.

- [ ] **Step 3: Implement the smallest signal model**

Use time-normalized exponential followers:

```ts
alpha = 1 - Math.exp(-ratePerSecond * dtMs / 1000)
```

Normalize RMS into `0..1`, use faster attack than release, track a fast and slow bass envelope, emit a beat when their positive difference exceeds the threshold and cooldown is zero, then decay the pulse and cooldown over time.

- [ ] **Step 4: Run the test and verify GREEN**

Run the same Node command and require all five tests to pass.

### Task 2: Expose live loudness and beat refs

**Files:**
- Modify: `src/hooks/useAudioAnalyser.ts`

**Interfaces:**
- Consumes: `stepAudioReactivity`, FFT bass level, and RMS from `getByteTimeDomainData`
- Produces: existing refs plus `loudnessRef` and `beatPulseRef`

- [ ] **Step 1: Add time-domain sampling and state wiring**

Allocate one time-domain byte buffer beside the FFT buffer. On each analyser frame, calculate RMS from centered samples, step the pure signal model with measured frame delta, and copy the returned loudness and beat pulse into refs.

- [ ] **Step 2: Preserve pause and failure behavior**

On pause, drive the signal model with `playing: false` until values settle. If Web Audio is unavailable, both new refs stay at zero.

- [ ] **Step 3: Run targeted lint and signal tests**

```powershell
node --experimental-strip-types --test src/lib/dashboard/audio-reactivity.test.ts
npx eslint src/lib/dashboard/audio-reactivity.ts src/lib/dashboard/audio-reactivity.test.ts src/hooks/useAudioAnalyser.ts
```

Expected: tests pass and ESLint exits 0.

### Task 3: Replace the flat shared-height mapping with spectrum-shaped particle physics

**Files:**
- Modify: `src/components/dashboard/EnergySandVolume.jsx`
- Modify: `src/app/darktheme/page.tsx`

**Interfaces:**
- Consumes: `bandsRef`, `loudnessRef`, `beatPulseRef`, and `isPlayingRef`
- Produces: spectrum-shaped resting heights plus beat-edge velocity impulses and deterministic gravity

- [ ] **Step 1: Pass the two new refs into `EnergySandVolume`**

Extend `MusicPlayerPanel` props and the `EnergySandVolume` invocation without changing any other player structure.

- [ ] **Step 2: Remove runtime-random drive sources**

Remove random column gain, density retargeting, probabilistic launch checks, hover/drag boosts, and physics variables that existed only for random launches. Keep fixed seeds only for particle X position, size, and subtle static texture.

- [ ] **Step 3: Map signals to deterministic particle targets**

For each frame, normalize the real spectrum to a relative shape and calculate resting heights whose spread is dominated by that shape. On a beat-pulse rising edge, apply one velocity impulse to particles; scale it by real band shape and fixed seed, then integrate deterministic gravity until each particle returns to its column's resting height.

- [ ] **Step 4: Run targeted checks**

```powershell
node --experimental-strip-types --test src/lib/dashboard/audio-reactivity.test.ts
npx eslint src/lib/dashboard/audio-reactivity.ts src/lib/dashboard/audio-reactivity.test.ts src/hooks/useAudioAnalyser.ts src/components/dashboard/EnergySandVolume.jsx src/app/darktheme/page.tsx
```

Expected: signal tests pass and targeted ESLint has no errors.

### Task 4: Browser and production verification

**Files:**
- Modify only if necessary for temporary diagnostics, then remove diagnostics before completion.

**Interfaces:**
- Consumes: bundled track playback in `/darktheme`
- Produces: verification evidence for loudness, beat alignment, pause behavior, build, and final diff

- [ ] **Step 1: Verify live behavior in the browser**

Open `/darktheme`, select Favorite Music, start a bundled track, and sample the live visual state. Confirm quiet frames have lower overall height, detected beat pulses coincide with synchronized peaks, and pause produces no new peaks after fade.

- [ ] **Step 2: Run the production build**

```powershell
npm run build
```

Expected: exit code 0; if sandboxed font fetching fails, repeat the same build with network approval.

- [ ] **Step 3: Review the final surgical diff**

Confirm only the signal module/test, analyser hook, visualizer, player wiring, approved docs, and project memory status are changed by this task. Preserve all unrelated user files.

- [ ] **Step 4: Record V2 only after verification**

After browser, tests, lint, and build evidence pass, update `memory.md` with a new Music Visualizer V2 decision and fresh file fingerprints. Do not replace or supersede the V1 restoration entry.

### Task 5: Strengthen the approved V2 skyline

**Files:**
- Modify: `src/lib/dashboard/audio-reactivity.test.ts`
- Modify: `src/lib/dashboard/audio-reactivity.ts`

**Interfaces:**
- Consumes: the existing `computeColumnMotionTargets(bands, loudness, beatPulse)` interface
- Produces: strongly separated `baseHeights` and `beatImpulses` without changing callers

- [ ] **Step 1: Raise the regression-test contrast requirements**

Add assertions that a strong synthetic band stays visibly high, a weak band remains near the baseline, and beat lift preserves a large inter-column spread. Keep the test based on numeric behavior rather than implementation constants.

- [ ] **Step 2: Run the focused test and verify RED**

```powershell
node --experimental-strip-types --test --experimental-test-isolation=none src/lib/dashboard/audio-reactivity.test.ts
```

Expected: the new strong peak-valley assertions fail against the current linear mapping.

- [ ] **Step 3: Implement the minimal nonlinear mapping**

Normalize each real band as before, apply a power curve greater than `1`, let loudness scale the available height range, and clamp base height and beat impulse. Do not introduce random movement or decorative preset heights.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the same Node command and require every audio-reactivity test to pass.

### Task 6: Eliminate saturated-white particle flashes

**Files:**
- Modify: `src/components/dashboard/EnergySandVolume.jsx`

**Interfaces:**
- Consumes: the existing particle fragment output and Three.js shader material
- Produces: the same transparent particle canvas with bounded alpha compositing

- [ ] **Step 1: Add a source-level regression assertion**

Extend the focused validation command to confirm the material no longer selects `THREE.AdditiveBlending` and that shader RGB intensity is not multiplied above the palette maximum.

- [ ] **Step 2: Apply the compositing fix**

Set the particle material to `THREE.NormalBlending`, clamp fragment alpha below full opacity, and output the aurora palette without an over-bright RGB multiplier. Preserve transparency, `depthWrite: false`, and the existing endpoint glow outside the particle mesh.

- [ ] **Step 3: Run targeted verification**

```powershell
node --experimental-strip-types --test --experimental-test-isolation=none src/lib/dashboard/audio-reactivity.test.ts
npx eslint src/lib/dashboard/audio-reactivity.ts src/lib/dashboard/audio-reactivity.test.ts src/components/dashboard/EnergySandVolume.jsx
```

Expected: all tests pass and ESLint reports no errors.

- [ ] **Step 4: Verify consecutive real playback frames**

Play a bundled track on `/darktheme`, capture consecutive frames of the particle canvas, and confirm that no frame contains a large saturated-white cluster while the skyline retains unmistakable high and low columns. Then run `npm run build` and update the existing V2 fingerprint in `memory.md`.
