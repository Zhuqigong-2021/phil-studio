# V5 Stronger Spray and Original Equalizer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the original five-bar playback indicator and upgrade V5 to a clearly visible three-layer music-driven plume.

**Architecture:** Revert the isolated breathing-dot replacement in `MusicPlayerPanel`. Add pure allocation-free budget helpers for root, primary, and strong-beat accent layers, then reuse the existing fixed particle pool and trajectory states to render denser low grains plus stronger medium/high airborne grains.

**Tech Stack:** React 19, Next.js 16, TypeScript/JSX, CSS keyframes, Three.js fixed instancing, Node test runner, ESLint.

## Global Constraints

- Restore the exact five-bar cyan-to-violet indicator and stepped playback animation.
- Root budget is `16-22`, ordinary primary budget is `8-12`, and strong-beat accent budget is `2-4`.
- Strong spray is about `35%` wider and strong accents are at most `15%` brighter.
- Preserve real onset/beat causality, fixed pools, normal alpha blending, 24 bars, V4, and flash safeguards.
- Add no random timer, React animation state, per-frame object/array allocation, or additive blending.

---

### Task 1: Restore the original top-right equalizer

**Files:**
- Modify: `src/app/darktheme/page.tsx`
- Modify: `src/app/darktheme/darktheme.css`
- Delete: `src/app/darktheme/playing-status.ts`
- Delete: `src/app/darktheme/playing-status.test.ts`

- [ ] Remove the breathing-dot import, stable three-span node, helper, test, and CSS states.
- [ ] Restore `EQUALIZER_NEON_COLORS`, `EQUALIZER_DURATIONS`, five `3px` rounded spans, original white-tip gradients, `16px` anchor, and conditional stepped animation.
- [ ] Restore `@keyframes music-bar-jump` with the original `3,15,6,16,5,3px` sequence.
- [ ] Verify no `playing-status` production reference remains and run targeted ESLint.

### Task 2: Implement stronger three-layer spray with TDD

**Files:**
- Modify: `src/lib/dashboard/solid-bar-particles.test.ts`
- Modify: `src/lib/dashboard/solid-bar-particles.ts`
- Modify: `src/components/dashboard/EnergySandVolume.test.ts`
- Modify: `src/components/dashboard/EnergySandVolume.jsx`

**Interfaces:**
- Produces: `computeStrongPrimaryBudget(emissionBudget: number): number`, `computeStrongRootBudget(primaryBudget: number): number`, and `computeHighAccentBudget(primaryBurst: number): number`.

- [ ] **Write failing budget tests**

```ts
assert.deepEqual([0, 1, 4, 8, 12].map(computeStrongPrimaryBudget), [0, 8, 9, 11, 12]);
assert.deepEqual([0, 8, 9, 10, 11, 12].map(computeStrongRootBudget), [0, 16, 18, 19, 21, 22]);
assert.deepEqual([0, 0.45, 0.46, 0.72, 1].map(computeHighAccentBudget), [0, 0, 2, 3, 4]);
```

- [ ] Run the focused test and verify RED because the three interfaces do not exist.
- [ ] Implement the three allocation-free bounded helpers with the literal mappings above.
- [ ] Replace the old restrained requested/cluster split: spawn `8-12` medium primary droplets, append `2-4` tier-2 droplets only for strong primary beats, and spawn an independent `16-22` tier-0 root bridge.
- [ ] Multiply droplet horizontal spread by `1.35`; apply `1.15` launch brightness only to tier-2 accent grains and clamp to `1`.
- [ ] Keep the current medium/high impulse model, gravity, nonlinear trails, captured surfaces, staged release, and reduced-motion count/height reductions.
- [ ] Update the component source guard to require the three-layer helpers and widened spread while rejecting the old natural-cluster split.
- [ ] Run focused tests, every `src/**/*.test.ts`, targeted ESLint, production build, and inspect the focused diff. Do not commit the dirty main worktree without explicit authorization.

## Self-Review

- Spec coverage: original equalizer, all three budgets, width, brightness, causality, reduced motion, and stability are covered.
- Placeholder scan: no TBD, TODO, or deferred implementation remains.
- Type consistency: all new helpers consume numbers and return bounded integer counts.
