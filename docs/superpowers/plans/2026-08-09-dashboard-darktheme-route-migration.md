# Dashboard Dark Theme Route Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the current dark-theme dashboard the implementation at `/dashboard` and permanently redirect `/darktheme` to `/dashboard` without changing UI behavior.

**Architecture:** Move the four route-local dark-theme files into the existing dashboard route so relative imports remain intact, replace the old dashboard page and stylesheet, and register a configuration-level permanent redirect. Update the existing source-contract tests to follow the new canonical file location.

**Tech Stack:** Next.js 16.2 App Router, React 19, TypeScript, Node test runner, ESLint.

## Global Constraints

- Preserve the current `/darktheme` visual, copy, interaction, data, music-player, and responsive behavior exactly.
- Do not refactor the large page component or shared dashboard modules.
- Do not modify or clean unrelated worktree changes.
- Do not create a Git commit unless the user explicitly requests one.

---

### Task 1: Establish the route migration contract

**Files:**
- Create: `src/app/dashboard/route-migration.test.ts`
- Inspect: `next.config.ts`
- Inspect: `src/app/dashboard/page.tsx`
- Inspect: `src/app/darktheme/page.tsx`

**Interfaces:**
- Consumes: Node `fs`, the Next.js config default export, and route files on disk.
- Produces: A regression test that requires canonical dashboard ownership and the legacy permanent redirect.

- [ ] **Step 1: Write the failing test**

Create a Node test that asserts `src/app/dashboard/page.tsx` contains the dark-theme root marker `imgBg`, `src/app/darktheme/page.tsx` does not exist, and `await nextConfig.redirects()` contains `{ source: "/darktheme", destination: "/dashboard", permanent: true }`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/app/dashboard/route-migration.test.ts`

Expected: FAIL because the old `/darktheme` page still exists and the redirect is absent.

### Task 2: Move the canonical page and its route-local dependencies

**Files:**
- Replace: `src/app/dashboard/page.tsx`
- Replace: `src/app/dashboard/dashboard.css`
- Create from existing route file: `src/app/dashboard/svg-paths.ts`
- Create from existing route file: `src/app/dashboard/lyrics-progress-motion.ts`
- Create from existing route test: `src/app/dashboard/lyrics-progress-motion.test.ts`
- Delete after copying: `src/app/darktheme/page.tsx`
- Delete after copying: `src/app/darktheme/darktheme.css`
- Delete after copying: `src/app/darktheme/svg-paths.ts`
- Delete after copying: `src/app/darktheme/lyrics-progress-motion.ts`
- Delete after copying: `src/app/darktheme/lyrics-progress-motion.test.ts`

**Interfaces:**
- Consumes: Existing shared imports under `@/components`, `@/hooks`, and `@/lib`.
- Produces: `DashboardPage` as the default `/dashboard` page and the same route-local helpers under `src/app/dashboard/`.

- [ ] **Step 1: Move the four implementation files and helper test**

Copy the dark-theme page content to `dashboard/page.tsx`, changing only `./darktheme.css` to `./dashboard.css` and `DarkThemePage` to `DashboardPage`. Copy the CSS and helper files byte-for-byte to their dashboard names.

- [ ] **Step 2: Remove the old route files**

Delete all five files under `src/app/darktheme/`, leaving no `page.tsx` at that route.

- [ ] **Step 3: Run helper test**

Run: `node --test src/app/dashboard/lyrics-progress-motion.test.ts`

Expected: PASS.

### Task 3: Register the legacy redirect and update source-contract tests

**Files:**
- Modify: `next.config.ts`
- Modify: `src/components/dashboard/EnergySandVolume.test.ts`
- Modify: `src/lib/dashboard/music-library-count.test.ts`
- Modify: `src/lib/dashboard/particle-lyrics-layout.test.ts`
- Modify: `src/lib/dashboard/personal-workspace-copy.test.ts`

**Interfaces:**
- Consumes: Next.js `redirects()` config contract.
- Produces: A permanent `/darktheme` to `/dashboard` redirect and tests that read the canonical route source.

- [ ] **Step 1: Add the minimal redirect**

Add an async `redirects()` method to `nextConfig` returning exactly one rule: `{ source: "/darktheme", destination: "/dashboard", permanent: true }`.

- [ ] **Step 2: Update hard-coded test paths**

Change each `app/darktheme/page.tsx` reference to `app/dashboard/page.tsx` and `app/darktheme/darktheme.css` to `app/dashboard/dashboard.css`.

- [ ] **Step 3: Run the migration and source-contract tests**

Run: `node --test src/app/dashboard/route-migration.test.ts src/app/dashboard/lyrics-progress-motion.test.ts src/components/dashboard/EnergySandVolume.test.ts src/lib/dashboard/music-library-count.test.ts src/lib/dashboard/particle-lyrics-layout.test.ts src/lib/dashboard/personal-workspace-copy.test.ts`

Expected: PASS.

### Task 4: Verify the complete change

**Files:**
- Verify only: all modified files above.

**Interfaces:**
- Consumes: Completed route migration.
- Produces: Evidence that static checks, build output, and runtime routing behave as designed.

- [ ] **Step 1: Search for stale route-local references**

Run a recursive source search for `/darktheme`, `app/darktheme`, and `darktheme.css`; only the redirect and its regression test may remain.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: Exit code 0, or report pre-existing unrelated failures separately.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: Exit code 0.

- [ ] **Step 4: Verify runtime routes**

Start the production server on an unused local port, request `/dashboard`, and request `/darktheme` without following redirects. Expect `/dashboard` to return 200 and `/darktheme` to return a permanent redirect with `Location: /dashboard`.

- [ ] **Step 5: Review the focused diff**

Run `git diff --check` and inspect only the migration files to confirm no unrelated edits were introduced.
