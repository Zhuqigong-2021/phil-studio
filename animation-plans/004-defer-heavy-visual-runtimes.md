# 004 — Defer heavy visual runtimes until needed

- **Status**: TODO
- **Commit**: 0572489
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 3 files, about 100 lines

## Problem

`src/app/dashboard/page.tsx:24-34` statically imports the full-screen WebGL cursor, Energy Sand, Magic Rings, Side Rays, and modal/transition surfaces into the initial client bundle. Several are only needed after interaction or only while the music surface is visible. `src/components/SplashCursor.jsx` is about 36 KB of source and starts a permanent WebGL loop.

## Target

Use top-level `next/dynamic` imports, following `node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md`, for heavy client-only visuals not required for first meaningful paint. Preserve exact rendered markup after loading. Use `ssr: false` only for browser/WebGL components. Keep geometry-preserving invisible fallbacks and pause WebGL/rAF while hidden or inactive.

## Repo conventions to follow

- Dynamic imports use explicit paths at module top level.
- Fallbacks occupy the same box with no text or layout shift.
- Existing reduced-motion and responsive rules remain authoritative.

## Steps

1. Add failing source-contract tests for dynamic loading and hidden-document pause behavior.
2. Dynamically import conditional WebGL/visual components with geometry-preserving fallbacks.
3. Start expensive loops only while their surface is visible and active; clean up on hide/unmount.
4. Preload conditional music visuals before activation only if latency is measurable.
5. Compare production route bundle output before and after.

## Boundaries

- Do NOT remove any visual or animation.
- Do NOT alter shader constants, density, colors, sizes, timing, layout, or responsive rules.
- Do NOT add user-visible loading UI or dependencies.

## Verification

- **Mechanical**: focused tests, `npx tsc --noEmit`, targeted ESLint, production build.
- **Feel check**: hard-refresh and activate every deferred surface; no flash, shift, missing frame, or delayed interaction.
- **Performance check**: smaller initial Dashboard client chunk and no expensive hidden-tab loop.
- **Done when**: bundle/runtime work is reduced and screenshots/interactions match baseline.

