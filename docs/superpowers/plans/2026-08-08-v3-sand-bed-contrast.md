# V3 Sand Bed Contrast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make V3's continuous sand bed visibly taller and increase peak-to-valley contrast while preserving music-driven fountain timing and renderer stability.

**Architecture:** Keep the renderer and particle pool unchanged. Adjust only the pure `computeFountainBedTargets` audio-to-height mapping, with executable thresholds that define the quiet floor and loud spectral contrast.

**Tech Stack:** TypeScript, Node test runner, React, Three.js, Next.js 16.

## Global Constraints

- Target a visible continuous-bed range of roughly 7% to 38% of the visualizer height.
- Strong live bands must stand clearly above weak neighbors through nonlinear mapping.
- Do not change burst detection, launch timing, particle physics, WebGL lifecycle, blending, or flash safeguards.
- Keep the exact V2 snapshot unchanged.

---

### Task 1: Strengthen the pure bed-height mapping

**Files:**
- Modify: `src/lib/dashboard/fountain-physics.test.ts`
- Modify: `src/lib/dashboard/fountain-physics.ts`

**Interfaces:**
- Consumes: `computeFountainBedTargets(bands: Float32Array, loudness: number): Float32Array`
- Produces: the same interface with a higher visible floor and stronger spectral contrast.

- [ ] **Step 1: Write the failing test**

Strengthen the existing continuous-bed test so a loud uneven spectrum requires a maximum above `0.32`, a minimum above `0.055`, a peak-to-valley difference above `0.20`, and a dominant band at least `2.8` times the weakest band.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
node --experimental-strip-types --test --experimental-test-isolation=none src/lib/dashboard/fountain-physics.test.ts
```

Expected: the continuous-bed test fails because the current maximum and contrast are too low.

- [ ] **Step 3: Implement the minimal mapping change**

Change only the constants and nonlinear spectrum curve inside `computeFountainBedTargets`. Preserve neighbor smoothing and return type. Use a visible quiet floor, stronger loudness gain, and a steeper shape exponent while clamping the result below the compact visualizer boundary.

- [ ] **Step 4: Run the full visualizer tests and verify GREEN**

Run:

```powershell
node --experimental-strip-types --test --experimental-test-isolation=none src/components/dashboard/EnergySandVolume.test.ts src/lib/dashboard/fountain-physics.test.ts src/lib/dashboard/audio-reactivity.test.ts
```

Expected: all tests pass, including burst and pause behavior.

### Task 2: Verify rendering safety and production compatibility

**Files:**
- Verify: `src/components/dashboard/EnergySandVolume.jsx`
- Verify: `src/app/page.tsx`

**Interfaces:**
- Consumes: strengthened bed targets from Task 1.
- Produces: verified unchanged WebGL lifecycle and flash safeguards.

- [ ] **Step 1: Run targeted lint**

```powershell
npx eslint src/components/dashboard/EnergySandVolume.jsx src/components/dashboard/EnergySandVolume.test.ts src/lib/dashboard/fountain-physics.ts src/lib/dashboard/fountain-physics.test.ts src/lib/dashboard/audio-reactivity.ts src/lib/dashboard/audio-reactivity.test.ts src/app/page.tsx
```

Expected: zero errors; pre-existing warnings may remain.

- [ ] **Step 2: Run the production build**

```powershell
npm run build
```

Expected: Next.js compiles, TypeScript passes, and all routes are generated.

- [ ] **Step 3: Verify 600 playback frames**

During bundled-track playback, observe the same canvas for 600 consecutive animation frames. Expected: zero replacements, blank frames, or local white flashes; the continuous bed remains present between real beat-triggered sprays.

