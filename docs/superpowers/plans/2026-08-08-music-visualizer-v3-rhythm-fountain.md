# Music Visualizer V3 Rhythm Fountain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace V2's column-packed particle heights with a full-width, music-triggered upward fountain whose grains follow independent ballistic arcs and free fall.

**Architecture:** Preserve the V2 analyser, beat pulse, stable WebGL lifecycle, and bounded alpha shader. Add pure deterministic burst/onset and ballistic-physics helpers, then drive a fixed particle pool in `EnergySandVolume` so measured audio decides activation while persistent velocity and gravity decide motion.

**Tech Stack:** Next.js 16.2.10, React 19.2.4, TypeScript, Web Audio API, Three.js 0.185.1, Node 22 built-in test runner.

## Global Constraints

- Preserve Music Visualizer V1 as recorded in `memory.md` `D-114`.
- Save the current flash-free strong peak-valley implementation as the exact Music Visualizer V2 restoration baseline before modifying production code.
- Burst timing and strength must come only from measured beat/onset/loudness data, never random timers or launch probability.
- Burst origins must follow live spectrum energy across the full visualizer width and must not be hard-coded to the left.
- Preserve the memoized fallback callback, same-canvas lifecycle, bounded normal alpha compositing, pause behavior, reduced motion, fallback, player layout, slider, progress, album art, controls, track data, and Dashboard background.
- Preserve unrelated changes in the dirty working tree; do not commit implementation files without explicit user direction.

---

### Task 1: Lock the exact V2 restoration baseline

**Files:**
- Create: `src/components/dashboard/EnergySandVolume.v2.jsx`
- Modify: `memory.md`

**Interfaces:**
- Consumes: current verified `EnergySandVolume.jsx` and the D-115 analyser/page fingerprints
- Produces: an exact V2 component snapshot plus restoration instructions that leave V1 untouched

- [ ] **Step 1: Copy the exact verified component through `apply_patch`**

Create `EnergySandVolume.v2.jsx` with byte-equivalent source content from the current `EnergySandVolume.jsx`. Do not rename the exported component inside the snapshot because restoration uses file replacement, not simultaneous import.

- [ ] **Step 2: Verify the snapshot fingerprint**

```powershell
Get-FileHash src/components/dashboard/EnergySandVolume.jsx,src/components/dashboard/EnergySandVolume.v2.jsx -Algorithm SHA256
```

Expected: both hashes equal the V2 component fingerprint recorded in D-115.

- [ ] **Step 3: Record V2 snapshot availability**

Update D-115 so `回到 V2` explicitly restores `EnergySandVolume.v2.jsx` to `EnergySandVolume.jsx` together with the existing analyser/page baselines. Do not alter D-114.

### Task 2: Build deterministic musical burst and ballistic physics

**Files:**
- Create: `src/lib/dashboard/fountain-physics.ts`
- Create: `src/lib/dashboard/fountain-physics.test.ts`

**Interfaces:**
- Consumes: `Float32Array bands`, previous band envelopes, `loudness`, `beatPulse`, previous beat pulse, `playing`, and elapsed seconds
- Produces: `stepFountainTriggers(state, input)` with per-band onset strengths and one `primaryBurst`; `integrateFountainParticle(particle, dtSec)` with updated position, velocity, age, and active state

- [ ] **Step 1: Write failing trigger tests**

Use `node:test` to assert: steady bands produce no onset; one beat rising edge produces one primary burst; beat decay does not retrigger; a positive band delta produces a smaller secondary onset at that band; pause emits nothing; stronger loudness increases deterministic emission budget.

- [ ] **Step 2: Write failing ballistic tests**

Create a particle with positive `vy`, small `vx`, gravity, and an active lifetime. Assert repeated integration reduces `vy`, produces an apex, then negative `vy`; `x` can cross its source-band boundary but clamps inside `0..1`; baseline contact deactivates the particle.

- [ ] **Step 3: Run RED**

```powershell
node --experimental-strip-types --test --experimental-test-isolation=none src/lib/dashboard/fountain-physics.test.ts
```

Expected: FAIL because `fountain-physics.ts` does not exist.

- [ ] **Step 4: Implement the minimal pure model**

Use exponential per-band envelopes, positive-delta onset thresholds, beat rising-edge detection, clamped emission budgets, and Euler integration:

```ts
vy -= gravity * dtSec;
x = clamp01(x + vx * dtSec);
y += vy * dtSec;
age += dtSec;
```

Deactivate only at baseline on descent or bounded lifetime. Use no `Math.random()`.

- [ ] **Step 5: Run GREEN**

Run the same command and require every fountain test to pass.

### Task 3: Replace rigid column packing with the pooled rhythm fountain

**Files:**
- Modify: `src/components/dashboard/EnergySandVolume.jsx`
- Modify: `src/components/dashboard/EnergySandVolume.test.ts`

**Interfaces:**
- Consumes: `stepFountainTriggers`, `integrateFountainParticle`, `bandsRef`, `loudnessRef`, `beatPulseRef`, and `isPlayingRef`
- Produces: fixed pooled grains spawned across measured active bands with independent `x`, `y`, `vx`, `vy`, gravity, age, and active state

- [ ] **Step 1: Add failing renderer source guards**

Assert that V3 imports the fountain helpers, keeps `THREE.NormalBlending`, contains no runtime `Math.random`, and no longer derives every grain's height from `colHeight[col] * pHeightRank`.

- [ ] **Step 2: Run RED**

```powershell
node --experimental-strip-types --test --experimental-test-isolation=none src/components/dashboard/EnergySandVolume.test.ts
```

Expected: FAIL because V2 still uses column-packed resting heights and does not import fountain physics.

- [ ] **Step 3: Implement the fixed particle pool**

Reuse the existing instanced mesh count as a pool. Keep typed arrays for active flag, position, velocity, gravity, age, lifetime, size seed, and color position. On primary/secondary events, activate inactive grains at the triggering band center with deterministic small horizontal drift and event-scaled upward velocity. Do not allocate inside `animate`.

- [ ] **Step 4: Preserve the baseline bed without rectangular columns**

Inactive grains render as a thin, low sand bed shaped by current spectrum. Active grains use only their independent ballistic position. A grain's band influences spawn location/color but cannot clip its later motion.

- [ ] **Step 5: Run GREEN and targeted lint**

```powershell
node --experimental-strip-types --test --experimental-test-isolation=none src/components/dashboard/EnergySandVolume.test.ts src/lib/dashboard/fountain-physics.test.ts src/lib/dashboard/audio-reactivity.test.ts
npx eslint src/components/dashboard/EnergySandVolume.jsx src/components/dashboard/EnergySandVolume.test.ts src/lib/dashboard/fountain-physics.ts src/lib/dashboard/fountain-physics.test.ts
```

Expected: all tests pass and ESLint exits with zero errors.

### Task 4: Verify V3 timing, free fall, width coverage, and stability

**Files:**
- Modify: `memory.md`
- Create final evidence screenshot: `music-visualizer-v3-rhythm-fountain.png`

**Interfaces:**
- Consumes: bundled playback on `/darktheme`
- Produces: measured evidence for burst timing, ascent/descent, cross-band travel, full-width source selection, and zero blank frames

- [ ] **Step 1: Observe 600 frames without screenshot pressure**

Use browser-side instrumentation to count canvas mutations, blank frames, primary/secondary burst events, active particle range, source-band indices, and representative `vy` sign changes. Do not take per-frame screenshots.

- [ ] **Step 2: Check acceptance measurements**

Require one persistent canvas, zero blank frames, at least one burst aligned with a measured event, at least one particle whose `vy` changes from positive to negative, and burst sources selected from live bands rather than a fixed index. If the sampled song has no right-side onset, report that width coverage as unverified instead of inventing evidence.

- [ ] **Step 3: Run final verification**

```powershell
node --experimental-strip-types --test --experimental-test-isolation=none src/components/dashboard/EnergySandVolume.test.ts src/lib/dashboard/fountain-physics.test.ts src/lib/dashboard/audio-reactivity.test.ts
npx eslint src/app/darktheme/page.tsx src/components/dashboard/EnergySandVolume.jsx src/components/dashboard/EnergySandVolume.test.ts src/lib/dashboard/fountain-physics.ts src/lib/dashboard/fountain-physics.test.ts src/lib/dashboard/audio-reactivity.ts src/lib/dashboard/audio-reactivity.test.ts
npm run build
```

Expected: tests and build pass; ESLint has zero errors.

- [ ] **Step 4: Capture one final reference image and record V3**

After runtime verification, capture the visualizer once, compute current file fingerprints, add D-116 for V3 while keeping D-114 and D-115 active restoration baselines, and state any visually unverified acceptance criteria honestly.
