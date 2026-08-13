# Favorites Animated List and Filter Focus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Match the ReactBits item-entry/reflow behavior in Favorites and remove the clipped Category Filter focus outline.

**Architecture:** Favorites renders a four-item cyclic window. Each interval replaces the oldest visible key with the next tool so AnimatePresence handles exit/entry while layout animation moves the retained rows into the empty position. Category filtering behavior stays unchanged; only its erroneous focus-within outline is removed.

**Tech Stack:** React, Motion, Next.js, CSS, Node test runner.

## Global Constraints

- Do not add animated scrolling to Categories.
- Preserve hidden scrollbars and reduced-motion behavior.
- Preserve category checkbox selected styling and keyboard operability.

---

### Task 1: Favorites replacement and reflow

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Test: `src/app/dashboard/favorites-scroll-and-task-progress.integration.test.ts`

- [ ] Write a failing source contract for a four-item cyclic window, AnimatePresence exit/entry, and layout reflow.
- [ ] Run the test and confirm the old scrollTo implementation fails it.
- [ ] Replace scrollTo with the cyclic visible window and directional item motion.
- [ ] Run focused tests and TypeScript.

### Task 2: Category Filter focus styling

**Files:**
- Modify: `src/styles/secondary.css`
- Test: `src/app/manage/category-filter.integration.test.ts`

- [ ] Add a failing assertion that the table filter options do not draw a focus-within outline.
- [ ] Remove only the table filter outline rule.
- [ ] Run focused tests, lint, TypeScript, and production build.
