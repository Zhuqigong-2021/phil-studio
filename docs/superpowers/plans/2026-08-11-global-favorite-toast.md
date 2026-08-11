# Global Favorite Toast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a global, database-confirmed success or rollback-aware failure toast for every favorite and unfavorite action.

**Architecture:** Keep `useCustomTools().setToolFavorite` as the single mutation boundary used by every surface. Wrap that mutation with a small notification helper that emits one typed browser event only after resolve or reject. Mount one `FavoriteToastHost` in the root layout; it listens for those events and manages one foreground toast plus one 220ms retiring background toast.

**Tech Stack:** Next.js 16.2 App Router, React 19, TypeScript, existing CSS/Tailwind utilities, Node test runner.

## Global Constraints

- Supabase remains authoritative; success is emitted only after the PATCH resolves.
- Failure is emitted only after the optimistic rollback completes.
- Cover Dashboard, Search, Favorites, All Tools, and Manage through the shared mutation boundary.
- Add no third-party toast dependency and no database/API schema changes.
- Success uses `role="status"`; failure uses `role="alert"`; reduced-motion disables animation.
- One foreground and one retiring background toast at a time; a newer result immediately retires the current toast; auto-dismiss after 3000 ms.

---

### Task 1: Favorite mutation notification contract

**Files:**
- Create: `src/lib/dashboard/favorite-toast.ts`
- Create: `src/lib/dashboard/favorite-toast.test.ts`
- Modify: `src/hooks/useCustomTools.ts`
- Test: `src/hooks/useCustomTools.supabase.test.ts`

**Interfaces:**
- Produces: `FavoriteToastDetail`, `FAVORITE_TOAST_EVENT`, and `runFavoriteMutationWithToast({ toolName, favorite, mutate, publish })`.
- Consumes: the existing `setToolFavorite(id, favorite): Promise<void>` optimistic database mutation.

- [ ] **Step 1: Write failing contract tests**

Test that a resolved mutation publishes `Favorited: {name}` or `Removed from favorites: {name}` only after resolution. Test that a rejected mutation publishes the matching rollback message, preserves the original rejection, and publishes no success.

- [ ] **Step 2: Run RED**

Run: `node --test --experimental-strip-types src/lib/dashboard/favorite-toast.test.ts`

Expected: FAIL because `favorite-toast.ts` and its exports do not exist.

- [ ] **Step 3: Implement the minimal helper**

Define the typed detail `{ id: number; tone: "success" | "info" | "error"; message: string }`. Await `mutate()`, publish the resolved success/info detail, or publish the failure detail and rethrow. Use a monotonically increasing ID so identical consecutive messages still replace and restart dismissal.

- [ ] **Step 4: Integrate the shared hook boundary**

In `setToolFavorite`, resolve the tool name from `workspaceRef.current`, call the existing optimistic patch through `runFavoriteMutationWithToast`, and publish with `window.dispatchEvent(new CustomEvent(FAVORITE_TOAST_EVENT, { detail }))`. Keep non-browser tests safe by making the default publisher a no-op when `window` is unavailable.

- [ ] **Step 5: Run GREEN and existing synchronization tests**

Run: `node --test --experimental-strip-types src/lib/dashboard/favorite-toast.test.ts src/hooks/useCustomTools.supabase.test.ts`

Expected: all tests pass, including existing confirmed-cache and rollback behavior.

- [ ] **Step 6: Commit**

```powershell
git add -- src/lib/dashboard/favorite-toast.ts src/lib/dashboard/favorite-toast.test.ts src/hooks/useCustomTools.ts src/hooks/useCustomTools.supabase.test.ts
git commit -m "feat: publish favorite mutation results"
```

### Task 2: Global accessible toast host

**Files:**
- Create: `src/components/dashboard/FavoriteToastHost.tsx`
- Create: `src/components/dashboard/FavoriteToastHost.test.ts`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `FAVORITE_TOAST_EVENT` and `FavoriteToastDetail` from Task 1.
- Produces: one globally mounted client component that displays and dismisses the latest result.

- [ ] **Step 1: Write failing host behavior tests**

Test a pure exported toast-state controller/reducer: a new detail replaces the previous detail, records a 3000 ms dismissal deadline, and a matching dismiss action clears it while an obsolete dismiss action cannot clear a newer toast. Add a source-level assertion that the root layout mounts `<FavoriteToastHost />` exactly once.

- [ ] **Step 2: Run RED**

Run: `node --test --experimental-strip-types src/components/dashboard/FavoriteToastHost.test.ts`

Expected: FAIL because the host/controller does not exist and the layout has no host.

- [ ] **Step 3: Implement the host**

Create a client component that subscribes/unsubscribes to the typed browser event, replaces the toast, clears/restarts a 3000 ms timer, and renders a fixed top-center glass panel with a 10px corner radius. Use cyan/green for success, indigo for info, and red for error. Render `role="alert"` only for error and `role="status"` otherwise. Use CSS transition classes plus `motion-reduce:transition-none`.

- [ ] **Step 4: Mount once in root layout**

Import and render `<FavoriteToastHost />` after the root page content inside `<body>`, without changing existing providers or metadata.

- [ ] **Step 5: Run GREEN**

Run: `node --test --experimental-strip-types src/components/dashboard/FavoriteToastHost.test.ts src/lib/dashboard/favorite-toast.test.ts src/hooks/useCustomTools.supabase.test.ts`

Expected: all tests pass.

- [ ] **Step 6: Commit**

```powershell
git add -- src/components/dashboard/FavoriteToastHost.tsx src/components/dashboard/FavoriteToastHost.test.ts src/app/layout.tsx
git commit -m "feat: show global favorite toasts"
```

### Task 3: Consolidated verification

**Files:**
- Verify only; modify production files only if a Task 1 or Task 2 regression is proven.

**Interfaces:**
- Consumes: completed Tasks 1 and 2.
- Produces: test, lint, build, and authenticated browser evidence.

- [ ] **Step 1: Run focused tests**

Run the Task 1/2 tests plus `src/app/dashboard/database-dashboard-state.test.ts` and `src/lib/dashboard/workspace-repository.test.ts`.

- [ ] **Step 2: Run scoped lint and production build**

Run: `npx eslint src/lib/dashboard/favorite-toast.ts src/lib/dashboard/favorite-toast.test.ts src/components/dashboard/FavoriteToastHost.tsx src/components/dashboard/FavoriteToastHost.test.ts src/hooks/useCustomTools.ts src/app/layout.tsx`

Run: `npm run build`

- [ ] **Step 3: Verify real behavior**

Against the authenticated local app, favorite one tool and unfavorite another. Confirm PATCH 200, correct success/info toast, persistence after reload, and matching Supabase `is_favorite` values. Force one safe rejected mutation in an automated dependency test and confirm the error detail follows rollback; do not break live credentials merely to create a browser error.

- [ ] **Step 4: Review the final diff**

Run: `git diff --check HEAD~2 HEAD` and `git status --short`. Confirm unrelated untracked music, screenshots, and logs remain untouched.
