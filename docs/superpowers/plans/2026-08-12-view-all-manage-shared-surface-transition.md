# View All → Manage Shared Surface Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current multi-stage View All handoff with one 0.75-second FLIP shared surface that lands pixel-aligned with Manage and hands off without a second entrance.

**Architecture:** Keep the existing cloned All Tools shell and App Router handoff registry. Introduce one shared target-rect calculator and an explicit transition timing model. Animate the outer shell with transform/clip geometry, crossfade source/preview late, begin the shared background after the main spatial move, and let the real Manage surface mount at its final state beneath the retained overlay.

**Tech Stack:** Next.js 16 App Router, React 19, GSAP 3, TypeScript, Node test runner.

## Global Constraints

- Normal transition duration is 0.75 seconds; reduced motion is 0.16 seconds.
- Sidebar and Navbar remain fixed and unanimated.
- Preserve all Manage CRUD, filtering, pagination, Toast, database behavior, and direct-Manage entrance.
- Do not add dependencies or change Dashboard/Manage visual constants outside the transition.
- Continuous motion uses transform and opacity; layout is measured only at transition boundaries.

---

### Task 1: Shared geometry and timing contract

**Files:**
- Modify: `src/lib/dashboard/tool-transition.ts`
- Modify: `src/lib/dashboard/tool-transition.test.ts`

**Interfaces:**
- Produces: `getToolLibraryTargetRect(bounds, paddings, viewportHeight)` and `getToolLibraryTransitionTiming(reduceMotion)`.
- Consumed by: Dashboard transition starter and Manage handoff.

- [ ] Add failing tests asserting the exact target rectangle and phases: total `0.75`, expansion start `0.04`, background start `0.41`, content handoff start `0.45`, route start `0.56`; reduced total `0.16` with no spatial phases.
- [ ] Run the focused test with Node TypeScript stripping and confirm it fails because the helpers do not exist.
- [ ] Implement pure helpers and replace inline destination padding arithmetic.
- [ ] Run the focused test and confirm it passes.

### Task 2: Single shared-surface timeline

**Files:**
- Modify: `src/lib/dashboard/tool-transition.ts`
- Modify: `src/app/dashboard/dashboard.css`
- Modify: `src/lib/dashboard/tool-transition.test.ts`

**Interfaces:**
- Consumes: timing and target rectangle from Task 1.
- Produces: retained overlay whose source and preview crossfade without a blank frame.

- [ ] Add failing source/integration assertions that source content remains visible through the opening phase, preview enters late, background starts at `0.41`, route begins at `0.56`, and surrounding content excludes Sidebar/Navbar.
- [ ] Run tests and confirm RED.
- [ ] Refactor the timeline so the shell moves from `0.04` to `0.62`, source fades from `0.36` to `0.54`, preview fades from `0.42` to `0.62`, and veil fades from `0.41` to `0.75` using strong in-out/out curves.
- [ ] Keep overlay and preview in one coordinate system; remove early content disappearance and per-tree surrounding blur.
- [ ] Trigger route handoff at `0.56` while retaining overlay until Manage signals completion.
- [ ] Run focused tests and confirm GREEN.

### Task 3: Final-state Manage takeover

**Files:**
- Modify: `src/app/manage/page.tsx`
- Modify: `src/lib/dashboard/tool-transition.ts`
- Test: existing transition tests plus a new/updated Manage handoff integration test.

**Interfaces:**
- Consumes: handoff marker and retained overlay.
- Produces: true Manage surface mounted at opacity 1 and final geometry, with only overlay opacity removed.

- [ ] Add failing assertions that a handoff entrance does not apply `y: 12`, row stagger, or a second content entrance, and that overlay cleanup begins only after the Manage root is mounted.
- [ ] Run tests and confirm RED.
- [ ] In the handoff branch, set the real Manage targets directly to final state and schedule only retained-layer fade-out; leave direct `/manage` navigation animation unchanged.
- [ ] Run focused tests and confirm GREEN.

### Task 4: Regression and visual verification

**Files:**
- Test only; do not change unrelated production files.

- [ ] Run all transition-focused tests, `npx tsc --noEmit`, targeted ESLint, and `npm run build`.
- [ ] Browser-check desktop Dashboard → View All at four frames: start, expansion midpoint, background handoff, final Manage takeover.
- [ ] Confirm Sidebar/Navbar remain fixed, no stretched text, no blank frame, no background seam, and final bounds do not jump.
- [ ] Confirm direct Sidebar Manage entrance still uses its existing directional animation and reduced-motion uses a 160ms fade.
