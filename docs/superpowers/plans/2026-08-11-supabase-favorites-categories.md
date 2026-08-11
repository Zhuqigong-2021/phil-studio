# Supabase Favorites and Categories Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Supabase authoritative for dashboard category counts and favorite state while Local Storage remains a synchronized cache.

**Architecture:** Keep the owner-protected workspace API, repository, and race-safe optimistic PATCH logic. Add one dashboard-scoped workspace provider so stats, Favorites, and search observe one snapshot; change hydration so a successful Supabase snapshot wins over conflicting cached favorites.

**Tech Stack:** Next.js 16.2.10, React 19.2.4, TypeScript, Supabase/Postgres, Node test runner, ESLint.

## Global Constraints

- Supabase is authoritative after synchronization succeeds.
- Local Storage is only a startup cache, synchronized mirror, and one-time migration source.
- Category count includes every category returned for the authenticated owner, even if unused.
- Favorite count, panel, and search stars derive from the same workspace snapshot.
- Failed mutations roll back only their own field and cache entry.
- Add no database table or column and expose no secret/service-role key to the browser.
- Preserve add-tool, pin, recent, category, icon, and legacy migration behavior.

---

## File Structure

- Modify `src/hooks/useCustomTools.ts`: server-over-cache precedence and cache mirroring.
- Modify `src/hooks/useCustomTools.supabase.test.ts`: hydration, confirmation, rollback, and concurrency tests.
- Modify `src/app/dashboard/page.tsx`: one workspace provider and database-derived UI.
- Create `src/app/dashboard/database-dashboard-state.test.ts`: integration guard for all four dashboard consumers.

### Task 1: Make Server Favorites Authoritative

**Files:**
- Modify: `src/hooks/useCustomTools.ts`
- Modify: `src/hooks/useCustomTools.supabase.test.ts`

**Interfaces:**
- Consumes: `readCachedWorkspace(storage, authoritative?)`, `synchronizeWorkspace`, `createOptimisticToolPatch`.
- Produces: authoritative hydration plus Local Storage mirror writes for optimistic, confirmed, and rollback snapshots.

- [ ] **Step 1: Write the failing cache-conflict test**

Add a test whose storage contains `{ ap: false }` while `getWorkspace()` returns tool `ap` with `favorite: true`:

```ts
const result = await synchronizeWorkspace(storage, api);
assert.equal(result.tools.find((tool) => tool.id === "ap")?.favorite, true);
assert.equal(JSON.parse(storage.getItem(FAVORITES_STORAGE_KEY)!).ap, true);
```

- [ ] **Step 2: Verify RED**

Run:

```powershell
node --test --experimental-strip-types src/hooks/useCustomTools.supabase.test.ts
```

Expected: the cache conflict assertion fails because cached favorite state can still override authoritative state.

- [ ] **Step 3: Add failing confirmed-write and rollback cache assertions**

Extend the existing `createOptimisticToolPatch` tests. After a confirmed favorite update assert the cache contains the confirmed boolean. After a rejected update assert the cache contains the previous boolean. Retain the existing concurrent mutation test.

- [ ] **Step 4: Implement minimal precedence logic**

In `readCachedWorkspace`, use legacy favorite overrides only before an authoritative snapshot exists:

```ts
const cachedFavorite = authoritative ? undefined : favoriteOverrides[tool.id];
return { ...source, favorite: cachedFavorite ?? source.favorite };
```

Keep all transitions going through `applyWorkspace`, which must continue to call `writeWorkspaceCache(storage, snapshot)` before updating React state.

- [ ] **Step 5: Verify GREEN**

Run the focused Node command again. Expected: all sync, migration, pin, recent, favorite, rollback, and race tests pass.

- [ ] **Step 6: Commit**

```powershell
git add src/hooks/useCustomTools.ts src/hooks/useCustomTools.supabase.test.ts
git commit -m "fix: make Supabase favorites authoritative"
```

### Task 2: Share One Dashboard Workspace Snapshot

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Create: `src/app/dashboard/database-dashboard-state.test.ts`

**Interfaces:**
- Consumes: `ReturnType<typeof useCustomTools>` including `tools`, `categories`, and `setToolFavorite`.
- Produces: `DashboardWorkspaceProvider` and `useDashboardWorkspace()` for search, tool views, stats, Categories, and Favorites.

- [ ] **Step 1: Write the failing dashboard integration test**

Read `page.tsx` and assert:

```ts
assert.doesNotMatch(source, /import \{ useFavorites \}/);
assert.match(source, /function DashboardWorkspaceProvider/);
assert.match(source, /const categoryCount = categories\.length/);
assert.match(source, /tool\.favorite/);
assert.match(source, /value=\{String\(categoryCount\)\}/);
assert.match(source, /value=\{String\(favoriteCount\)\}/);
assert.match(source, /setToolFavorite\(id, !currentFavorite\)/);
```

- [ ] **Step 2: Verify RED**

Run:

```powershell
node --test --experimental-strip-types src/app/dashboard/database-dashboard-state.test.ts
```

Expected: failure because stats are hard-coded and Dashboard maintains parallel hook state.

- [ ] **Step 3: Add the dashboard workspace boundary**

Define inside `page.tsx`:

```tsx
type DashboardWorkspaceValue = ReturnType<typeof useCustomTools>;
const DashboardWorkspaceContext = React.createContext<DashboardWorkspaceValue | null>(null);

function useDashboardWorkspace(): DashboardWorkspaceValue {
  const value = React.useContext(DashboardWorkspaceContext);
  if (!value) throw new Error("Dashboard workspace provider is missing");
  return value;
}

function DashboardWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const workspace = useCustomTools();
  return <DashboardWorkspaceContext.Provider value={workspace}>{children}</DashboardWorkspaceContext.Provider>;
}
```

Rename the current page body to `DashboardPageContent`. The default export renders it inside this provider. Replace dashboard-internal `useCustomTools()` and `useFavorites()` calls with `useDashboardWorkspace()`.

- [ ] **Step 4: Derive real counts and lists**

In `DashboardPageContent` compute:

```ts
const { tools, categories, setToolFavorite } = useDashboardWorkspace();
const categoryCount = categories.length;
const favoriteTools = React.useMemo(
  () => toolViews.filter((view) => view.tool.favorite),
  [toolViews],
);
const favoriteCount = favoriteTools.length;
```

Pass both counts to `StatsRow`; replace hard-coded `15` and `23`. Categories count the returned rows, not tool-category relationships.

- [ ] **Step 5: Route every favorite button through one mutation**

Use the shared current tool value:

```ts
const toggleFavorite = React.useCallback((id: string) => {
  const currentFavorite = tools.find((tool) => tool.id === id)?.favorite;
  if (currentFavorite === undefined) return;
  void setToolFavorite(id, !currentFavorite).catch(() => undefined);
}, [setToolFavorite, tools]);
```

Search palette stars, Favorites panel, and root filtering read `tool.favorite`. Remove `baseFavoriteById`, Dashboard `favOverrides`, and the Dashboard `useFavorites` import.

- [ ] **Step 6: Verify focused behavior**

Run:

```powershell
node --test --experimental-strip-types src/app/dashboard/database-dashboard-state.test.ts src/app/dashboard/tool-icon-priority.test.ts src/hooks/useCustomTools.supabase.test.ts
npx eslint src/app/dashboard/page.tsx src/app/dashboard/database-dashboard-state.test.ts src/hooks/useCustomTools.ts src/hooks/useCustomTools.supabase.test.ts
```

Expected: tests pass; ESLint has zero errors. Existing unrelated dashboard warnings may remain.

- [ ] **Step 7: Commit**

```powershell
git add src/app/dashboard/page.tsx src/app/dashboard/database-dashboard-state.test.ts
git commit -m "feat: show database-backed dashboard favorites"
```

### Task 3: Verify Live Supabase and Complete Regression

**Files:**
- No production file expected.
- Modify `src/lib/supabase/database.types.ts` only if fresh generation differs.

**Interfaces:**
- Consumes: project `uvicpezvhxmqcnlxjeoz`, `public.categories`, `public.tools.is_favorite`.
- Produces: evidence that database rows, API state, cache mirror, and dashboard counts agree.

- [ ] **Step 1: Verify the live target read-only**

Confirm project status, exact URL `https://uvicpezvhxmqcnlxjeoz.supabase.co`, migration history, and exactly three business tables: `tools`, `categories`, `tool_categories`.

- [ ] **Step 2: Query real owner data**

```sql
select count(*) as category_count
from public.categories
where owner_email = 'philzhuqigong@gmail.com';

select id, name, is_favorite
from public.tools
where owner_email = 'philzhuqigong@gmail.com'
order by sort_order, id;
```

Expected: category count equals the dashboard stat and `true` rows equal the Favorites panel/search stars.

- [ ] **Step 3: Verify mutation reversibly**

Use a verified existing ID in one transaction:

```sql
begin;
update public.tools
set is_favorite = not is_favorite, updated_at = now()
where owner_email = 'philzhuqigong@gmail.com' and id = 'ap'
returning id, is_favorite;
rollback;
```

Re-query afterward and prove the original value remains. Leave no test data or changed favorite behind.

- [ ] **Step 4: Run final verification**

```powershell
$testFiles = Get-ChildItem src -Recurse -File -Filter '*.test.ts' | ForEach-Object FullName
node --test --experimental-strip-types $testFiles
npm run build
git diff --check
```

Expected: all tests pass, Next.js production build passes, and diff check is empty. Preserve unrelated untracked files and user changes.

- [ ] **Step 5: Commit generated types only if changed**

```powershell
git add src/lib/supabase/database.types.ts
git commit -m "chore: refresh Supabase database types"
```

Skip this commit when generated types are unchanged.
