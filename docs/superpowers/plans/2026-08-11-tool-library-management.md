# Tool Library Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a database-backed, paginated Tool Library with inline CRUD, consistent mutation loading/Toast feedback, and a GSAP handoff from Dashboard All Tools.

**Architecture:** Extend the existing authenticated workspace repository and client hook rather than introducing a second data source. Keep row edits local until Update, refresh the shared workspace snapshot after successful mutations, and reuse the current Add Tool and Toast visual language. Use a fixed GSAP transition shell to bridge Dashboard and `/manage` without restructuring the whole App Router layout.

**Tech Stack:** Next.js 16.2 App Router, React 19, TypeScript 5, Supabase 2.112, GSAP 3.15, Motion 13, Node test runner, ESLint 9.

## Global Constraints

- Table data, categories, aliases, pin, and favorite values must come from the authenticated workspace database snapshot.
- Manage edits, including Pin and Favorite, remain drafts until the row Update succeeds.
- Database mutation success Toasts appear only after successful responses; failures retain or restore the prior committed state.
- Database-backed buttons show a localized Spinner and reject duplicate submission while pending.
- Default page size is 10; options are 10, 20, and 50.
- Dashboard `View All` uses a 420 ms GSAP `power3.inOut` handoff; Sidebar Manage navigates directly.
- Reduced Motion replaces spatial movement and rotating progress with non-spatial feedback.
- `/favs` remains available but is removed from Sidebar navigation.
- Do not stage or modify unrelated existing user files.

---

## File Structure

- `src/lib/dashboard/tool-mutations.ts`: generic mutation Toast details and database error-to-copy mapping.
- `src/lib/dashboard/tool-mutations.test.ts`: mutation feedback and duplicate-submit-independent helper tests.
- `src/lib/dashboard/tool-library.ts`: pagination, row draft conversion, alias parsing, and color normalization.
- `src/lib/dashboard/tool-library.test.ts`: pure Tool Library behavior tests.
- `src/lib/dashboard/workspace-data.ts`: client DELETE request and supported custom color validation.
- `src/lib/dashboard/workspace-data.test.ts`: DELETE client and validation tests.
- `src/lib/dashboard/workspace-repository.ts`: owner-scoped deletion repository operation.
- `src/lib/dashboard/workspace-repository.test.ts`: deletion ownership and relationship behavior tests.
- `src/app/api/tools/[id]/route.ts`: authenticated DELETE handler alongside PATCH.
- `src/app/api/tools/[id]/route.test.ts`: PATCH regression and DELETE response tests.
- `src/hooks/useCustomTools.ts`: refresh, delete, non-optimistic row update, and per-tool Favorite pending state.
- `src/hooks/useCustomTools.test.ts`: workspace mutation state tests.
- `src/hooks/useManagePageState.ts`: row drafts, pagination, modal, and pending orchestration.
- `src/components/dashboard/pages/ManageContent.tsx`: Tool Library heading and table composition.
- `src/components/dashboard/manage/EditableToolRow.tsx`: one editable row and row-scoped Update/Delete triggers.
- `src/components/dashboard/manage/ToolColorPicker.tsx`: brand palette and custom color input.
- `src/components/dashboard/manage/CategoryCollector.tsx`: searchable category multi-select.
- `src/components/dashboard/manage/ToolLibraryPagination.tsx`: page-size and first/previous/next/last controls.
- `src/components/dashboard/manage/DeleteToolDialog.tsx`: accessible confirmation and pending UI.
- `src/components/dashboard/DatabaseToastViewport.tsx`: renders mutation result Toasts using existing visual conventions.
- `src/components/dashboard/AddToolModal.tsx`: canonical shared Add Tool modal with Save pending/Toast feedback.
- `src/app/dashboard/page.tsx`: use the shared modal, Favorite pending state, Sidebar copy, and View All trigger.
- `src/components/dashboard/Sidebar.tsx`: Sidebar label and `/manage` destination used on secondary pages.
- `src/components/dashboard/DashboardToolTransition.tsx`: fixed GSAP source-to-destination handoff.
- `src/app/manage/page.tsx`: destination entrance state and Tool Library page composition.
- `src/styles/secondary.css`: Tool Library, modal, pagination, pending, responsive, and reduced-motion styles.

---

### Task 1: Add Owner-Scoped Tool Deletion

**Files:**
- Modify: `src/lib/dashboard/workspace-repository.ts`
- Modify: `src/lib/dashboard/workspace-repository.test.ts`
- Modify: `src/app/api/tools/[id]/route.ts`
- Create: `src/app/api/tools/[id]/route.test.ts`
- Modify: `src/lib/dashboard/workspace-data.ts`
- Modify: `src/lib/dashboard/workspace-data.test.ts`

**Interfaces:**
- Produces: `deleteWorkspaceTool(ownerEmail: string, id: string): Promise<void>`.
- Produces: `deleteWorkspaceToolRequest(id: string, fetcher?: typeof fetch): Promise<void>`.
- Produces: `createToolDeleteHandler({ authorize, deleteTool })` for isolated route tests.

- [ ] **Step 1: Write repository tests for owner-scoped deletion**

Add tests that seed two owners with tools using the same attempted target pattern, call deletion as `owner@example.com`, and assert only that owner's exact tool is removed. Assert relationship removal precedes tool removal when the database port does not provide cascade behavior.

```ts
await deleteWorkspaceTool(OWNER, "mindmap", database);
assert.equal(database.tools.some((row) => row.id === "mindmap" && row.owner_email === OWNER), false);
assert.equal(database.tools.some((row) => row.id === "mindmap-other" && row.owner_email === OTHER_OWNER), true);
```

- [ ] **Step 2: Run the repository test and verify failure**

Run: `node --test --experimental-strip-types src/lib/dashboard/workspace-repository.test.ts`

Expected: FAIL because `deleteWorkspaceTool` and required database-port methods are absent.

- [ ] **Step 3: Implement the minimal repository deletion contract**

Extend `WorkspaceDatabasePort` with explicit owner-scoped lookup/delete operations and implement:

```ts
export async function deleteWorkspaceTool(
  ownerEmail: string,
  id: string,
  database: WorkspaceDatabasePort = createWorkspaceDatabase(),
): Promise<void> {
  const tool = await database.findOwnedTool(ownerEmail, id);
  if (!tool) throw new WorkspaceToolNotFoundError(id);
  await database.deleteToolRelationships(tool.id);
  await database.deleteOwnedTool(ownerEmail, tool.id);
}
```

- [ ] **Step 4: Write DELETE route tests**

Cover `204`, malformed/unknown id as `404`, `401`, `403`, configuration failure as `503`, and repository failure as `502`. Assert authorization runs before deletion.

- [ ] **Step 5: Run the route test and verify failure**

Run: `node --test --experimental-strip-types src/app/api/tools/[id]/route.test.ts`

Expected: FAIL because the DELETE handler is absent.

- [ ] **Step 6: Add the DELETE route handler**

Use the same `failureResponse` policy as PATCH and return an empty `204` response only after repository success.

```ts
export function createToolDeleteHandler(dependencies: ToolDeleteDependencies) {
  return async function deleteTool(_request: Request, context: PatchContext): Promise<Response> {
    try {
      const ownerEmail = await dependencies.authorize();
      const { id } = await context.params;
      await dependencies.deleteTool(ownerEmail, id);
      return new Response(null, { status: 204 });
    } catch (error) {
      return failureResponse(error);
    }
  };
}
```

- [ ] **Step 7: Write and implement the client DELETE request test**

Assert encoded ids, HTTP method `DELETE`, success on `204`, and propagation of parsed API errors.

```ts
export async function deleteWorkspaceToolRequest(id: string, fetcher: typeof fetch = fetch): Promise<void> {
  await requestWorkspace<void>(`/api/tools/${encodeURIComponent(id)}`, { method: "DELETE" }, fetcher);
}
```

- [ ] **Step 8: Run Task 1 tests and commit**

Run:

```powershell
node --test --experimental-strip-types src/lib/dashboard/workspace-repository.test.ts
node --test --experimental-strip-types src/app/api/tools/[id]/route.test.ts
node --test --experimental-strip-types src/lib/dashboard/workspace-data.test.ts
```

Commit: `feat: add authenticated tool deletion`

---

### Task 2: Add Tool Library Pure State and Custom Colors

**Files:**
- Create: `src/lib/dashboard/tool-library.ts`
- Create: `src/lib/dashboard/tool-library.test.ts`
- Modify: `src/lib/dashboard/types.ts`
- Modify: `src/lib/dashboard/mock-data.ts`
- Modify: `src/lib/dashboard/workspace-data.ts`
- Modify: `src/lib/dashboard/workspace-data.test.ts`

**Interfaces:**
- Produces: `ToolColor = Accent | CustomToolColor` where `CustomToolColor` is a normalized `#RRGGBB` string.
- Produces: `ToolRowDraft`, `toolToRowDraft(tool, pinned)`, `rowDraftToPatch(draft)`, `parseAliasInput(value)`, `normalizeToolColor(value)`, and `paginateTools(tools, page, pageSize)`.

- [ ] **Step 1: Write failing pure behavior tests**

Test page-size calculation and clamping, alias trimming/deduplication, draft conversion, selected categories, Pin/Favorite patch inclusion, named accents, uppercase custom Hex normalization, and rejection of invalid colors.

```ts
assert.deepEqual(paginateTools(Array.from({ length: 24 }, (_, id) => ({ id })), 3, 10), {
  items: [{ id: 20 }, { id: 21 }, { id: 22 }, { id: 23 }],
  page: 3,
  pageCount: 3,
  start: 21,
  end: 24,
  total: 24,
});
assert.equal(normalizeToolColor("#22d3ee"), "#22D3EE");
```

- [ ] **Step 2: Run the pure test and verify failure**

Run: `node --test --experimental-strip-types src/lib/dashboard/tool-library.test.ts`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement the pure helpers and types**

Keep pagination generic, keep row-to-patch conversion explicit, and do not expose raw color text as a display requirement.

```ts
export interface ToolRowDraft {
  iconKey: string;
  color: ToolColor;
  name: string;
  description: string;
  tags: string[];
  url: string;
  pinned: boolean;
  favorite: boolean;
  aliases: string[];
}
```

- [ ] **Step 4: Extend workspace validation without breaking named accents**

Update `ToolPatch.accent` and normalization so the seven existing accent names remain valid and `#RRGGBB` custom values are accepted only after normalization. Update decoration helpers so custom colors derive safe translucent border/background values.

- [ ] **Step 5: Run Task 2 tests and commit**

Run:

```powershell
node --test --experimental-strip-types src/lib/dashboard/tool-library.test.ts
node --test --experimental-strip-types src/lib/dashboard/workspace-data.test.ts
node --test --experimental-strip-types src/lib/dashboard/custom-tools.test.ts
```

Commit: `feat: add tool library row state`

---

### Task 3: Add Shared Mutation Feedback and Workspace Actions

**Files:**
- Create: `src/lib/dashboard/tool-mutations.ts`
- Create: `src/lib/dashboard/tool-mutations.test.ts`
- Modify: `src/hooks/useCustomTools.ts`
- Modify: `src/hooks/useCustomTools.test.ts`
- Create: `src/components/dashboard/DatabaseToastViewport.tsx`
- Modify: `src/components/dashboard/SecondaryPageShell.tsx`

**Interfaces:**
- Produces: `publishDatabaseToast({ tone, message })` and `databaseErrorMessage(error, action, toolName)`.
- Extends `WorkspaceApi` with `deleteTool(id)`.
- Extends `useCustomTools()` with `refreshTools()`, `updateTool(id, patch)`, `deleteTool(id)`, and `favoritePendingIds`.

- [ ] **Step 1: Write Toast/error mapping tests**

Assert success copy and status-aware error copy for `400`, `401`, `403`, `503`, network errors, and unknown server errors. Reuse the existing Toast state/replacement behavior rather than creating a competing animation system.

- [ ] **Step 2: Run the mutation helper test and verify failure**

Run: `node --test --experimental-strip-types src/lib/dashboard/tool-mutations.test.ts`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement mutation event helpers and viewport**

Publish one application event with `success | error | info` tones. Render it once in each active shell. Preserve existing Toast replacement, retirement, and Reduced Motion behavior.

- [ ] **Step 4: Write hook tests for update/delete/refresh and Favorite pending**

Use an injected `WorkspaceApi`. Assert update and delete await the server, fetch a fresh snapshot on success, do not duplicate pending requests, and leave committed state unchanged on failure. Assert the Favorite id enters and leaves `favoritePendingIds` in `finally`.

- [ ] **Step 5: Run the hook test and verify failure**

Run: `node --test --experimental-strip-types src/hooks/useCustomTools.test.ts`

Expected: FAIL on the new workspace API and pending-state assertions.

- [ ] **Step 6: Implement non-optimistic management actions and Favorite pending state**

`updateTool` and `deleteTool` await the API and then `fetchSnapshot`; Manage emits Toasts at its action boundary. Keep Dashboard Favorite rollback behavior, but expose pending ids so its button can show a Spinner and reject duplicate activation.

- [ ] **Step 7: Run Task 3 tests and commit**

Run:

```powershell
node --test --experimental-strip-types src/lib/dashboard/tool-mutations.test.ts
node --test --experimental-strip-types src/hooks/useCustomTools.test.ts
node --test --experimental-strip-types src/lib/dashboard/favorite-toast.test.ts
```

Commit: `feat: add database mutation feedback`

---

### Task 4: Build Manage State, Pagination, and Inline Table

**Files:**
- Modify: `src/hooks/useManagePageState.ts`
- Modify: `src/components/dashboard/pages/ManageContent.tsx`
- Create: `src/components/dashboard/manage/EditableToolRow.tsx`
- Create: `src/components/dashboard/manage/ToolColorPicker.tsx`
- Create: `src/components/dashboard/manage/CategoryCollector.tsx`
- Create: `src/components/dashboard/manage/ToolLibraryPagination.tsx`
- Create: `src/components/dashboard/manage/DeleteToolDialog.tsx`
- Delete: `src/components/dashboard/pages/EditPanel.tsx` only after imports are removed and repository search confirms it is orphaned
- Modify: `src/app/manage/page.tsx`
- Modify: `src/styles/secondary.css`

**Interfaces:**
- Consumes: Task 2 row/pagination helpers and Task 3 workspace actions.
- Produces: a Tool Library UI with independent row drafts, `updatingIds`, `deleteTarget`, page state, and page-size state.

- [ ] **Step 1: Add state tests for draft isolation and pagination**

Extend the closest hook/state tests or create `src/hooks/useManagePageState.test.ts` for extracted reducer functions. Assert changing one row does not modify another, a successful refresh resets the matching draft, a failed update retains it, page size resets to 1, and deletion clamps the page.

- [ ] **Step 2: Run the state tests and verify failure**

Run: `node --test --experimental-strip-types src/hooks/useManagePageState.test.ts`

Expected: FAIL on missing reducer/state helpers.

- [ ] **Step 3: Implement Manage orchestration**

Replace visibility overrides and edit-panel state with row drafts and pagination. Provide explicit callbacks:

```ts
updateDraft(id, partial)
submitRow(id)
requestDelete(id)
cancelDelete()
confirmDelete()
setPage(page)
setPageSize(size)
```

- [ ] **Step 4: Build the accessible table controls**

Implement the approved columns and title `Tool Library`. Use actual form controls with labels. Keep Pin and Favorite changes local. Disable only the submitting row. Use a green bordered Update button and red bordered Delete button with named accessible labels.

- [ ] **Step 5: Build the palette and Category Collector**

Palette includes the seven established brand colors plus a custom color input. The collector filters database categories, supports multiple checked values, Escape close, and selected chips without silently creating new categories.

- [ ] **Step 6: Build confirmation and pagination controls**

Delete cancel sends no request and no Toast. Confirm displays Spinner plus `Deleting…`. Pagination copy and button boundaries match the spec, including responsive wrapping and horizontal table scrolling.

- [ ] **Step 7: Run Task 4 checks and commit**

Run:

```powershell
node --test --experimental-strip-types src/hooks/useManagePageState.test.ts
npx tsc --noEmit
npm run lint -- src/hooks/useManagePageState.ts src/components/dashboard/pages/ManageContent.tsx src/components/dashboard/manage src/app/manage/page.tsx
```

Commit: `feat: build inline tool library management`

---

### Task 5: Share Add Tool and Add Database Pending Feedback

**Files:**
- Modify: `src/components/dashboard/AddToolModal.tsx`
- Modify: `src/components/dashboard/SecondaryPageShell.tsx`
- Modify: `src/app/dashboard/page.tsx`
- Modify: the existing Add Tool and Dashboard workspace tests identified by repository search

**Interfaces:**
- Consumes: Task 3 Toast publisher and `favoritePendingIds`.
- Produces: one canonical Add Tool modal used by Dashboard and Manage, and per-tool Dashboard Favorite Spinners.

- [ ] **Step 1: Write failing UI state/helper tests**

Extract testable submission helpers where necessary. Assert Save cannot double-submit, remains pending through the database promise, publishes success only after resolution, retains fields on rejection, and maps failure to an error Toast. Assert Favorite activation is ignored while its id is pending.

- [ ] **Step 2: Run focused tests and verify failure**

Run the exact existing Add Tool and Dashboard workspace test files returned by `Get-ChildItem -Recurse -File src | Select-String -Pattern 'AddTool|favoritePending'`.

Expected: FAIL on missing pending/Toast behavior.

- [ ] **Step 3: Make `AddToolModal.tsx` the canonical modal**

Move the active Dashboard modal presentation into the shared component without redesigning it. Both surfaces pass the same workspace actions. Remove the duplicated local Dashboard modal only after the shared version renders equivalently.

- [ ] **Step 4: Add pending and result feedback**

Save shows Spinner + `Saving…` and disables repeat submission. Dashboard Favorite replaces only the clicked star with a small Spinner. Both publish result Toasts after their database promise settles.

- [ ] **Step 5: Run Task 5 checks and commit**

Run focused tests, `npx tsc --noEmit`, and targeted lint for the modified files.

Commit: `feat: unify database action feedback`

---

### Task 6: Add Sidebar Manage Navigation and GSAP Handoff

**Files:**
- Create: `src/components/dashboard/DashboardToolTransition.tsx`
- Create: `src/lib/dashboard/tool-transition.ts`
- Create: `src/lib/dashboard/tool-transition.test.ts`
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/components/dashboard/Sidebar.tsx`
- Modify: `src/components/dashboard/MobileDrawer.tsx`
- Modify: `src/app/manage/page.tsx`
- Modify: `src/styles/secondary.css`

**Interfaces:**
- Produces: `getToolTransitionPlan(sourceRect, destinationRect, reduceMotion)` for deterministic tests.
- Produces: `startToolLibraryTransition(sourceElement, router)` to run the GSAP overlay and navigate once.

- [ ] **Step 1: Read the installed Next.js navigation documentation**

Read the relevant installed files under `node_modules/next/dist/docs/` for App Router client navigation and route transitions before editing navigation code. Record any API constraint that changes this plan in the implementation notes.

- [ ] **Step 2: Write transition-plan tests**

Assert source/destination translation and scale, 420 ms normal duration, `power3.inOut`, a non-spatial 160 ms Reduced Motion plan, and repeat-click locking.

- [ ] **Step 3: Run the test and verify failure**

Run: `node --test --experimental-strip-types src/lib/dashboard/tool-transition.test.ts`

Expected: FAIL because the transition module does not exist.

- [ ] **Step 4: Implement the fixed overlay handoff**

Measure the real All Tools card via a ref, clone only its visual shell, animate transform/opacity/border radius, call `router.push('/manage')` once, and clean up overlay nodes and locks on completion or unmount. The Manage destination staggers content after a transition marker; direct Sidebar entry uses its normal entrance.

- [ ] **Step 5: Rename Sidebar Favorites to Manage**

Update desktop and mobile navigation labels/icons/destinations to `/manage`. Do not rename the Dashboard Favorites statistic or remove `/favs`.

- [ ] **Step 6: Run Task 6 checks and commit**

Run:

```powershell
node --test --experimental-strip-types src/lib/dashboard/tool-transition.test.ts
npx tsc --noEmit
npm run lint -- src/lib/dashboard/tool-transition.ts src/components/dashboard/DashboardToolTransition.tsx src/app/dashboard/page.tsx src/components/dashboard/Sidebar.tsx src/components/dashboard/MobileDrawer.tsx src/app/manage/page.tsx
```

Commit: `feat: animate dashboard into tool library`

---

### Task 7: Full Regression and Browser Acceptance

**Files:**
- Modify only files needed to fix failures directly caused by Tasks 1–6.

**Interfaces:**
- Consumes all prior tasks.
- Produces verified Tool Library behavior with recorded limitations, if any.

- [ ] **Step 1: Run the complete automated suite**

Run:

```powershell
node --test --experimental-strip-types src/**/*.test.ts
npx tsc --noEmit
npm run lint
npm run build
```

Expected: all project tests, type checks, lint, and production build pass. If the shell does not expand `src/**/*.test.ts`, enumerate test paths with PowerShell and invoke Node with the resolved list.

- [ ] **Step 2: Start or reuse the development server**

Run: `npm run dev` only if `http://localhost:3000` is not already serving this checkout. Do not start a duplicate server on the same port.

- [ ] **Step 3: Verify the Dashboard-to-Manage flow**

Use browser automation to verify View All runs once, lands on `/manage`, displays `Tool Library`, and direct Sidebar Manage navigation works. Repeat with Reduced Motion emulation.

- [ ] **Step 4: Verify database CRUD and feedback**

Use a disposable test record created through Add Tool. Verify Save pending/success, every row field update, Search alias discovery, Quick Access pinning, Favorite synchronization, delete cancellation, confirmed deletion, and success Toasts. Trigger safe validation failures for Update/Add and verify error Toasts without corrupting data.

- [ ] **Step 5: Verify pagination, responsive layout, and keyboard behavior**

Verify 10/20/50 page sizes, first/previous/next/last boundaries, page clamping after deletion, horizontal table scrolling, Category Collector keyboard use, modal focus/Escape behavior, and descriptive accessible names.

- [ ] **Step 6: Inspect the final diff and commit fixes**

Run:

```powershell
git status --short
git diff --check
git diff --stat
```

Confirm every changed line traces to this feature and that `.superpowers/`, screenshots, logs, music, and other pre-existing untracked files are not staged.

Commit: `test: verify tool library management`
