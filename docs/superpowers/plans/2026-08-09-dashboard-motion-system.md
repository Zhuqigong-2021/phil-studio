# Dashboard Motion System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make dashboard interactions feel smoother and more premium through a restrained, cohesive motion system.

**Architecture:** CSS handles high-frequency micro-feedback, GSAP handles short coordinated dashboard sequences, and Motion handles React conditional presence and dynamic list layout. A tested shared module provides all exact values and reduced-motion variants.

**Tech Stack:** Next.js 16.2, React 19, TypeScript, GSAP 3, Motion 13, CSS.

## Global Constraints

- Preserve layout, copy, data, authentication, music, lyrics, and visualizer behavior.
- Keep interaction motion below 300ms.
- Animate transform and opacity only, except Motion layout measurement for Todo and Favorites.
- Keep reduced-motion opacity feedback while removing position and scale movement.
- Do not animate the command palette or add continuous decorative effects.

---

### Task 1: Shared motion contract

**Files:** Create `src/lib/dashboard/motion-system.ts`; create `src/lib/dashboard/motion-system.test.ts`.

- [ ] Write tests for exact entrance, panel, overlay, drawer, and list variants in normal and reduced-motion modes.
- [ ] Run the test and confirm it fails because the module does not exist.
- [ ] Implement only the exported constants and factory functions required by the test.
- [ ] Run the test and confirm it passes.

### Task 2: CSS micro-interactions and GSAP orchestration

**Files:** Modify `package.json`, `package-lock.json`, `src/app/dashboard/dashboard.css`, and `src/app/dashboard/page.tsx`.

- [ ] Install `gsap`.
- [ ] Add the three easing tokens plus scoped press and card-hover behavior with hover-device and reduced-motion gates.
- [ ] Add `dashboard-motion-root` and data hooks for Hero, Stats, BottomRow, and the active panel.
- [ ] Use `gsap.context()` in layout effects for a 240ms initial entrance and 220ms panel entry; revert contexts on cleanup.
- [ ] Run the shared motion test and focused ESLint.

### Task 3: Motion overlays and lists

**Files:** Modify `src/app/dashboard/page.tsx`.

- [ ] Use Motion backdrop/surface variants for Weather, Focus Settings, Add Tool, and the mobile drawer.
- [ ] Add `AnimatePresence` at each conditional owner so exit animations complete.
- [ ] Add `layout`, enter, and exit variants to Todo and Favorites rows only.
- [ ] Confirm rapid toggles retarget cleanly and reduced motion uses opacity only.

### Task 4: Verification

**Files:** Verify all touched files.

- [ ] Run every `src/**/*.test.ts` test.
- [ ] Run focused ESLint and distinguish unrelated pre-existing failures.
- [ ] Run the production build.
- [ ] Capture desktop and mobile screenshots and compare the resting layout with the existing reference.
- [ ] Test stat changes, overlays, Todo/Favorites changes, and reduced motion manually.
