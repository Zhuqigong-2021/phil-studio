# Dashboard Stat Card Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the five stat cards' bright double Indigo outline with a restrained glass selection treatment while preserving keyboard focus visibility and layout stability.

**Architecture:** Keep the existing `StatCard` and shared Motion `layoutId` indicator. Change only the indicator's visual tokens and add source-level regression assertions that distinguish selection styling from keyboard `:focus-visible` accessibility styling.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Motion, dashboard-scoped CSS, Node test runner.

## Global Constraints

- Preserve all five card dimensions, spacing, icons, values, labels, hover behavior, and panel switching.
- Use one inner border: `rgba(139, 122, 246, 0.48)`.
- Use top highlight: `inset 0 1px 0 rgba(255, 255, 255, 0.12)`.
- Use exterior depth: `0 0 0 1px rgba(129, 107, 255, 0.12), 0 8px 24px rgba(79, 55, 180, 0.16)`.
- Do not scale or move the selected card.
- Preserve a separate keyboard-only `:focus-visible` ring.
- Reduced motion must retain the final selected appearance without spatial interpolation.

---

### Task 1: Refine the Shared Stat Selection Surface

**Files:**
- Modify: `src/app/dashboard/page.tsx:591-602`
- Modify: `src/app/dashboard/dashboard.css`
- Modify: `src/app/dashboard/premium-motion-wiring.test.ts`

**Interfaces:**
- Consumes: `StatCard({ active, onClick })` and `layoutId="dashboard-active-stat"`.
- Produces: `.stat-card-selection` shared indicator and `.stat-card:focus-visible` accessibility state.

- [ ] **Step 1: Write the failing selection-style test**

Add assertions to `premium-motion-wiring.test.ts` requiring:

```ts
assert.match(pageSource, /className="stat-card-selection pointer-events-none/);
assert.match(pageSource, /rgba\(139, 122, 246, 0\.48\)/);
assert.match(pageSource, /inset 0 1px 0 rgba\(255, 255, 255, 0\.12\)/);
assert.match(pageSource, /0 8px 24px rgba\(79, 55, 180, 0\.16\)/);
assert.doesNotMatch(pageSource, /inset 0 0 0 1px rgba\(181,151,255,0\.58\)/);
assert.match(cssSource, /\.stat-card:focus-visible/);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
node --experimental-strip-types --test src/app/dashboard/premium-motion-wiring.test.ts
```

Expected: FAIL because the current shared indicator still contains the old bright outline and no dedicated `.stat-card:focus-visible` rule.

- [ ] **Step 3: Implement the restrained glass selection**

Give the shared indicator the class `stat-card-selection`, use a low-opacity Indigo-to-cyan fill, one inner Indigo hairline, the approved top highlight, and the approved soft exterior depth shadow. Keep `inset-[1px]`, `rounded-[15px]`, `pointer-events-none`, and the existing shared `layoutId`.

Add dashboard-scoped CSS:

```css
.dashboard-motion-root .stat-card:focus-visible {
  outline: 2px solid rgba(196, 181, 253, 0.9);
  outline-offset: 3px;
}
```

Do not add transforms to `.stat-card-selection` or the selected card.

- [ ] **Step 4: Run focused regression checks and verify GREEN**

Run:

```powershell
node --experimental-strip-types --test src/app/dashboard/premium-motion-wiring.test.ts src/app/dashboard/overlay-layering.test.ts src/lib/auth/logout-flow.test.ts
npx eslint src/app/dashboard/page.tsx src/app/dashboard/premium-motion-wiring.test.ts
```

Expected: all focused tests pass; ESLint reports zero errors, with only previously known warnings in `page.tsx`.

- [ ] **Step 5: Verify the production build**

Run:

```powershell
npm run build
```

Expected: Next.js production build completes successfully.
