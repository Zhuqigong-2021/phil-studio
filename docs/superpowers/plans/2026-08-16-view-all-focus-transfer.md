# View All Focus-Transfer Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend and re-orchestrate the existing Dashboard `View All` shared-element transition so its expansion, content crossfade, background takeover, route change, and Manage handoff are perceptible and continuous.

**Architecture:** Keep the existing GSAP shared overlay, destination measurement, handoff marker, and Manage mounting path. Change only the pure timing contract and the timeline properties that consume it; preserve geometry, DOM structure, styles, routing, and reduced-motion behavior.

**Tech Stack:** Next.js 16 App Router, React 19, GSAP, TypeScript, Node `node:test`.

## Global Constraints

- Normal-motion total duration is exactly 1.08 seconds.
- Expansion starts at 0.05 seconds; route navigation starts at 0.84 seconds.
- Source content fades from 0.46 to 0.74 seconds.
- Preview content fades from 0.56 to 0.78 seconds, creating approximately 0.18 seconds of overlap.
- Background takeover starts at 0.78 seconds.
- Preserve current source and destination rectangles, Sidebar, Navbar, responsive layout, colors, background assets, and Tool Library markup.
- Preserve the existing 0.16-second reduced-motion opacity handoff.
- Do not change direct Sidebar navigation to Manage or its separate entrance animation.

---

### Task 1: Lock and implement the expanded timing contract

**Files:**
- Modify: `src/lib/dashboard/tool-transition.test.ts`
- Modify: `src/lib/dashboard/tool-transition.ts`

**Interfaces:**
- Consumes: `getToolLibraryTransitionTiming(reduceMotion: boolean): ToolLibraryTransitionTiming`.
- Produces: the approved timing object used by the browser GSAP timeline and Manage cleanup.

- [ ] **Step 1: Change the normal-motion timing assertion first**

```ts
assert.deepEqual(getToolLibraryTransitionTiming(false), {
  total: 1.08,
  expansionStart: 0.05,
  expansionEnd: 0.78,
  sourceFadeStart: 0.46,
  sourceFadeEnd: 0.74,
  previewFadeStart: 0.56,
  previewFadeEnd: 0.78,
  backgroundStart: 0.78,
  contentHandoffStart: 0.74,
  routeStart: 0.84,
});
```

- [ ] **Step 2: Run the focused test and observe the expected old-timing failure**

Run: `node --experimental-strip-types src/lib/dashboard/tool-transition.test.ts`

Expected: the approved phase-timing test fails because the implementation still returns the 0.75-second contract.

- [ ] **Step 3: Change only the normal-motion return value**

Update `getToolLibraryTransitionTiming(false)` in `src/lib/dashboard/tool-transition.ts` to return the exact object asserted above. Leave the reduced-motion branch unchanged.

- [ ] **Step 4: Run the focused test**

Run: `node --experimental-strip-types src/lib/dashboard/tool-transition.test.ts`

Expected: all transition geometry, lifecycle, marker, cleanup, and timing tests pass.

### Task 2: Preserve a clean crossfade and delayed background takeover

**Files:**
- Modify: `src/lib/dashboard/tool-transition.test.ts`
- Modify: `src/lib/dashboard/tool-transition.ts`
- Verify: `src/app/manage/direct-entrance.test.ts`

**Interfaces:**
- Consumes: the timing object from Task 1.
- Produces: a GSAP timeline that applies expansion, source exit, preview entrance, background veil, route callback, and final cleanup at those exact phases.

- [ ] **Step 1: Add source assertions for eased phases**

Add assertions that the expansion tween uses `ease: "power3.inOut"`, source content uses `ease: "power3.inOut"`, preview uses `ease: "power3.out"`, and veil uses `ease: "power3.inOut"`. Retain assertions that Sidebar and Navbar are not animated and the route callback uses `timing.routeStart`.

- [ ] **Step 2: Run the source contract test and observe a failure if an ease is missing**

Run: `node --experimental-strip-types src/lib/dashboard/tool-transition.test.ts`

Expected: FAIL only for any missing explicit expansion easing.

- [ ] **Step 3: Apply the minimal easing update**

In the expansion tween, add the existing GSAP curve without changing `plan`, bounds, width, height, or border radius:

```ts
timeline.to(shell, {
  ...plan,
  duration: timing.expansionEnd! - timing.expansionStart!,
  ease: "power3.inOut",
}, timing.expansionStart!);
```

Keep the existing source, preview, and veil tween implementations, which already derive duration and start time from the timing contract.

- [ ] **Step 4: Verify both View All and direct Manage paths**

Run:

```powershell
node --experimental-strip-types src/lib/dashboard/tool-transition.test.ts
node --experimental-strip-types src/app/manage/direct-entrance.test.ts
```

Expected: transition tests pass and the direct Manage entrance remains separate from the View All handoff.

### Task 3: Full regression and visual handoff verification

**Files:**
- Verify only: `src/lib/dashboard/tool-transition.ts`
- Verify only: `src/app/dashboard/page.tsx`
- Verify only: `src/app/manage/page.tsx`

**Interfaces:**
- Consumes: completed Tasks 1 and 2.
- Produces: verification evidence; no new production API.

- [ ] **Step 1: Run automated checks**

```powershell
node --experimental-strip-types src/lib/dashboard/tool-transition.test.ts
node --experimental-strip-types src/app/manage/direct-entrance.test.ts
npx tsc --noEmit
npx eslint src/lib/dashboard/tool-transition.ts src/lib/dashboard/tool-transition.test.ts src/app/manage/page.tsx src/app/manage/direct-entrance.test.ts
```

Expected: zero test failures, zero TypeScript errors, and zero ESLint errors.

- [ ] **Step 2: Verify desktop frames in the browser**

At 1920 by 900, activate `View All` and inspect these phases:

- Start: Dashboard background unchanged; Sidebar and Navbar fixed.
- 0.46 to 0.78 seconds: source tools and Tool Library preview visibly crossfade.
- 0.78 seconds onward: blurred Manage background begins taking over.
- 0.84 seconds: route changes while the shared surface remains visible.
- 1.08 seconds: Manage owns the final surface and the transition overlay is removed.

Record Sidebar/Navbar bounding rectangles before and during the transition and confirm they are unchanged.

- [ ] **Step 3: Verify reduced motion and direct navigation**

Emulate `prefers-reduced-motion: reduce` and confirm View All uses a short opacity handoff with no spatial expansion. Navigate directly through Sidebar Manage and confirm the existing directional entrance still runs.

- [ ] **Step 4: Run the production build**

Run: `npm run build`

Expected: build exits 0 and all 14 application pages are generated.

- [ ] **Step 5: Commit the focused implementation**

```powershell
git add -- src/lib/dashboard/tool-transition.ts src/lib/dashboard/tool-transition.test.ts
git commit -m "Refine View All focus transition"
```

Do not stage unrelated untracked assets or existing workspace files.
