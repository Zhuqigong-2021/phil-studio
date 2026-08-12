# Manage Direct Entrance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add directional direct-entry motion to Manage without changing the Dashboard View All handoff.

**Architecture:** A pure Manage motion-plan helper defines directions, timing, and reduced-motion fallbacks. The existing `entrance.handoff` branch remains authoritative: handoff executes only the current reveal, while direct entry runs a GSAP timeline targeting semantic shell and Tool Library regions.

**Tech Stack:** React 19, GSAP 3, Next.js 16, Node test runner.

## Global Constraints

- Never run direct-entry motion when `entrance.handoff` is true.
- Preserve View All geometry, background, marker clearing, and reveal timing.
- Run direct motion once per Manage mount and never after data mutations or pagination.
- Use transform and opacity only; reduced motion uses opacity only.

---

### Task 1: Manage motion plan and semantic targets

**Files:**
- Create: `src/lib/dashboard/manage-entrance-motion.ts`
- Create: `src/lib/dashboard/manage-entrance-motion.test.ts`
- Modify: `src/components/dashboard/pages/ManageContent.tsx`
- Modify: `src/components/dashboard/manage/EditableToolRow.tsx`
- Modify: `src/components/dashboard/manage/ToolLibraryPagination.tsx`

**Interfaces:**
- Produces: `getManageDirectEntrancePlan(reduced)`.
- Produces semantic hooks for header, table viewport, visible rows, and pagination.

- [ ] Write failing literal tests for directions, timing, stagger, and reduced motion.
- [ ] Run the focused test and observe the missing helper failure.
- [ ] Implement the minimal pure plan.
- [ ] Add semantic hooks without changing layout or interactions.
- [ ] Run focused tests and TypeScript.

### Task 2: Mutually exclusive entry orchestration

**Files:**
- Modify: `src/app/manage/page.tsx`
- Test: `src/app/manage/direct-entrance.test.ts`

**Interfaces:**
- Consumes: `beginToolLibraryHandoffEntrance()` and `getManageDirectEntrancePlan()`.
- Produces: mutually exclusive handoff and direct GSAP timelines.

- [ ] Write a failing integration contract test for the mutually exclusive branches and semantic selectors.
- [ ] Run it and observe the missing direct timeline failure.
- [ ] Keep the existing handoff branch unchanged and return before direct orchestration.
- [ ] Animate Sidebar, Navbar, header, table, rows, and pagination only in the direct branch.
- [ ] Run focused tests, TypeScript, and lint.

### Task 3: Browser verification

**Files:**
- Modify only files required by reproduced acceptance defects.

**Interfaces:**
- Consumes: Manage through direct URL, Sidebar navigation, and View All handoff.

- [ ] Verify direct desktop entry directions and no horizontal overflow.
- [ ] Verify mobile direct entry and absent persistent Sidebar.
- [ ] Verify View All retains current handoff without direct shell motion.
- [ ] Run production build, review diff, and commit intentional files.
