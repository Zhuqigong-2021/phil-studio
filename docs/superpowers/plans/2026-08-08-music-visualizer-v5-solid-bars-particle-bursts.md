# Music Visualizer V5 Solid Bars with Particle Bursts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current particle-built column bodies with twelve continuous solid bars while keeping particles exclusively for short music-triggered surface breakup and restrained flight.

**Architecture:** Add a pure bar/surface timing helper, then add a dedicated fixed 12-instance solid-bar mesh below the existing fixed particle mesh. Inactive particles scale to zero; event surface grains use deterministic short lifetimes, while airborne grains keep the current captured-surface physics.

**Tech Stack:** Next.js 16, React 19, Three.js instanced meshes/GLSL, TypeScript pure helpers, Node 22 tests, ESLint.

## Global Constraints

- V4 archives remain unchanged; this implementation is the only canonical V5.
- Keep 12 display columns, 18-to-12 resampling, current gap ratio, music heights/brightness, 40% airborne budget, and captured ballistic physics.
- Bars reach opaque alpha at full presence and contain no particle feather or holes.
- Inactive particles render at zero scale; allocate nothing inside the animation loop.
- Preserve normal blending, stable fallback, canvas self-check, transparent clearing, lifecycle, pause, and reduced motion.

---

### Task 1: Pure solid-bar and surface-grain calculations

**Files:**
- Create: `src/lib/dashboard/solid-bar-particles.test.ts`
- Create: `src/lib/dashboard/solid-bar-particles.ts`

**Interfaces:**
- `writeSolidBarGeometry(column, columnCount, height, target, gapRatio = 0.16)` mutates `{ x, y, width, height }`; Y is half-height relative to baseline.
- `computeSurfaceGrainBudget(airborneBudget)` returns zero or `min(8, max(2, floor(airborneBudget) * 2))`.
- `computeSurfaceGrainScale(age, lifetime)` returns `sin(pi * progress)` in-lifetime and zero outside.
- `computeSurfaceGrainOffset(age, lifetime, seed)` returns `sin(pi * progress) * (0.006 + clamp01(seed) * 0.014)`.

- [ ] Write failing literal tests for 12 non-overlapping gap-bounded bars, height/center values, budgets `0,1,2,5,10 -> 0,2,4,8,8`, zero endpoint scale, positive midpoint scale, and midpoint offset bounds.
- [ ] Verify RED with the Node TypeScript test command.
- [ ] Implement the four minimal allocation-free helpers.
- [ ] Verify GREEN with the same focused command.

### Task 2: Dedicated solid-bar mesh

**Files:**
- Modify: `src/components/dashboard/EnergySandVolume.test.ts`
- Modify: `src/components/dashboard/EnergySandVolume.jsx`

- [ ] Add a failing guard for dedicated bar shaders, 12-instance bar mesh, separate attributes, geometry helper, bar-first render order, particle-second render order, and no bar feather.
- [ ] Verify RED.
- [ ] Add a simple contiguous cyan-blue-violet bar shader with per-column brightness and alpha `uPresence`.
- [ ] Create one fixed bar mesh, update only 12 transforms/brightness values per frame, and dispose it on cleanup.
- [ ] Verify GREEN before changing particle behavior.

### Task 3: Event-only particle pool

**Files:**
- Modify: `src/components/dashboard/EnergySandVolume.test.ts`
- Modify: `src/components/dashboard/EnergySandVolume.jsx`

- [ ] Add a failing guard requiring fixed `pSurface`, deterministic surface budgets/lifetimes/offsets, zero-size inactive particles, and no resting-rank/head-loosening rendering.
- [ ] Verify RED.
- [ ] Remove all resting particle body rendering and related component imports/state.
- [ ] Keep airborne spawning/physics while setting `pSurface = 0`.
- [ ] Spawn `2-8` short surface grains from the same event weights with captured top, fixed X, `0.24 + seed * 0.16` lifetime, and captured brightness.
- [ ] Render surface grains through pure scale/offset helpers without ballistic integration; deactivate at lifetime.
- [ ] Render inactive particles at zero scale and verify component plus pure tests GREEN.

### Task 4: Verification and canonical version record

**Files:**
- Modify: `memory.md`

- [ ] Run all visualizer, audio, physics, brightness, resampling, V6-helper regression, and new V5 solid-bar tests.
- [ ] Run targeted ESLint and `npm run build`, allowing Google Fonts network access only if the sandbox blocks it.
- [ ] Run authenticated 600-frame acceptance when available; otherwise explicitly retain it as unverified.
- [ ] Replace project-memory V5/V6/V7 semantics with one active canonical solid-bar V5 decision, keeping V4 restoration unchanged and recording exact hashes/evidence.

### Task 5: Dense-to-sparse launch transition

**Files:**
- Modify: `src/lib/dashboard/solid-bar-particles.test.ts`
- Modify: `src/lib/dashboard/solid-bar-particles.ts`
- Modify: `src/components/dashboard/EnergySandVolume.jsx`

**Interfaces:**
- `computeTransitionClusterBudget(airborneBudget)` returns zero or a bounded cluster count that is visibly denser than the airborne count.
- `computeTransitionClusterOffset(age, lifetime, seed)` returns a short vertical offset whose distribution is dense at the captured top and progressively sparse above it.
- `computeTransitionClusterScale(age, lifetime, seed)` provides a quick fade over `0.10-0.18s` without changing the solid bar.

- [ ] Add failing tests proving the cluster is denser than the airborne budget, bounded, shortest-lived at the top, and vertically tapered rather than uniformly scattered.
- [ ] Run the focused helper test and verify RED for missing transition-cluster helpers.
- [ ] Implement the smallest deterministic, allocation-free helpers that satisfy those tests.
- [ ] Replace the existing sparse surface-grain spawn with a column-local transition cluster whose particles concentrate at the captured top and taper upward.
- [ ] Keep the existing restrained airborne budget and ballistic free-fall unchanged.
- [ ] Run focused helper/component tests, the complete visualizer regression set, targeted ESLint, and the production build.

### Task 6: Local top erosion and same-origin trail

**Files:**
- Modify: `src/lib/dashboard/solid-bar-particles.test.ts`
- Modify: `src/lib/dashboard/solid-bar-particles.ts`
- Modify: `src/components/dashboard/EnergySandVolume.test.ts`
- Modify: `src/components/dashboard/EnergySandVolume.jsx`

**Interfaces:**
- `computeErosionNotchDepth(age, barHeight)` returns a smooth local notch depth capped at `0.012` normalized units and zero after `0.12s`.
- `computeErosionGrainDelay(index, count)` staggers grain births over `0.06s`.
- `computeErosionTrailOffset(age, lifetime, seed)` advances debris upward from the shared launch point while retaining the dense-at-surface seed distribution.

- [ ] Add failing literal tests for notch depth/recovery, stagger ordering/bounds, and continuous upward trail offsets.
- [ ] Verify RED for the missing erosion helpers.
- [ ] Implement allocation-free deterministic helpers.
- [ ] Add per-bar erosion attributes to the fixed bar mesh; discard only a narrow top segment in the shader and restore it within `0.12s`.
- [ ] Select one music-driven source column and erosion center per event; use that exact origin for notch, debris, and airborne grains.
- [ ] Start debris grains with deterministic negative ages so births are staggered instead of synchronized.
- [ ] Preserve solid opacity outside the notch, the 40% airborne budget, gravity, and captured-surface return.
- [ ] Run focused tests, the complete visualizer regression suite, targeted ESLint, and production build.

### Task 7: Direct eighteen-band bar layout

**Files:**
- Modify: `src/components/dashboard/EnergySandVolume.test.ts`
- Modify: `src/components/dashboard/EnergySandVolume.jsx`
- Test: `src/lib/dashboard/layered-columns.test.ts`

- [ ] Change the component contract test to require eighteen display bars and direct analyser/onset band consumption.
- [ ] Run the component test and verify RED against the existing twelve-bar implementation.
- [ ] Set `DISPLAY_COLUMN_COUNT` to `AUDIO_BAND_COUNT`, remove render-loop spectrum resampling, and copy the eighteen live/onset values into the fixed display buffers without allocation.
- [ ] Keep bar gaps, shared erosion origin, captured surfaces, particle budgets, and ballistic motion unchanged.
- [ ] Run the complete visualizer regression suite, targeted ESLint, and production build.

### Task 8: Vertical bar shading and attached particle bounce

**Files:**
- Modify: `src/lib/dashboard/solid-bar-particles.test.ts`
- Modify: `src/lib/dashboard/solid-bar-particles.ts`
- Modify: `src/components/dashboard/EnergySandVolume.test.ts`
- Modify: `src/components/dashboard/EnergySandVolume.jsx`

- [ ] Add failing literal tests for a zero-at-rest bounce, a `0.06-0.09s` lift peak, staged release ordering, and stronger early-grain impulse.
- [ ] Verify RED for the missing bounce helpers.
- [ ] Implement deterministic allocation-free bounce and release helpers.
- [ ] Pass bar UV through the solid shader and multiply RGB by a dark-bottom to bright-top ramp while retaining opaque alpha and normal blending.
- [ ] Keep erosion debris attached to the shared local lift until its staged release, then seed airborne velocity from the corresponding release strength.
- [ ] Preserve direct eighteen-band mapping, fixed pools, local erosion, 40% flight budget, and gravity.
- [ ] Run focused tests, complete visualizer regressions, targeted ESLint, and production build.

### Task 9: Uniform brighter bars

**Files:**
- Modify: `src/components/dashboard/EnergySandVolume.test.ts`
- Modify: `src/components/dashboard/EnergySandVolume.jsx`

- [ ] Replace the vertical-gradient guard with a failing guard for no vertical-light expression and a fixed `1.18` RGB lift.
- [ ] Verify RED against the current gradient shader.
- [ ] Remove vertical gradient/top-only lift and multiply the existing music-driven solid color by `BAR_RGB_LIFT`.
- [ ] Keep alpha, normal blending, erosion, attached bounce, particle trail, and physics unchanged.
- [ ] Run complete visualizer regressions, targeted ESLint, and production build.

### Task 10: Twenty-four interpolated display bars

**Files:**
- Modify: `src/lib/dashboard/layered-columns.test.ts`
- Modify: `src/components/dashboard/EnergySandVolume.test.ts`
- Modify: `src/components/dashboard/EnergySandVolume.jsx`

- [ ] Add failing tests for an 18-to-24 edge-preserving spectrum mapping and a fixed 24-instance component mesh.
- [ ] Verify RED against the current direct eighteen-band implementation.
- [ ] Set `DISPLAY_COLUMN_COUNT` to `24`, restore allocation-free resampling for analyser and onset buffers, and keep the particle source selection over the 24 mapped weights.
- [ ] Preserve gap ratio, uniform `1.18` RGB lift, erosion origin, attached bounce, trail, 40% airborne budget, and gravity.
- [ ] Run complete visualizer regressions, targeted ESLint, and production build.

### Task 11: Clustered low debris and parent-driven trails

**Files:**
- Modify: `src/lib/dashboard/solid-bar-particles.test.ts`
- Modify: `src/lib/dashboard/solid-bar-particles.ts`
- Modify: `src/components/dashboard/EnergySandVolume.test.ts`
- Modify: `src/components/dashboard/EnergySandVolume.jsx`

- [ ] Add failing literal tests for a bounded `10-14` cluster, a `70/30` low-debris split, `2-4` trail grains per primary, and monotonically shrinking/darkening trail samples.
- [ ] Verify RED for missing cluster/trail helpers.
- [ ] Implement deterministic allocation-free count, split, trail-scale, and trail-brightness helpers.
- [ ] Extend the fixed pool with parent-index and trail-lag arrays; subordinate grains reconstruct positions from their active primary grain and never integrate independently.
- [ ] Keep the majority debris on a short low arc tied to the captured top; retain existing primary bounce, impulse, gravity, and return.
- [ ] Preserve 24 bars, 18-to-24 resampling, uniform `1.18` bar lift, normal blending, and no per-frame allocation.
- [ ] Run complete visualizer regressions, targeted ESLint, and production build.

### Task 12: Per-band adaptive skyline balancing

**Files:**
- Modify: `src/lib/dashboard/fountain-physics.test.ts`
- Modify: `src/lib/dashboard/fountain-physics.ts`
- Modify: `src/components/dashboard/EnergySandVolume.test.ts`
- Modify: `src/components/dashboard/EnergySandVolume.jsx`

- [ ] Add failing tests proving a steady descending spectrum converges away from a strong left-high/right-low slope, a real local spike remains visible, equal neighbors gain no invented variation, and compensation stays within `0.88-1.18`.
- [ ] Verify RED for the missing adaptive-spectrum interfaces.
- [ ] Implement a fixed per-band average/peak state, allocation-free stepping into a caller-provided buffer, and bounded neighbor-contrast expansion.
- [ ] Create adaptive state and work buffers once in the component; balance 18 analyser bands before 18-to-24 resampling and expand only real mapped differences.
- [ ] Keep overall loudness in the bed-height calculation and preserve every particle/event behavior.
- [ ] Run complete visualizer regressions, targeted ESLint, and production build.

### Task 13: Detrended peak-preserving skyline

**Files:**
- Modify: `src/lib/dashboard/fountain-physics.test.ts`
- Modify: `src/lib/dashboard/fountain-physics.ts`
- Modify: `src/lib/dashboard/layered-columns.test.ts`
- Modify: `src/lib/dashboard/layered-columns.ts`
- Modify: `src/components/dashboard/EnergySandVolume.test.ts`
- Modify: `src/components/dashboard/EnergySandVolume.jsx`

- [ ] Replace adaptive-baseline tests with failing tests that preserve multiple local reversals in a descending spectrum, stay flat for genuinely equal input, preserve peaks through 18-to-24 mapping, and produce bounded direct bed heights.
- [ ] Verify RED for missing detrended and peak-preserving interfaces.
- [ ] Implement allocation-free log compression, five-band trend subtraction, bounded local-detail expansion, peak-preserving resampling, and direct bed-target writing.
- [ ] Remove adaptive state from the V5 component path; maintain fixed raw/detail/display/height buffers created once.
- [ ] Blend loudness, local detail, compressed raw signal, and measured onsets without frame-wide min/max normalization.
- [ ] Preserve all 24-bar rendering, brightness, erosion, cluster, trail, and physics behavior.
- [ ] Run complete visualizer regressions, targeted ESLint, and production build.

### Task 14: Loudness-independent dynamic contour amplitude

**Files:**
- Modify: `src/lib/dashboard/fountain-physics.test.ts`
- Modify: `src/lib/dashboard/fountain-physics.ts`

- [ ] Add failing tests proving a quiet but genuinely varied spectrum retains a visible height range, a flat spectrum remains flat, and louder input raises both baseline and available contour range.
- [ ] Verify RED against the current formula that multiplies all detail by loudness.
- [ ] Compute detail mean, RMS, and maximum signed excursion without allocation; derive a smooth variance gate and normalized signed contour.
- [ ] Generate bed height as loudness baseline plus gated contour amplitude, bounded raw residual, and measured onset lift.
- [ ] Preserve all component, rendering, and particle behavior.
- [ ] Run complete visualizer regressions, targeted ESLint, and production build.

### Task 15: Layered water-droplet splash

**Files:**
- Modify: `src/lib/dashboard/solid-bar-particles.test.ts`
- Modify: `src/lib/dashboard/solid-bar-particles.ts`
- Modify: `src/lib/dashboard/fountain-physics.test.ts`
- Modify: `src/lib/dashboard/fountain-physics.ts`
- Modify: `src/components/dashboard/EnergySandVolume.test.ts`
- Modify: `src/components/dashboard/EnergySandVolume.jsx`

- [x] Add failing tests for `60/30/10` tier allocation, `0.04-0.08s` separation, tiered impulse/spread, non-linear trail lag, and horizontal air drag.
- [x] Verify RED for missing droplet interfaces and unchanged ballistic integration.
- [x] Implement allocation-free droplet tier, delay, impulse, spread, and trail-lag helpers plus bounded air drag.
- [x] Store one fixed droplet tier per active pool entry; distribute the complete `10-14` cluster across low, medium, and high arcs.
- [x] Keep particles attached during the local bulge, release them in stages, and use wider/larger arcs only for measured stronger music.
- [x] Replace equal tail spacing with non-linear lag while preserving parent-driven position, shrinking, and darkening.
- [x] Preserve 24 bars, dynamic contour heights, brightness, fixed pools, normal blending, and no random timers.
- [x] Run complete visualizer regressions, targeted ESLint, and production build.

## Self-Review

- Coverage: solid bars, flat tops, event-only grains, restrained flight, stability, canonical naming, and verification are explicit.
- Placeholder scan: no deferred or ambiguous implementation step remains.
- Type consistency: helper names and surface-state semantics match every consumer step.
