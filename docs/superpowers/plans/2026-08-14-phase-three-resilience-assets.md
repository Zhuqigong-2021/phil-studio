# Phase 3: Resilience, Assets, and Database Verification

**Goal:** Improve code quality, resource loading, database access evidence, and failure recovery without changing product behavior, layout, visual styling, or animation timing.

**Success criteria:**
- ESLint completes with zero warnings and zero errors.
- Existing visual DOM/class contracts and motion constants remain unchanged.
- Dashboard image/font loading uses current Next.js 16 guidance without altering rendered geometry.
- Database indexes and query plans are measured; schema changes are made only when the plan demonstrates a useful missing index.
- Safe workspace GET requests retry transient failures only; writes are never automatically replayed.
- Failed edits remain in the Manage table and are visibly identified as unsaved without changing table layout.
- Focused tests, full tests, TypeScript, lint, production build, and desktop/mobile browser checks pass before deployment.

## Task 1: Eliminate the 21 lint warnings surgically

1. Add focused source/behavior tests for the warned effects and legacy music boundary.
2. Run them RED against the current warning-producing code.
3. Remove truly unused bindings, name intentionally ignored errors, replace no-op expressions, and correct effect dependencies without changing constants or rendering.
4. Run focused tests, TypeScript, and ESLint; require zero warnings.

## Task 2: Optimize images and fonts

1. Add integration assertions for background layers, avatar geometry, album-art geometry, and font variable availability.
2. Run RED against raw image elements or unnecessary loading behavior.
3. Migrate appropriate visual assets to Next Image using explicit sizes/preload rules while preserving class names, dimensions, object-fit, transforms, blur, and error fallback behavior.
4. Keep all fonts that are demonstrably used; remove only an unused font request if usage evidence permits it.
5. Run focused tests, TypeScript, lint, build, and desktop/mobile screenshots.

## Task 3: Verify and optimize database access

1. Capture current public indexes and EXPLAIN plans for the workspace snapshot paths.
2. Compare plans with repository filters/order/join patterns.
3. Add a migration only if a missing index or avoidable database round trip is proven; otherwise document the existing plan as already appropriate.
4. Run repository/API tests and re-run EXPLAIN after any approved migration.

## Task 4: Add safe read recovery and unsaved-edit feedback

1. Add RED tests for retry classification: retry network/408/429/5xx GET failures; never retry 4xx authorization/validation failures or any write.
2. Add RED tests proving transient retries are bounded, abort-aware, and return the final successful snapshot.
3. Add RED tests proving failed Manage updates retain drafts and expose an unsaved state without changing row structure.
4. Implement the smallest retry helper in the workspace read path and the smallest unsaved indicator in existing row status UI.
5. Run mutation, reducer, hook, toast, and API regressions.

## Task 5: Consolidated verification and release

1. Run focused tests after each task.
2. Run the complete test suite, `tsc --noEmit`, ESLint with zero warnings, and production build.
3. Verify Dashboard and Manage at desktop and mobile widths, including animations, music persistence, View All handoff, edit failure preservation, and successful database refresh without reload.
4. Inspect the final diff to exclude unrelated user files.
5. Commit only Phase 3 files, merge to `main`, push, and confirm the Vercel production deployment and production smoke test.
