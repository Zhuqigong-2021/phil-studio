# Lyrics Progress Ease Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Animate the playback progress/time group between its approved lyrics-hidden and lyrics-shown positions using a 400ms ease-in-out transform.

**Architecture:** Keep `showLyrics` as the only state source. A tiny pure helper maps that boolean to the approved transform/transition style, while one data attribute plus the existing dark-theme stylesheet supplies the reduced-motion override.

**Tech Stack:** React 19, Next.js 16, TypeScript/JSX, CSS media queries, Node test runner, ESLint.

## Global Constraints

- Preserve the exact `15px` position difference: hidden `-5px`, shown `10px`.
- Animate only the progress bar and elapsed/total time container.
- Use `400ms ease-in-out`.
- Disable the transition for `prefers-reduced-motion: reduce` without changing either final position.
- Do not add state, dependencies, animation libraries, or unrelated layout changes.

---

### Task 1: Progress position transition

**Files:**
- Create: `src/app/darktheme/lyrics-progress-motion.test.ts`
- Create: `src/app/darktheme/lyrics-progress-motion.ts`
- Modify: `src/app/darktheme/page.tsx:4292`
- Modify: `src/app/darktheme/darktheme.css`

**Interfaces:**
- Consumes: existing `showLyrics: boolean` state in `MusicPlayerPanel`.
- Produces: `getLyricsProgressMotion(showLyrics: boolean)`, `data-lyrics-progress-motion` marker, and reduced-motion CSS override.

- [x] **Step 1: Write the failing behavior regression test**

```ts
test("lyrics progress preserves both approved positions with 400ms ease-in-out", () => {
  assert.deepEqual(getLyricsProgressMotion(false), {
    position: "relative",
    transform: "translateY(-5px)",
    transition: "transform 400ms ease-in-out",
  });
  assert.deepEqual(getLyricsProgressMotion(true), {
    position: "relative",
    transform: "translateY(10px)",
    transition: "transform 400ms ease-in-out",
  });
});
```

- [x] **Step 2: Run the focused test and verify RED**

Run: `node --experimental-strip-types src/app/darktheme/lyrics-progress-motion.test.ts`

Expected: FAIL because `lyrics-progress-motion.ts` and `getLyricsProgressMotion` do not exist.

- [x] **Step 3: Implement the minimal transition**

```tsx
export function getLyricsProgressMotion(showLyrics: boolean) {
  return {
    position: "relative",
    transform: showLyrics ? "translateY(10px)" : "translateY(-5px)",
    transition: "transform 400ms ease-in-out",
  } as const;
}

<div
  data-lyrics-progress-motion
  className="flex-shrink-0"
  style={getLyricsProgressMotion(showLyrics)}
>
```

```css
@media (prefers-reduced-motion: reduce) {
  [data-lyrics-progress-motion] {
    transition: none !important;
  }
}
```

- [x] **Step 4: Verify GREEN and regressions**

Run the focused test, all `src/**/*.test.ts` tests, targeted ESLint for the three touched source/test files, and `npm run build`. Expected: zero test failures, zero ESLint errors, and successful production build.

- [x] **Step 5: Inspect the focused diff**

Confirm the diff changes only the progress/time wrapper, its reduced-motion override, the regression test, and related spec/plan documentation. Do not commit the dirty main worktree without explicit user authorization.

## Self-Review

- Spec coverage: positions, duration, easing, reduced motion, scope, and verification are covered by Task 1.
- Placeholder scan: no TBD, TODO, or deferred implementation remains.
- Type consistency: `showLyrics` remains boolean; all style values are CSS strings; the data attribute is presence-only.
