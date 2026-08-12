# Tool Library Scene Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a continuous Dashboard → Manage indigo/violet scene transition with proportionally responsive Tool Library content and database-timestamp-sorted Quick Access pins.

**Architecture:** Preserve `updated_at` as `Tool.updatedAt`, then make `selectPinnedTools` filter and sort authoritative tools rather than replaying pinned-ID order. Replace the dark transition veil with the same reusable gradient used by `/manage`, crossfading it over the Montréal photo while the cloned Tool Library changes bounds without child transforms. CSS container-responsive preview rules keep density proportional and reveal rows as space becomes available.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, GSAP, CSS container queries, Node test runner, Supabase/Postgres row mapping.

## Global Constraints

- Sidebar and Navbar stay fixed and clear throughout the transition.
- No unequal X/Y child scaling, pure-black intermediate frame, photo on `/manage`, or readable double-table overlap.
- Final background contains deep indigo, center blue-violet, upper-right violet, and restrained lower-center cyan.
- Quick Access is authoritative: pinned only, `updated_at DESC`, deterministic fallback.
- Preserve CRUD, loaders, Toasts, delete confirmation, pagination, and 10-row alignment.

---

### Task 1: Preserve timestamps and sort pinned tools

**Files:**
- Modify: `src/lib/dashboard/types.ts`
- Modify: `src/lib/dashboard/workspace-data.ts`
- Modify: `src/lib/dashboard/custom-tools.ts`
- Test: `src/lib/dashboard/workspace-data.test.ts`
- Test: `src/lib/dashboard/custom-tools.test.ts`

**Interfaces:**
- Produces: `Tool.updatedAt?: string`
- Produces: `selectPinnedTools<T extends { id: string; updatedAt?: string }>(tools, pinnedIds): T[]`

- [ ] **Step 1: Write failing timestamp mapping and ordering tests**

```ts
assert.equal(toolRowToTool(row, []).updatedAt, row.updated_at);
assert.deepEqual(
  selectPinnedTools([
    { id: "old", updatedAt: "2026-08-10T00:00:00Z" },
    { id: "newest", updatedAt: "2026-08-12T00:00:00Z" },
    { id: "new", updatedAt: "2026-08-11T00:00:00Z" },
  ], ["old", "new", "newest"]),
  [{ id: "newest", updatedAt: "2026-08-12T00:00:00Z" }, { id: "new", updatedAt: "2026-08-11T00:00:00Z" }, { id: "old", updatedAt: "2026-08-10T00:00:00Z" }],
);
```

- [ ] **Step 2: Run RED**

Run: `node --test --experimental-strip-types src/lib/dashboard/workspace-data.test.ts src/lib/dashboard/custom-tools.test.ts`
Expected: timestamp missing and old pinned-ID ordering returned.

- [ ] **Step 3: Add `updatedAt` mapping and stable descending comparator**

Map `row.updated_at` in `toolRowToTool`. In `selectPinnedTools`, filter through a pinned set, retain each tool's source index, sort valid timestamps descending, then source index and ID for equal/missing timestamps.

- [ ] **Step 4: Run GREEN and mutation regressions**

Run: `node --test --experimental-strip-types src/lib/dashboard/workspace-data.test.ts src/lib/dashboard/custom-tools.test.ts src/hooks/useCustomTools.test.ts src/hooks/useCustomTools.supabase.test.ts`
Expected: all pass; authoritative create/update/refetch retains timestamp ordering.

- [ ] **Step 5: Commit**

```bash
git add src/lib/dashboard/types.ts src/lib/dashboard/workspace-data.ts src/lib/dashboard/custom-tools.ts src/lib/dashboard/workspace-data.test.ts src/lib/dashboard/custom-tools.test.ts
git commit -m "Sort pinned tools by database update time"
```

### Task 2: Build one reusable indigo/violet scene background

**Files:**
- Modify: `src/app/dashboard/dashboard.css`
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/lib/dashboard/tool-transition.ts`
- Test: `src/app/manage/dashboard-shell-integration.test.ts`
- Test: `src/lib/dashboard/tool-transition.test.ts`

**Interfaces:**
- Produces CSS class: `.manage-scene-background`
- Consumes that class from both `[data-manage-background]` and `[data-tool-library-transition-veil]`

- [ ] **Step 1: Write failing shared-background contracts**

Assert that the Dashboard background and transition veil use the same class, the class contains multiple indigo/violet/cyan radial gradients, and the veil does not use a separate dark inline background.

- [ ] **Step 2: Run RED**

Run: `node --test --experimental-strip-types src/app/manage/dashboard-shell-integration.test.ts src/lib/dashboard/tool-transition.test.ts`
Expected: shared class is absent and veil still owns the dark inline gradient.

- [ ] **Step 3: Implement the shared scene and dissolve**

Create `.manage-scene-background` with opaque layered gradients. Apply it to `/manage`. During transition, animate the main Dashboard content toward blur/opacity while the scene layer fades from 0 to 1 over 0.48s; leave Sidebar/Navbar outside both targets. Remove inline veil background and make cleanup idempotent.

- [ ] **Step 4: Run GREEN**

Run the two focused test files. Expected: all pass, including reduced motion and lock lifecycle.

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/dashboard.css src/app/dashboard/page.tsx src/lib/dashboard/tool-transition.ts src/app/manage/dashboard-shell-integration.test.ts src/lib/dashboard/tool-transition.test.ts
git commit -m "Crossfade dashboard into manage scene"
```

### Task 3: Make the shared Tool Library density responsive

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/app/dashboard/dashboard.css`
- Modify: `src/lib/dashboard/tool-transition.ts`
- Test: `src/app/manage/dashboard-shell-integration.test.ts`
- Test: `src/lib/dashboard/tool-transition.test.ts`

**Interfaces:**
- Consumes: bounds-only `ToolTransitionPlan` with `scaleX: 1`, `scaleY: 1`
- Produces: `[data-tool-library-morph-preview]` whose typography/rows respond to overlay container size

- [ ] **Step 1: Write failing responsive-preview tests**

Assert preview renders up to ten rows, CSS declares `container-type: inline-size`, typography/row dimensions use `clamp()`/container units, and transition code never assigns non-unit child scale.

- [ ] **Step 2: Run RED**

Run the transition and shell integration tests. Expected: preview is limited to six fixed-size rows.

- [ ] **Step 3: Implement responsive density and single handoff**

Render ten preview rows and use container-responsive header, columns, font sizes, gaps, and row height. Use overflow clipping at the small source bounds so rows reveal as height grows. Keep the preview surface opaque and delay real-table visibility until the overlay begins its final fade, preventing readable overlap.

- [ ] **Step 4: Run focused GREEN and static gates**

Run: `node --test --experimental-strip-types src/lib/dashboard/tool-transition.test.ts src/app/manage/dashboard-shell-integration.test.ts src/components/dashboard/manage/manage-controls.test.ts`

Run: `npx tsc --noEmit`

Run targeted ESLint on changed TypeScript files. Expected: zero errors.

- [ ] **Step 5: Browser acceptance**

At 1880×880, record Sidebar/Navbar rectangles before click and at ~250ms; values must match. Inspect frames near 150ms, 350ms, 600ms: photo decreases as violet/indigo increases; text/icons are not stretched; only one readable table exists. Confirm final Manage has no photograph and Quick Access newest pinned tool is first after authoritative refresh.

- [ ] **Step 6: Production build and commit**

Run: `npm run build`
Expected: compile, TypeScript, and 14/14 page generation succeed.

```bash
git add src/app/dashboard/page.tsx src/app/dashboard/dashboard.css src/lib/dashboard/tool-transition.ts src/lib/dashboard/tool-transition.test.ts src/app/manage/dashboard-shell-integration.test.ts
git commit -m "Refine responsive tool library handoff"
```
