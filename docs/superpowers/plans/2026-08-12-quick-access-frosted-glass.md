# Quick Access Frosted Glass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply a tower-lit transparent frosted-glass material to Quick Access tiles without changing layout or behavior.

**Architecture:** Keep `QuickTile` as the interaction boundary. Add position metadata to its existing surface and implement the material entirely through scoped CSS, allowing light direction to vary without changing data flow.

**Tech Stack:** React 19, Next.js 16, CSS, Motion.

## Global Constraints

- Do not change dimensions, spacing, scrolling, ordering, links, or motion.
- App colors belong to icons only; Add Tool remains violet.
- No obvious outline or neon glow.
- Light and shadow must remain consistent with the central clock-tower source.

---

### Task 1: Lock the Quick Access material contract

**Files:**
- Modify: `src/app/dashboard/tool-icon-priority.test.ts`

**Interfaces:**
- Consumes: `QuickTile` markup and dashboard CSS.
- Produces: regression assertions for scoped glass classes and positional lighting metadata.

- [ ] Add assertions for `quick-access-glass`, `data-quick-light`, and unchanged responsive width/overflow behavior.
- [ ] Run `node --experimental-strip-types src/app/dashboard/tool-icon-priority.test.ts` and verify the new assertions fail because the material hooks are absent.

### Task 2: Implement the material and directional lighting

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/app/dashboard/dashboard.css`

**Interfaces:**
- Consumes: existing `QuickTile.index` and icon React node.
- Produces: `data-quick-light={index % 4}` and `.quick-access-glass` material styling.

- [ ] Add the scoped class and position variant to the existing QuickTile surface without changing its dimensions.
- [ ] Add neutral transparent fill, backdrop blur, restrained grain, internal highlight, contact edge, and per-position shadow variables in CSS.
- [ ] Run the focused test and verify it passes.

### Task 3: Verify behavior and appearance

**Files:**
- No production files added.

- [ ] Run all Quick Access and dashboard integration tests.
- [ ] Run `npx tsc --noEmit` and `npm run lint`.
- [ ] Verify `/dashboard` at desktop and responsive widths in a browser, checking no console errors and unchanged four-slot horizontal scrolling.
- [ ] Run `npm run build` and confirm all routes compile.
