# Dashboard Entrance Orchestration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic Dashboard load fade with directional section entrances and a sequenced greeting animation.

**Architecture:** A pure motion-plan module defines one GSAP timeline contract for semantic page regions. A focused greeting component owns the one-shot typewriter, Dia highlight trigger, and location bounce handoff, while the Dashboard shell only supplies semantic data hooks.

**Tech Stack:** React 19, GSAP 3, Motion 13, Next.js 16, Node test runner.

## Global Constraints

- Apply only to `/dashboard`; do not alter Manage transitions.
- Match the existing background focus duration at approximately 1.6 seconds.
- Preserve existing statistic number tickers and all current interactions.
- Use transform and opacity for section entrances and honor reduced motion.
- Do not restart animations after database-driven rerenders.

---

### Task 1: Directional Dashboard timeline

**Files:**
- Modify: `src/lib/dashboard/motion-system.ts`
- Modify: `src/app/dashboard/page.tsx`
- Test: `src/lib/dashboard/dashboard-entrance-orchestration.test.ts`

**Interfaces:**
- Produces: `getDashboardEntranceTimeline(reduced): DashboardEntranceTimeline`
- Consumes: semantic hooks `data-dashboard-navbar`, `data-dashboard-sidebar`, `data-dashboard-utilities`, `data-dashboard-stats`, and `data-dashboard-bottom`.

- [ ] Write literal tests for each direction, shared duration, easing, and reduced-motion values.
- [ ] Run the test and observe the missing timeline API failure.
- [ ] Implement the minimal pure timeline plan.
- [ ] Replace the generic selector animation with one GSAP timeline using the semantic hooks.
- [ ] Run focused tests and TypeScript.

### Task 2: Greeting narrative sequence

**Files:**
- Create: `src/components/dashboard/DashboardGreeting.tsx`
- Create: `src/components/dashboard/dashboard-greeting-state.ts`
- Modify: `src/components/magicui/DiaTextReveal.tsx`
- Modify: `src/app/dashboard/page.tsx`
- Test: `src/components/dashboard/dashboard-greeting-state.test.ts`
- Test: `src/components/dashboard/DashboardGreeting.integration.test.ts`

**Interfaces:**
- Produces: `DashboardGreeting` and `getTypedText(text, elapsedMs, characterMs)`.
- Consumes: controlled `DiaTextReveal active` state after typing completes.

- [ ] Write failing tests for character progression, completion, semantic ordering, and reduced-motion fallback.
- [ ] Run tests and observe missing helper/component failures.
- [ ] Implement the typewriter and controlled Dia sweep.
- [ ] Trigger a GSAP decaying location bounce only after the sweep completes.
- [ ] Replace the greeting JSX without changing layout copy or styling.
- [ ] Run focused tests, TypeScript, and lint.

### Task 3: Browser and production verification

**Files:**
- Modify only files required by defects reproduced during acceptance.

**Interfaces:**
- Consumes: the completed Dashboard page.
- Produces: desktop/mobile acceptance evidence.

- [ ] Verify desktop directions, greeting order, no hydration overlay, and no replay after data settles.
- [ ] Verify mobile overflow and reduced-motion final state.
- [ ] Run the focused suite, TypeScript, lint, and production build.
- [ ] Review the final diff and commit only intentional files.
