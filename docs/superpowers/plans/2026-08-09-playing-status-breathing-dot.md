# Playing Status Breathing Dot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the top-right five-bar equalizer with the approved cyan breathing-dot playback status.

**Architecture:** Keep `isPlaying` as the only state source. A pure class-name helper maps the boolean state to active or paused styling; one stable three-span indicator remains mounted while CSS owns the bounded ring motion and reduced-motion behavior.

**Tech Stack:** React 19, Next.js 16, TypeScript/JSX, CSS keyframes, Node test runner, ESLint.

## Global Constraints

- Use a `9px` cyan core and two thin blue-to-violet rings in the current top-right anchor.
- Playing uses staggered `1.8s ease-in-out` breathing; paused uses a subdued static outline.
- State presentation transitions over `240ms ease-out`.
- Reduced motion disables breathing without hiding the status.
- Preserve the card layout, lower-left V5 visualizer, and every playback control.
- Add no state, timer, canvas, audio dependency, animation library, or custom SVG.

---

### Task 1: Replace equalizer with playback status

**Files:**
- Create: `src/app/darktheme/playing-status.test.ts`
- Create: `src/app/darktheme/playing-status.ts`
- Modify: `src/app/darktheme/page.tsx:1992-2003,4163-4190`
- Modify: `src/app/darktheme/darktheme.css:189-211`

**Interfaces:**
- Consumes: `isPlaying: boolean` from `MusicPlayerPanel`.
- Produces: `getPlayingStatusClassName(isPlaying: boolean): string` and stable `.playing-status` markup.

- [x] **Step 1: Write a failing behavior test**

```ts
test("playing status maps playback state without remounting its structure", () => {
  assert.equal(getPlayingStatusClassName(true), "playing-status playing-status--active");
  assert.equal(getPlayingStatusClassName(false), "playing-status playing-status--paused");
});
```

- [x] **Step 2: Verify RED**

Run `node --experimental-strip-types src/app/darktheme/playing-status.test.ts`. Expected: FAIL because the helper does not exist, then fail behaviorally against a temporary baseline mapping before feature code is written.

- [x] **Step 3: Implement the state helper and stable indicator**

```ts
export function getPlayingStatusClassName(isPlaying: boolean): string {
  return `playing-status playing-status--${isPlaying ? "active" : "paused"}`;
}
```

```tsx
<div className={getPlayingStatusClassName(isPlaying)} aria-hidden="true">
  <span className="playing-status__ring playing-status__ring--inner" />
  <span className="playing-status__ring playing-status__ring--outer" />
  <span className="playing-status__core" />
</div>
```

Remove `EQUALIZER_NEON_COLORS`, `EQUALIZER_DURATIONS`, the five-bar map, and `music-bar-jump` when no longer referenced.

- [x] **Step 4: Implement bounded CSS states**

Use a fixed `28px` indicator box, absolute rings, `9px` core, `1.8s ease-in-out` staggered scale/opacity keyframes, `240ms ease-out` transitions, paused static ring opacity, and a reduced-motion override that disables animation.

- [x] **Step 5: Verify and inspect**

Run the focused test, every `src/**/*.test.ts`, targeted ESLint, and `npm run build`. Inspect the focused diff to confirm the equalizer removal and no unrelated layout changes. Do not commit the dirty main worktree without explicit authorization.

## Self-Review

- Spec coverage: active, paused, reduced-motion, layout, accessibility, and stability requirements are covered.
- Placeholder scan: no TBD or deferred behavior remains.
- Type consistency: the helper consumes and maps only the existing boolean `isPlaying`.
