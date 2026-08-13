# 002 — Cache lighthouse edge geometry and DOM references

- **Status**: TODO
- **Commit**: 0572489
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 2 files, about 120 lines

## Problem

`src/app/dashboard/page.tsx:331-411` performs DOM discovery, layout reads, SVG path measurement, and SVG writes for every highlighted card on every animation frame. It repeatedly calls `querySelectorAll`, `getBoundingClientRect`, `getComputedStyle`, `getTotalLength`, then interleaves those reads with style and attribute writes. This can force synchronous layout while the lighthouse beam sweeps.

## Target

Preserve the exact timing, geometry, colors, edge width, falloff, desktop breakpoint, and reduced-motion behavior. Cache card/SVG references and static geometry. Recalculate card rectangles, rounded path data, path length, and perimeter only on build, `ResizeObserver`, window resize, or layout change. Each frame may read the beam transform and beacon position, calculate intersections, then batch only dynamic opacity, gradient center/radius, dasharray, and dashoffset writes. Pause while the document is hidden and resume without jumping.

## Repo conventions to follow

- Keep the current dashboard entrance and transition events in `src/app/dashboard/page.tsx:457-474`.
- Keep the 1280px desktop and reduced-motion gates unchanged.
- Put pure geometry helpers in `src/lib/dashboard/lighthouse-edge.ts` and test them with Node's test runner.

## Steps

1. Add failing tests for cached geometry and dynamic hit-state calculations.
2. Extract pure geometry calculations.
3. Replace per-frame element queries/path measurements with a cache refreshed by `ResizeObserver` and resize.
4. Split each frame into read/calculation and write phases.
5. Add `visibilitychange` pause/resume handling and cleanup.
6. Extend the integration test to lock the cache, observer, and visibility behavior.

## Boundaries

- Do NOT change gradient stops, opacity, blur, stroke width, beam angle, response speed, breakpoint, or duration.
- Do NOT change dashboard markup outside the edge overlay.
- Do NOT modify database, ordering, music, or navigation behavior.
- Do NOT add dependencies.

## Verification

- **Mechanical**: focused lighthouse tests, `npx tsc --noEmit`, and targeted ESLint.
- **Feel check**: compare the sweep before/after at normal speed and 10% playback; contact position, illuminated width, and fades must match.
- **Performance check**: Chrome Performance must no longer show repeated selector discovery or SVG path measurement in the steady-state loop.
- **Done when**: tests pass, no visual constants changed, and steady-state frames only mutate dynamic highlight values.

