# Phase One Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Reduce animation, React rendering, media delivery, and workspace synchronization cost without changing the current visual design or product behavior.

**Architecture:** Preserve all existing DOM classes, visual constants, animation timing, and optimistic interaction behavior. Move repeated frame work into cached pure helpers, isolate rendering subscriptions at existing component boundaries, normalize only the two anomalously large audio assets, and make post-mutation reconciliation conditional rather than unconditional.

**Tech Stack:** Next.js 16.2.10 App Router, React 19.2.4, TypeScript, GSAP, Motion, WebGL, Supabase Postgres, Node test runner.

## Global Constraints

- No visual, layout, copy, animation timing, color, or behavior changes.
- No new runtime dependencies.
- Keep database updates visible immediately without page reload.
- Preserve focus/visibility reconciliation and stale-response protection.
- Do not modify unrelated untracked files.
- Every behavior change follows RED -> GREEN verification.

---

### Task 1: Performance baseline

**Files:**
- Create: `docs/performance/phase-one-baseline.md`

- [ ] Capture production route resource counts, transferred bytes, long tasks, animation frame timing, and current media sizes.
- [ ] Record the exact browser viewport, URL, commit, and measurement limitations.
- [ ] Use this as the comparison gate after implementation.

### Task 2: Lighthouse edge frame scheduler

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/lib/dashboard/lighthouse-edge.ts`
- Test: `src/lib/dashboard/lighthouse-edge.test.ts`
- Test: `src/app/dashboard/lighthouse-edge-highlight.integration.test.ts`

- [ ] Add failing tests for capped hit-testing cadence and DOM-write thresholds.
- [ ] Confirm RED failures describe missing scheduler behavior.
- [ ] Implement pure frame scheduling and reuse cached beacon/card geometry.
- [ ] Keep beam geometry, colors, response values, CSS animation, and visible output unchanged.
- [ ] Confirm focused tests pass.

### Task 3: Dashboard render subscription boundaries

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Create or modify focused components under `src/components/dashboard/`
- Test: focused dashboard integration tests

- [ ] Add a failing architecture test proving high-frequency music timing and workspace state do not subscribe unrelated page sections.
- [ ] Extract existing component bodies without changing their rendered DOM or class names.
- [ ] Pass narrow primitive/derived props rather than the full workspace object where possible.
- [ ] Confirm existing dashboard motion and interaction tests pass.

### Task 4: Normalize anomalously large audio assets

**Files:**
- Modify: `public/music/七里香.mp3`
- Modify: `public/music/黑色毛衣.mp3`
- Test: `src/lib/dashboard/music-assets.integration.test.ts`
- Update: `docs/performance/phase-one-baseline.md`

- [ ] Add failing size/codec acceptance checks for the two assets.
- [ ] Re-encode both to browser-safe MP3, 44.1 kHz stereo, 192 kbps.
- [ ] Verify decoding and playback-time advancement in Chromium.
- [ ] Verify their lyric APIs still return timelines.
- [ ] Record before/after sizes.

### Task 5: Conditional workspace reconciliation

**Files:**
- Modify: `src/hooks/useCustomTools.ts`
- Test: `src/hooks/useCustomTools.test.ts`
- Test: `src/hooks/useCustomTools.supabase.test.ts`

- [ ] Add failing tests proving authoritative mutation responses do not immediately schedule a full snapshot fetch.
- [ ] Preserve optimistic application, rollback, stale mutation guards, focus refresh, and recovery after partial success.
- [ ] Reconcile only when the mutation result is incomplete/uncertain or the staleness window is reached.
- [ ] Confirm all workspace hook/API tests pass.

### Task 6: Final verification

- [ ] Run focused test suites for all five tasks.
- [ ] Run `npx tsc --noEmit`.
- [x] Run targeted ESLint, then full lint.
- [x] Run production build with network access for Google Fonts.
- [x] Repeat the production browser measurements and document the comparison.
- [x] Inspect the final diff for visual constants and unrelated changes.
