# Dashboard Background Motion and Overlay Repair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add restrained cinematic motion to the dashboard photo while repairing the command palette stacking order and restoring rounded Sidebar navigation surfaces.

**Architecture:** Keep all visual work inside the existing dashboard route. Extract the photo stack into a focused `DashboardBackground` client component, use CSS for autonomous ambient loops, and use GSAP `quickTo` for bounded pointer parallax without React pointer-state renders. Repair the search palette by portaling it to `document.body`; repair Sidebar corners by assigning an explicit radius to both the item and its moving active layer.

**Tech Stack:** Next.js App Router, React client components, TypeScript, GSAP, Motion, Tailwind CSS, dashboard-scoped CSS, Node test runner.

## Global Constraints

- Keep `/backgrounds/dark-old-port-background-layout-final.png` and its current crop.
- Do not change dashboard layout, spacing, stacking, or card dimensions.
- Background layers remain `pointer-events: none` and behind dashboard content.
- Sharp-layer breathing lasts 20 seconds and stays between scale `1.02` and `1.045`.
- Pointer parallax is capped at 5px and disabled for coarse pointers and reduced motion.
- Water shimmer stays clipped to the lower water region and runs every 10 seconds at low opacity.
- Reduced-motion mode disables ambient loops and pointer parallax.
- Search palette and Sidebar repairs must not change their dimensions or content.

---

### Task 1: Lock Background Motion and UI Regression Requirements

**Files:**
- Create: `src/app/dashboard/background-motion.test.ts`
- Modify: `src/app/dashboard/overlay-layering.test.ts`

**Interfaces:**
- Consumes: dashboard source files as text.
- Produces: regression coverage for `DashboardBackground`, reduced-motion CSS, search portal mounting, palette layer order, and explicit Sidebar radii.

- [ ] **Step 1: Write failing source-wiring tests**

Add assertions that require:

```ts
assert.match(pageSource, /function DashboardBackground/);
assert.match(pageSource, /gsap\.quickTo/);
assert.match(cssSource, /@keyframes dashboard-background-breathe/);
assert.match(cssSource, /prefers-reduced-motion: reduce/);
assert.match(pageSource, /createPortal\([\s\S]*CommandPaletteDark/);
assert.match(pageSource, /className="dashboard-motion-root fixed inset-0 z-\[100\]/);
assert.match(pageSource, /borderRadius: emphasized \? 11 : 9/);
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```powershell
node --test src/app/dashboard/background-motion.test.ts src/app/dashboard/overlay-layering.test.ts
```

Expected: failures for missing background component/keyframes, missing search portal, incorrect `z-[80]`, and missing explicit Sidebar radius.

### Task 2: Repair Search Palette and Sidebar Corners

**Files:**
- Modify: `src/app/dashboard/page.tsx` in `NavItem`, `CommandPaletteDark`, and `GlobalSearchBar`.
- Test: `src/app/dashboard/overlay-layering.test.ts`

**Interfaces:**
- Consumes: `createPortal`, `CommandPaletteDark`, `NavItem` props.
- Produces: body-level palette overlay at `z-[100]`; Sidebar item and active indicator with identical numeric radius.

- [ ] **Step 1: Portal the command palette at the trigger call site**

Render the open palette with:

```tsx
{typeof document !== "undefined"
  ? createPortal(
      <AnimatePresence>{paletteOpen && <CommandPaletteDark {...props} />}</AnimatePresence>,
      document.body,
    )
  : null}
```

Use `z-[100]` on the fixed palette overlay so transformed dashboard entrance layers cannot cover it.

- [ ] **Step 2: Give each Sidebar surface an explicit shared radius**

Set the item and active layer from the same value:

```tsx
const radius = emphasized ? 11 : 9;
// item style
borderRadius: radius,
// active motion layer style
borderRadius: radius,
```

Do not add `overflow: hidden`, because it would clip Motion's shared-layout transition.

- [ ] **Step 3: Run focused tests and verify GREEN**

Run the two tests from Task 1. Expected: search and Sidebar assertions pass while background assertions remain RED until Task 3.

### Task 3: Implement Cinematic Background Motion

**Files:**
- Modify: `src/app/dashboard/page.tsx` to add and render `DashboardBackground`.
- Modify: `src/app/dashboard/dashboard.css` for ambient layers and accessibility fallbacks.
- Test: `src/app/dashboard/background-motion.test.ts`

**Interfaces:**
- Consumes: `imgBg`, `useReducedMotion`, GSAP, existing photo-light overlay markup.
- Produces: `DashboardBackground(): React.ReactElement` with refs for blur/sharp layers.

- [ ] **Step 1: Extract the existing photo stack without changing visual markup**

Move the current background wrapper and all photo/tint/light children into `DashboardBackground`. Preserve existing object-cover sizing, filters, opacity, light overlays, and mobile one-viewport cap.

- [ ] **Step 2: Add bounded GSAP pointer parallax**

Inside a layout effect, guard with reduced motion and `matchMedia("(hover: hover) and (pointer: fine)")`. Create `gsap.quickTo` setters for `x` and `y` on both image layers, normalize pointer coordinates to `[-1, 1]`, cap sharp movement at 5px, use opposite blur movement, and return both layers to zero on `pointerleave`. Remove listeners and kill setters during cleanup.

- [ ] **Step 3: Add CSS ambient motion and water shimmer**

Add `.dashboard-background-sharp`, `.dashboard-background-blur`, and `.dashboard-background-water-shimmer`. Animate only transforms and shimmer opacity/position. Preserve GSAP translations by placing CSS breathing on inner image nodes rather than the GSAP-controlled wrappers.

- [ ] **Step 4: Add entrance resolution and overlay depth**

Use a true 2.2-second CSS rack-focus entrance on the same fully visible image: animate blur through `32px`, `24px`, `8px`, and `0`, settle scale from `1.045` to `1.02`, and raise contrast from `0.92` to `1.1`. Do not use opacity crossfading. Add `backdrop-filter: blur(3px)` to command/modal/drawer backdrops through a scoped `.dashboard-overlay-backdrop` class, retaining their current background tint.


- [ ] **Step 5: Add reduced-motion and hidden-page behavior**

In reduced-motion CSS, set all background animation names to `none` and stable transforms. In the component, toggle a paused class from `visibilitychange` so ambient CSS animations pause while `document.hidden` is true.

- [ ] **Step 6: Run focused and static verification**

Run:

```powershell
node --test src/app/dashboard/background-motion.test.ts src/app/dashboard/overlay-layering.test.ts src/app/dashboard/premium-motion-wiring.test.ts
npx eslint src/app/dashboard/page.tsx src/app/dashboard/dashboard.css src/app/dashboard/background-motion.test.ts src/app/dashboard/overlay-layering.test.ts
npx tsc --noEmit --allowImportingTsExtensions
```

Expected: focused tests pass; ESLint has zero new errors; TypeScript reports no errors in modified dashboard files. Report unrelated existing failures separately.

- [ ] **Step 7: Perform visual acceptance**

At desktop width, verify that the command palette covers every stat card, every Sidebar item has 9px corners (11px for emphasized items), photo edges never enter the viewport, the shimmer remains below content, and reduced-motion mode is static.
