# Phase Two Performance and RPC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce Dashboard render work and workspace database round trips while preserving every current function, layout, visual, and animation behavior.

**Architecture:** Implement two independently releasable batches. Batch 1 narrows client subscriptions, shares only equivalent GET requests, rejects stale reads, adjusts audio preload, and locks the existing update RPC contract. After its full acceptance gate passes, Batch 2 adds additive snapshot/create RPCs and carefully isolates expensive Dashboard runtimes behind unchanged DOM and motion contracts.

**Tech Stack:** Next.js 16.2.10 App Router, React 19.2.4, TypeScript, Supabase/Postgres, GSAP, Motion, WebGL/OGL/Three.js, Node test runner, Playwright browser verification.

## Global Constraints

- Preserve product behavior, layout, copy, visual styling, animation timing, interaction semantics, DOM hooks, CSS classes, data attributes, GSAP selectors, breakpoints, image crop, shaders, and visual constants.
- Never cancel, deduplicate, or automatically retry writes; request sharing and supersession apply only to idempotent GET reads.
- Preserve immediate optimistic UI reconciliation without page reloads.
- All database RPCs use `SECURITY INVOKER`, `set search_path = ''`, strict owner validation, revoked `public`/`anon`/`authenticated` execution, and `service_role`-only grants.
- Do not stage unrelated untracked screenshots, logs, music files, or user artifacts.
- Read the relevant local Next.js 16 guides in `node_modules/next/dist/docs/` before changing client boundaries or lazy loading.
- Do not apply a live Supabase migration or deploy production without a separate explicit confirmation.

---

### Task 1: Establish Batch 1 baselines and workspace selector contracts

**Files:**
- Modify: `src/hooks/workspace-surfaces.test.ts`
- Modify: `src/app/dashboard/database-dashboard-state.test.ts`
- Create: `docs/performance/phase-two-baseline.md`

**Interfaces:**
- Consumes: Current `useCustomTools()` result and `DashboardWorkspaceContext` value.
- Produces: Named selector contracts for tools, categories, pinned tools, favorites, pending state, and stable actions; recorded pre-change network/render/browser evidence.

- [ ] **Step 1: Record a reproducible baseline**

Document the current authenticated Dashboard/Manage request count, console state, stable desktop/tablet/mobile screenshots, View All transition checkpoints, music/lyrics behavior, and current focused/full test commands in `docs/performance/phase-two-baseline.md`.

- [ ] **Step 2: Write failing selector-boundary tests**

Add source/behavior assertions requiring purpose-specific context hooks such as `useDashboardTools()`, `useDashboardCategories()`, `useDashboardPinnedTools()`, `useDashboardFavorites()`, `useDashboardPendingState()`, and `useDashboardWorkspaceActions()` rather than a single mutable context value.

- [ ] **Step 3: Run the focused tests and verify RED**

Run the two test files directly with Node's TypeScript stripping support. Expected: failure because the narrow selector interfaces do not yet exist.

- [ ] **Step 4: Commit the baseline tests and evidence**

Commit only the two test files and baseline document with message `test: establish phase two workspace baseline`.

### Task 2: Split broad workspace subscriptions

**Files:**
- Create: `src/components/dashboard/DashboardWorkspaceProvider.tsx`
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/hooks/workspace-surfaces.test.ts`
- Modify: `src/app/dashboard/database-dashboard-state.test.ts`

**Interfaces:**
- Consumes: `ReturnType<typeof useCustomTools>`.
- Produces: `useDashboardTools(): Tool[]`, `useDashboardCategories(): readonly string[]`, `useDashboardPinnedTools(): Tool[]`, `useDashboardFavorites(): Tool[]`, `useDashboardPendingState(): DashboardPendingState`, and `useDashboardWorkspaceActions(): DashboardWorkspaceActions`.

- [ ] **Step 1: Implement the minimal provider split**

Move only the existing Dashboard workspace context boundary into the focused provider file. Memoize each derived value and keep action identities stable. Do not alter rendered markup below consumers.

- [ ] **Step 2: Replace broad consumers with the narrowest hook**

Update Dashboard consumers one at a time. A component displaying pinned tools must not subscribe to category or pending changes; action-only consumers must not subscribe to tool arrays.

- [ ] **Step 3: Run focused tests and verify GREEN**

Expected: selector-boundary tests pass, existing workspace surface tests pass, and no changed DOM/class/selector assertion fails.

- [ ] **Step 4: Run TypeScript and targeted lint**

Expected: zero TypeScript errors and zero new lint errors in changed files.

- [ ] **Step 5: Commit**

Commit the focused provider and consumer changes with message `perf: narrow dashboard workspace subscriptions`.

### Task 3: Share equivalent GET requests and reject stale reads

**Files:**
- Create: `src/lib/dashboard/workspace-read-coordinator.ts`
- Create: `src/lib/dashboard/workspace-read-coordinator.test.ts`
- Modify: `src/hooks/useCustomTools.ts`
- Modify: `src/hooks/useCustomTools.test.ts`
- Modify: `src/hooks/useCustomTools.supabase.test.ts`

**Interfaces:**
- Produces: `createWorkspaceReadCoordinator<T>()` with `read(key, loader)`, `invalidate()`, `isCurrent(generation)`, and no write APIs.
- Consumes: Existing `fetchWorkspaceSnapshot` GET loader and current hook reconciliation functions.

- [ ] **Step 1: Write failing pure coordinator tests**

Cover two equivalent concurrent GETs sharing one promise, a different key starting a new read, invalidation making an older result stale, a stale rejection being ignored by reconciliation, and a fresh failure remaining reportable.

- [ ] **Step 2: Run the coordinator tests and verify RED**

Expected: module-not-found or missing-export failure.

- [ ] **Step 3: Implement the minimal coordinator**

Use an in-flight map plus monotonic generation. Clear a promise only if the settling promise is still the map's current value. Do not add `AbortController` to mutation paths.

- [ ] **Step 4: Integrate reads in `useCustomTools`**

Route initial load, focus refresh, Dashboard/Manage duplicate load, and manual refresh through the coordinator. Preserve the last good snapshot while a new read is pending and suppress stale error toasts.

- [ ] **Step 5: Run focused and existing hook tests**

Expected: all coordinator, `useCustomTools`, and Supabase workspace hook tests pass.

- [ ] **Step 6: Commit**

Commit with message `perf: coordinate workspace snapshot reads`.

### Task 4: Limit audio preloading without changing playback

**Files:**
- Modify: `src/components/dashboard/PersistentMusicProvider.tsx`
- Modify: `src/components/dashboard/PersistentMusicProvider.integration.test.ts`
- Modify: `src/lib/dashboard/music-assets.integration.test.ts`

**Interfaces:**
- Consumes: Current track index and playlist.
- Produces: current `<audio preload="auto">`, one next-track metadata preloader, and no preload elements for later tracks.

- [ ] **Step 1: Write failing preload-policy tests**

Assert the current track stays playback-ready, only the next track receives metadata preload, later tracks are not prefetched, and wrap-around identifies the first track as next from the last track.

- [ ] **Step 2: Run focused tests and verify RED**

Expected: current provider does not express the required one-next-track policy.

- [ ] **Step 3: Implement the policy**

Keep the persistent current audio element and event lifecycle unchanged. Add only one metadata preloader keyed to the next track and remove any broader eager preload path.

- [ ] **Step 4: Run music regressions**

Run provider, preferences, playlist control, lyrics lifecycle, deployment asset, and gesture tests. Expected: all pass.

- [ ] **Step 5: Commit**

Commit with message `perf: limit dashboard audio preloading`.

### Task 5: Validate the existing atomic update RPC

**Files:**
- Modify: `src/lib/dashboard/workspace-repository.test.ts`
- Create: `supabase/migrations/20260811041559_add_atomic_workspace_patch.test.ts`
- Modify only if a test proves necessary: `supabase/migrations/20260811041559_add_atomic_workspace_patch.sql`

**Interfaces:**
- Consumes: `patch_workspace_tool(text, text, jsonb, uuid[], boolean, timestamptz)`.
- Produces: Contract evidence for atomic field/category updates, owner isolation, rollback, and service-role-only execution.

- [ ] **Step 1: Add failing contract assertions**

Assert `security invoker`, empty search path, strict owner check, unsupported patch rejection, category ownership and duplicate checks before mutation, transactional category replacement, and revoked public roles.

- [ ] **Step 2: Run tests and verify RED only where coverage finds a gap**

If the existing SQL already satisfies a contract, retain it unchanged. A RED result must identify a concrete missing guarantee rather than force a rewrite.

- [ ] **Step 3: Make the smallest SQL or repository correction**

Change the existing migration only when required for a missing contract; otherwise add tests only.

- [ ] **Step 4: Run repository and migration contract tests**

Expected: all pass.

- [ ] **Step 5: Commit**

Commit with message `test: lock atomic workspace update contract`.

### Task 6: Run Batch 1 acceptance gate

**Files:**
- Modify: `docs/performance/phase-two-baseline.md`
- Create: `docs/performance/phase-two-batch-one-report.md`

**Interfaces:**
- Consumes: Tasks 1–5.
- Produces: Explicit GO/NO-GO decision for Batch 2.

- [ ] **Step 1: Run automated gates**

Run focused tests, relevant existing tests, `npx tsc --noEmit`, `npm run lint`, and `npm run build`. Record exact commands and outcomes.

- [ ] **Step 2: Run authenticated browser CRUD and no-reload checks**

Verify create, update, delete, pin, favorite, alias, categories, toasts, spinners, failure behavior, and immediate authoritative reconciliation.

- [ ] **Step 3: Run visual and animation checks**

Compare stable desktop/tablet/mobile screenshots and View All transition checkpoints. Verify Dashboard entrance, direct Manage entrance, shared-surface transition, lighthouse, card-edge illumination, All Tools marquee, reduced motion, music, lyrics, and cross-route persistence.

- [ ] **Step 4: Compare console and network evidence**

Confirm no new console error and no increased GET count; record shared-request evidence.

- [ ] **Step 5: Decide**

Set the report to `GO` only if every required check passes. Otherwise set `NO-GO`, fix or revert the smallest responsible change, and repeat the gate before Task 7.

- [ ] **Step 6: Commit the gate report**

Commit with message `test: verify phase two low risk optimizations`.

### Task 7: Add snapshot and atomic-create RPC migrations

**Files:**
- Create via Supabase CLI: the exact output path returned by `supabase migration new add_workspace_snapshot_rpc`
- Create via Supabase CLI: the exact output path returned by `supabase migration new add_atomic_workspace_create`
- Create: `supabase/migrations/workspace_rpc_contracts.test.ts`
- Modify: `src/lib/supabase/database.types.ts`

**Interfaces:**
- Produces: `get_workspace_snapshot(p_owner_email text) returns jsonb` and `create_workspace_tool(p_owner_email text, p_tool jsonb, p_category_ids uuid[]) returns public.tools`.
- Consumes: Existing `tools`, `categories`, and `tool_categories` schema and owner rules.

- [ ] **Step 1: Check current Supabase CLI/docs and generate migration names**

Run `supabase --help`, `supabase migration --help`, and `supabase migration new --help`; fetch current Supabase changelog/docs for Postgres functions and RPC security. Create filenames only through `supabase migration new`.

- [ ] **Step 2: Write failing SQL contract tests**

Cover exact signatures, `security invoker`, empty search path, owner filtering, deterministic ordering, empty JSON arrays, permitted fields, category ownership, duplicate IDs, rollback, and execution grants.

- [ ] **Step 3: Run contract tests and verify RED**

Expected: missing-function failures.

- [ ] **Step 4: Implement `get_workspace_snapshot`**

Build one JSON object with `tools`, `categories`, and `relationships` arrays using fully qualified identifiers and deterministic ordering matching the repository contract.

- [ ] **Step 5: Implement `create_workspace_tool`**

Validate all input before insert, insert the tool and relationships inside the function transaction, and return the created row. Revoke default access and grant only `service_role`.

- [ ] **Step 6: Update generated database types**

Add the exact RPC signatures and JSON return type without weakening existing table types.

- [ ] **Step 7: Run SQL contract tests and advisors on a non-production database**

Expected: all RPC cases pass and no new security/performance advisor finding remains.

- [ ] **Step 8: Commit**

Commit with message `perf: add atomic workspace RPCs`.

### Task 8: Integrate RPCs with tested fallback and unchanged API contracts

**Files:**
- Modify: `src/lib/dashboard/workspace-repository.ts`
- Modify: `src/lib/dashboard/workspace-repository.test.ts`
- Modify: `src/lib/dashboard/workspace-data.ts`
- Modify: `src/hooks/useCustomTools.supabase.test.ts`

**Interfaces:**
- Consumes: `get_workspace_snapshot` and `create_workspace_tool` from Task 7.
- Produces: One-call snapshot reads and atomic creates while returning the existing `WorkspaceSnapshot` and `Tool` application shapes.

- [ ] **Step 1: Write failing repository tests**

Assert one RPC call for snapshots, unchanged row-to-domain mapping, empty workspaces, fallback behavior for injected test ports, one RPC call for create, no compensating delete, and unchanged error mapping.

- [ ] **Step 2: Run tests and verify RED**

Expected: repository still performs the current multi-query snapshot and insert/upsert/compensation create flow.

- [ ] **Step 3: Extend the database port**

Add typed `getSnapshotAtomic(ownerEmail)` and `createToolAtomic(ownerEmail, tool, categoryIds)` methods. Keep the old granular methods for migration tests and explicit fallback only.

- [ ] **Step 4: Switch production repository paths**

Map snapshot RPC JSON through the existing domain normalization and map created rows through the existing tool mapper. Preserve API status/error contracts.

- [ ] **Step 5: Run focused and API contract tests**

Expected: one-call assertions pass and existing workspace behavior tests remain green.

- [ ] **Step 6: Commit**

Commit with message `perf: use atomic workspace RPC paths`.

### Task 9: Isolate expensive Dashboard runtimes without DOM changes

**Files:**
- Create: `src/components/dashboard/DashboardVisualRuntime.tsx`
- Create: `src/components/dashboard/DashboardVisualRuntime.test.ts`
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/app/dashboard/deferred-visual-runtimes.integration.test.ts`
- Modify: `src/app/dashboard/lighthouse-edge-highlight.integration.test.ts`

**Interfaces:**
- Consumes: Existing refs, visibility state, reduced-motion state, lighthouse geometry, and visual components.
- Produces: A bounded runtime component whose rendered wrappers/classes/data attributes exactly match the current page.

- [ ] **Step 1: Read the local Next.js client/lazy-loading guides**

Read `05-server-and-client-components.md` and `02-guides/lazy-loading.md`; record any relevant Next 16 constraint in the test or implementation notes.

- [ ] **Step 2: Write failing DOM and lifecycle contracts**

Lock wrapper order, class names, data selectors, GSAP targets, dynamic fallback dimensions, visibility pause/resume, and reduced-motion behavior.

- [ ] **Step 3: Run tests and verify RED**

Expected: the new runtime boundary is absent.

- [ ] **Step 4: Extract the smallest coherent runtime**

Move orchestration without changing JSX output or visual constants. Preserve existing lazy boundaries for Splash Cursor, Side Rays, Magic Rings, and Energy Sand.

- [ ] **Step 5: Run focused animation tests and TypeScript/lint**

Expected: DOM/lifecycle contracts and all lighthouse/deferred-runtime regressions pass.

- [ ] **Step 6: Commit**

Commit with message `refactor: isolate dashboard visual runtime`.

### Task 10: Unify animation lifecycle and asset scheduling

**Files:**
- Create: `src/hooks/useVisualRuntimeActivity.ts`
- Create: `src/hooks/useVisualRuntimeActivity.test.ts`
- Modify: `src/components/SplashCursor.jsx`
- Modify: `src/components/dashboard/SideRays.jsx`
- Modify only if contract tests require: `src/app/dashboard/page.tsx`

**Interfaces:**
- Produces: `useVisualRuntimeActivity({ elementRef, enabled, reducedMotion })` returning whether RAF/WebGL work should run.
- Consumes: `document.visibilityState`, `IntersectionObserver`, existing reduced-motion preference, and existing runtime cleanup callbacks.

- [ ] **Step 1: Write failing lifecycle tests**

Cover hidden document, offscreen surface, visible restoration, observer cleanup, reduced motion, and no duplicate RAF/WebGL loop after repeated transitions.

- [ ] **Step 2: Run tests and verify RED**

Expected: shared lifecycle hook is missing.

- [ ] **Step 3: Implement the minimal hook and migrate runtimes**

Centralize only activity eligibility. Keep shaders, uniforms, timings, color values, dimensions, and rendered fallbacks unchanged.

- [ ] **Step 4: Verify image scheduling without visual changes**

Confirm current Dashboard background remains the same asset and crop; adjust only loading priority/decoding if browser evidence shows a startup win and stable screenshot comparison remains unchanged.

- [ ] **Step 5: Run focused tests and commit**

Expected: lifecycle tests, Splash Cursor, Side Rays, Magic Rings, lighthouse, and entrance tests pass. Commit with message `perf: coordinate dashboard visual runtimes`.

### Task 11: Run Batch 2 acceptance gate and prepare live migration decision

**Files:**
- Create: `docs/performance/phase-two-final-report.md`
- Modify: `docs/performance/phase-two-baseline.md`

**Interfaces:**
- Consumes: Tasks 7–10 and the complete Batch 1 baseline.
- Produces: Verified final report plus explicit approval request for live Supabase migration and deployment.

- [ ] **Step 1: Run all automated gates**

Run RPC/repository/hook/animation/music tests, the relevant full suite, TypeScript, lint, and production build. Record exact results.

- [ ] **Step 2: Verify non-production RPC behavior**

Test success, empty workspace, wrong owner, invalid/duplicate category, rollback, grants, ordering, and database advisors. Record before/after round trips.

- [ ] **Step 3: Repeat authenticated browser acceptance**

Repeat all CRUD, no-reload reconciliation, desktop/tablet/mobile, View All, Manage, lighthouse, edge lighting, marquee, reduced-motion, music, lyrics, console, and network checks.

- [ ] **Step 4: Compare stable screenshots and DOM contracts**

Any visible or structural difference is a failure unless it is caused solely by nondeterministic clock/weather content and is documented as such.

- [ ] **Step 5: Write the final risk statement**

Mark each capability `verified`, `partial`, `unverified`, or `failed`; list remaining risks and the exact rollback commits.

- [ ] **Step 6: Stop for live-change approval**

Do not apply migrations to production, merge to `main`, push, or deploy until the user explicitly approves the verified report and live database impact.
