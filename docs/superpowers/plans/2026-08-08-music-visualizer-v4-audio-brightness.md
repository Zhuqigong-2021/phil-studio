# Music Visualizer V4 Audio Brightness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make resting and airborne V4 particles change brightness according to global RMS, local band energy, and launch-event strength without changing V3 motion or geometry.

**Architecture:** Add a pure brightness module that owns bounded audio-to-brightness calculations and smoothing. Feed one fixed per-instance brightness attribute into the existing shader; resting grains use live smoothed brightness while airborne grains use captured launch brightness with lifetime decay.

**Tech Stack:** TypeScript, Node test runner, React, Three.js ShaderMaterial, Next.js 16.

## Global Constraints

- V4 changes only music-driven brightness.
- Quiet playback retains approximately 18% brightness; strong playback is capped at 85%.
- Ordinary airborne grains receive approximately 15% emphasis; strong beat launches receive up to 20% emphasis.
- Do not change V3 bed height, emission timing/count, velocity, gravity, trajectory, positions, renderer lifecycle, or `THREE.NormalBlending`.
- Keep the committed V3 archives unchanged.

---

### Task 1: Build and test the pure brightness model

**Files:**
- Create: `src/lib/dashboard/particle-brightness.ts`
- Create: `src/lib/dashboard/particle-brightness.test.ts`

**Interfaces:**
- Produces: `computeRestingBrightness(loudness: number, bandEnergy: number): number`
- Produces: `computeLaunchBrightness(restingBrightness: number, beatStrength: number): number`
- Produces: `computeAirborneBrightness(launchBrightness: number, age: number, lifetime: number): number`
- Produces: `smoothBrightness(current: number, target: number, dtSec: number): number`

- [ ] **Step 1: Write failing tests**

Tests assert a quiet floor of `0.18`, strong content capped at `0.85`, strong bands brighter than weak bands, launch emphasis between 15% and 20% before the cap, smooth airborne decay, and faster attack than release.

- [ ] **Step 2: Run tests and verify RED**

```powershell
node --experimental-strip-types --test --experimental-test-isolation=none src/lib/dashboard/particle-brightness.test.ts
```

Expected: module-not-found failure because the production module does not exist.

- [ ] **Step 3: Implement minimal pure functions**

Use clamped deterministic formulas only. Do not use timers, random values, mutable module state, or renderer dependencies.

- [ ] **Step 4: Run tests and verify GREEN**

Run the focused brightness test, then the full audio/visualizer suite. Expected: all brightness and V3 regression cases pass.

### Task 2: Feed brightness through the fixed particle pool and shader

**Files:**
- Modify: `src/components/dashboard/EnergySandVolume.jsx`
- Modify: `src/components/dashboard/EnergySandVolume.test.ts`

**Interfaces:**
- Consumes: all four pure brightness functions from Task 1.
- Produces: fixed `aBrightness` instance attribute and captured `pLaunchBrightness` typed-array state.

- [ ] **Step 1: Write a failing source guard**

Assert that V4 imports the brightness module, defines `aBrightness`, captures launch brightness in fixed typed-array state, and keeps `THREE.NormalBlending` while excluding `THREE.AdditiveBlending`.

- [ ] **Step 2: Run the component test and verify RED**

Expected: the V4 brightness-source test fails because the attribute and launch state are absent.

- [ ] **Step 3: Implement the minimal renderer integration**

Add fixed per-band smoothed brightness and per-particle launch brightness arrays. Update the existing attribute each frame without allocating particle objects. Resting grains use live global/local brightness; launches capture source-band/event brightness; airborne grains apply pure lifetime decay. Modify only shader color/alpha intensity, not matrices or particle physics.

- [ ] **Step 4: Run all tests and verify GREEN**

Expected: brightness tests and all existing V3 rhythm, pause, physics, callback, and blending tests pass.

### Task 3: Verify V4 compatibility and stability

**Files:**
- Verify: `src/components/dashboard/EnergySandVolume.jsx`
- Verify: `src/app/darktheme/page.tsx`

- [ ] **Step 1: Run targeted ESLint**

Expected: zero errors; existing warnings may remain.

- [ ] **Step 2: Run `npm run build`**

Expected: Next.js compilation and TypeScript complete successfully.

- [ ] **Step 3: Observe 600 authenticated playback frames**

Expected: same canvas instance, zero replacements, zero blank frames, zero white saturation frames, and visible weak/strong brightness transitions. If Owner authentication is unavailable to automation, report this check as unverified rather than inferred.

### Task 4: Apply the approved V4-B global presentation lift

**Files:**
- Modify: `src/components/dashboard/EnergySandVolume.test.ts`
- Modify: `src/components/dashboard/EnergySandVolume.jsx`

**Interfaces:**
- Consumes: existing `vBrightness` music-driven value.
- Produces: shader-only 25% RGB lift and 10% alpha lift with the existing `0.62` cap.

- [ ] **Step 1: Write the failing shader-source test**

Assert that the shader defines explicit `1.25` RGB and `1.10` alpha presentation multipliers, continues multiplying by `vBrightness`, and retains `min(0.62, ...)`, `THREE.NormalBlending`, and no additive blending.

- [ ] **Step 2: Run the component test and verify RED**

Expected: the new source assertions fail because the approved presentation multipliers are absent.

- [ ] **Step 3: Implement the two shader multipliers**

Apply `1.25` to the existing music-controlled RGB factor and `1.10` to the existing music-controlled alpha expression before its `0.62` cap. Do not change JavaScript animation-loop state or matrices.

- [ ] **Step 4: Run the full 25-case suite and production checks**

Expected: all cases pass, targeted ESLint has zero errors, and the Next.js production build completes.

### Task 5: Feather each particle into the card

**Files:**
- Modify: `src/components/dashboard/EnergySandVolume.test.ts`
- Modify: `src/components/dashboard/EnergySandVolume.jsx`

**Interfaces:**
- Consumes: particle-local UV radius and the existing music-controlled alpha.
- Produces: a smooth radial `edgeFeather` multiplier with a clear core and transparent outer edge.

- [ ] **Step 1: Write the failing shader-source test**

Assert that the shader computes `edgeFeather` with `1.0 - smoothstep(0.2, 1.0, r)`, multiplies final alpha by it, removes the old `falloff < 0.02` discard, and retains only the negligible final `alpha < 0.003` discard.

- [ ] **Step 2: Run the component test and verify RED**

Expected: failure because the old exponential falloff and early discard remain.

- [ ] **Step 3: Implement the radial feather**

Replace the old exponential falloff with the approved smooth feather. Preserve RGB/alpha presentation multipliers, music brightness, `0.62` cap, and every JavaScript motion value.

- [ ] **Step 4: Run the 26-case suite and production checks**

Expected: all cases pass, targeted ESLint has zero errors, and the Next.js production build completes.
