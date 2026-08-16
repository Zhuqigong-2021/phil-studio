# Dashboard Interaction Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reproduce the supplied reference video's restrained focus-transfer motion for stat-panel switching, Search, and Add Tool without changing final UI or behavior.

**Architecture:** Extend the existing pure motion-system helpers with focused panel and overlay variants, then wire those variants into the existing Dashboard components. Keep transitions local: the bottom panel uses presence-based overlap; Search and Add Tool share backdrop timing but retain separate origins.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Motion React, GSAP, Node test runner, Playwright.

## Global Constraints

- Preserve all colors, gradients, borders, shadows, sizes, spacing, layout, content, and responsive breakpoints.
- Preserve Search focus, keyboard shortcuts, Escape/backdrop close, Add Tool form state and submission guards, and stat-card behavior.
- Animate only transform, opacity, and short-lived filter values.
- Reduced-motion variants use opacity only.
- Do not refactor unrelated Dashboard code.

---

### Task 1: Focus-transfer motion contracts

**Files:**
- Modify: `src/lib/dashboard/motion-system.ts`
- Modify: `src/lib/dashboard/motion-system.test.ts`

**Interfaces:**
- Produces: `getPanelPresenceMotion(reduced: boolean)`
- Produces: `getOverlayMotion(reduced: boolean, variant?: "modal" | "search")`

- [ ] **Step 1: Write failing tests**

Add assertions that normal panel motion includes blur/scale/Y enter and exit states, excludes X translation, and reduced motion contains opacity only. Add assertions that Search and Modal overlay variants share backdrop sequencing while using their respective origins.

- [ ] **Step 2: Run tests and verify RED**

Run:
`node --experimental-strip-types src/lib/dashboard/motion-system.test.ts`

Expected: FAIL because `getPanelPresenceMotion` and the overlay variant contract do not exist.

- [ ] **Step 3: Implement minimal pure motion definitions**

Implement focus-transfer definitions with:

- Panel enter: opacity 0, scale 0.975, y 10, blur 7px.
- Panel exit: opacity 0, scale 0.985, y 5, blur 5px.
- Modal enter: opacity 0, scale 0.94, y 14, blur 6px.
- Search enter: opacity 0, scale 0.965, y -10, blur 6px.
- Reduced motion: opacity only.
- Exit duration shorter than enter duration.

- [ ] **Step 4: Run tests and verify GREEN**

Run:
`node --experimental-strip-types src/lib/dashboard/motion-system.test.ts`

Expected: all tests pass.

### Task 2: Bottom-right stat-panel handoff

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/app/dashboard/premium-motion-wiring.test.ts`

**Interfaces:**
- Consumes: `getPanelPresenceMotion(reduced)`

- [ ] **Step 1: Write failing integration assertions**

Require `AnimatePresence` around the keyed active panel, explicit enter/exit variants, and removal of direction-based `getPanelMotion` wiring.

- [ ] **Step 2: Run test and verify RED**

Run:
`node --experimental-strip-types src/app/dashboard/premium-motion-wiring.test.ts`

Expected: FAIL because BottomRow still performs a GSAP horizontal entrance after immediate replacement.

- [ ] **Step 3: Implement presence handoff**

Replace the layout-effect/GSAP direction transition with an in-place keyed `motion.div` controlled by `AnimatePresence`. Keep All Tools stationary. Use a short overlap, preserve the existing panel DOM and dimensions, and allow rapid selection changes without stale content.

- [ ] **Step 4: Run test and verify GREEN**

Run:
`node --experimental-strip-types src/app/dashboard/premium-motion-wiring.test.ts`

Expected: all tests pass.

### Task 3: Search origin-aware reveal

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/app/dashboard/overlay-layering.test.ts`
- Modify: `src/app/dashboard/premium-motion-wiring.test.ts`

**Interfaces:**
- Consumes: `getOverlayMotion(reduced, "search")`

- [ ] **Step 1: Write failing assertions**

Require the Search backdrop and surface to be Motion elements using the Search overlay variant while retaining the body portal and z-index layering.

- [ ] **Step 2: Run tests and verify RED**

Run:
`node --experimental-strip-types src/app/dashboard/overlay-layering.test.ts`
`node --experimental-strip-types src/app/dashboard/premium-motion-wiring.test.ts`

Expected: FAIL because CommandPaletteDark currently uses plain div elements.

- [ ] **Step 3: Implement Search motion**

Apply the Search overlay backdrop and surface motion. Add a short result-content opacity delay without changing result markup, focus behavior, click targets, or final geometry.

- [ ] **Step 4: Run tests and verify GREEN**

Run the two targeted test files again and expect all tests to pass.

### Task 4: Add Tool modal choreography

**Files:**
- Modify: `src/components/dashboard/AddToolModal.tsx`
- Modify: `src/components/dashboard/add-tool-modal.integration.test.ts`

**Interfaces:**
- Consumes: `getOverlayMotion(reduced, "modal")`

- [ ] **Step 1: Write failing assertions**

Require the explicit Modal variant and a content reveal layer while preserving the existing submission guard, open session, close request, and Save lifecycle.

- [ ] **Step 2: Run test and verify RED**

Run:
`node --experimental-strip-types src/components/dashboard/add-tool-modal.integration.test.ts`

Expected: FAIL because Add Tool uses the generic overlay motion and has no coordinated content reveal.

- [ ] **Step 3: Implement modal choreography**

Use the Modal overlay variant and animate the existing header/form wrapper after the shell begins. Do not alter form fields, validation, saving state, database calls, close guards, or final styles.

- [ ] **Step 4: Run test and verify GREEN**

Run the targeted integration test and expect all tests to pass.

### Task 5: Regression and browser verification

**Files:**
- Modify only if a verified defect is found in the scoped implementation.

- [ ] **Step 1: Run focused regression suite**

Run all motion-system, premium-motion, overlay-layering, Add Tool lifecycle/submission, and Dashboard interaction tests.

- [ ] **Step 2: Run static checks**

Run:
`npx tsc --noEmit`
`npx eslint src/lib/dashboard/motion-system.ts src/app/dashboard/page.tsx src/components/dashboard/AddToolModal.tsx`
`npm run build`

- [ ] **Step 3: Browser-check desktop**

At 1920x900:

- Switch through all five stat cards, then click rapidly across them.
- Open Search by click and keyboard shortcut; close by Escape and backdrop.
- Open Add Tool; interact with a field; close by button and backdrop.
- Confirm no layout shift, clipping, stale panel, focus loss, console error, or final-style change.

- [ ] **Step 4: Browser-check mobile**

At 390x844:

- Repeat stat switching, Search open/close, and Add Tool open/close.
- Confirm geometry and scrolling match the current responsive UI.

- [ ] **Step 5: Review the diff**

Confirm every production change traces to the approved three-surface motion scope and no unrelated file is staged.
