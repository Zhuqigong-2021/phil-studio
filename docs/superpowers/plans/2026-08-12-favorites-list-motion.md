# Favorites List Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add restrained, premium motion feedback to the Dashboard Favorites list and a multi-select Category table filter.

**Architecture:** Keep database behavior in the existing workspace hook. Define pure motion values in a focused helper, then apply them to the existing `AnimatePresence` rows. Add Category filter state to the Manage reducer and filter the complete authoritative tool collection before pagination; keep the table-header filter separate from row editing.

**Tech Stack:** React 19, Motion 13, TypeScript, Node test runner.

## Global Constraints

- Only animate the Dashboard Favorites list card.
- Do not add looping animation.
- Keep interactions available while entrance animation runs.
- Use transform and opacity for movement; support `prefers-reduced-motion`.
- Preserve the existing pending spinner and database Toast behavior.
- Category filtering uses OR semantics, defaults to all categories, and resets pagination to page 1.

---

### Task 1: Favorites motion contract

**Files:**
- Create: `src/lib/dashboard/favorites-list-motion.ts`
- Create: `src/lib/dashboard/favorites-list-motion.test.ts`

**Interfaces:**
- Produces: `getFavoriteRowMotion(index, reducedMotion)` and shared hover/press transition values.

- [ ] Write failing tests for 45ms stagger, subtle 8px entrance, fast exit, layout transition, and reduced motion.
- [ ] Run the focused test and verify it fails because the helper is absent.
- [ ] Implement the smallest pure helper satisfying those values.
- [ ] Run the focused test and verify it passes.

### Task 2: Dashboard Favorites row interactions

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Create: `src/app/dashboard/favorites-list-motion.integration.test.ts`

**Interfaces:**
- Consumes: `getFavoriteRowMotion(index, reducedMotion)`.

- [ ] Write a failing source integration test for stable row hooks, Indigo hover layer, external-link motion, star glow/press feedback, and reduced-motion behavior.
- [ ] Run the integration test and verify the expected missing hooks fail.
- [ ] Apply the motion contract to each existing Favorites row while preserving links, spinner, callbacks, and accessibility labels.
- [ ] Run focused tests, TypeScript, targeted lint, browser interaction verification, and production build.
- [ ] Commit only the plan and feature files.

### Task 3: Multi-select Category table filter

**Files:**
- Modify: `src/hooks/manage-page-state.ts`
- Modify: `src/hooks/useManagePageState.ts`
- Modify: `src/components/dashboard/pages/ManageContent.tsx`
- Create: `src/components/dashboard/manage/CategoryTableFilter.tsx`
- Test: `src/hooks/manage-page-state.test.ts`
- Test: `src/components/dashboard/manage/manage-controls.test.ts`

**Interfaces:**
- Produces: `selectedCategoryFilters`, `toggleCategoryFilter(category)`, and `clearCategoryFilters()` on `ManagePageState`.

- [ ] Write failing reducer/helper tests proving the default shows all, multiple selections use OR matching, and selection changes reset page 1.
- [ ] Run the focused tests and verify the expected missing state/actions fail.
- [ ] Add the minimal filter state and apply it to all tools before `paginateTools`.
- [ ] Write failing UI contract tests for an accessible Category header trigger, category checkbox list, `All categories` reset, outside/Escape close, and hidden scrollbar.
- [ ] Implement the compact anchored popover without changing row-level Category collectors.
- [ ] Run focused tests, TypeScript, targeted lint, browser filtering/pagination verification, and production build.
