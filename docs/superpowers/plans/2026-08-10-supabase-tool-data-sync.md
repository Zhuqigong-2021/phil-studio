# Supabase Tool Data Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Supabase project `uvicpezvhxmqcnlxjeoz` the durable source of truth for tools, categories, favorites, Quick Access pins, aliases, and recent-use metadata without replacing the existing Google + NextAuth login.

**Architecture:** Client components call owner-protected Next.js Route Handlers. Route Handlers validate the NextAuth owner session and use a dedicated server-only `@supabase/supabase-js` client with a secret key. The client hydrates from a local cache, performs a one-time idempotent localStorage migration, and then treats the server snapshot as authoritative.

**Tech Stack:** Next.js 16.2.10 App Router, React 19.2.4, NextAuth 5 beta, Supabase Postgres/Data API, `@supabase/supabase-js` 2.112.2, TypeScript, Node test runner.

## Global Constraints

- Target exactly project `uvicpezvhxmqcnlxjeoz`; verify connector access before any DDL.
- Keep Google + NextAuth as the only login system.
- Keep `SUPABASE_SECRET_KEY` server-only; never use a `NEXT_PUBLIC_` prefix or return it in a response.
- Use exactly three business tables: `tools`, `categories`, and `tool_categories`.
- Enable RLS on all three tables and create no `anon` or `authenticated` policies.
- Explicitly grant the server role access because public tables may not be exposed automatically.
- Keep Todo and focus-session data browser-local.
- Preserve the current nine built-in tool IDs and the existing `Tool` interface behavior.
- Never delete localStorage migration source data automatically.
- Follow red-green-refactor for production TypeScript changes.
- Preserve all unrelated untracked files in `D:\Phil studio`.

---

## File Map

- `supabase/migrations/`: contains the committed `create_workspace_tables` migration whose exact timestamped filename is created and reported by the Supabase CLI in Task 2.
- `src/lib/supabase/server.ts`: server-only Supabase client construction and environment validation.
- `src/lib/supabase/database.types.ts`: generated database types for the target project.
- `src/lib/dashboard/workspace-data.ts`: database-row/UI mapping, snapshot contracts, migration payload validation, and client fetch helpers.
- `src/lib/dashboard/workspace-repository.ts`: owner-scoped database queries and idempotent seeding.
- `src/lib/dashboard/owner-session.ts`: NextAuth owner authorization used by every workspace API route.
- `src/app/api/workspace-data/route.ts`: owner snapshot GET.
- `src/app/api/workspace-data/migrate/route.ts`: idempotent localStorage migration POST.
- `src/app/api/tools/route.ts`: custom tool POST.
- `src/app/api/tools/[id]/route.ts`: allowlisted tool PATCH.
- `src/app/api/categories/route.ts`: category POST.
- `src/hooks/useCustomTools.ts`: server hydration, cache, migration, optimistic mutations, and rollback.
- `src/lib/dashboard/recent-tools.ts`: fire-and-forget server recent-use update plus cache fallback.
- `src/components/dashboard/AddToolModal.tsx` and `src/app/dashboard/page.tsx`: await server mutations and retain inline errors.
- `.env.example`: document server-only Supabase variables without values.

---

### Task 1: Install and isolate the server Supabase client

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/lib/supabase/server.test.ts`
- Create: `src/lib/supabase/server.ts`
- Modify: `.env.example`

**Interfaces:**
- Produces: `getSupabaseServerClient(): SupabaseClient<Database>`
- Produces: `SupabaseConfigurationError`
- Consumes later: `workspace-repository.ts` uses this client and never reads environment variables directly.

- [ ] **Step 1: Install the pinned package**

Run:

```powershell
npm install --save-exact @supabase/supabase-js@2.112.2
```

Expected: `package.json` contains `"@supabase/supabase-js": "2.112.2"` and the lockfile is updated.

- [ ] **Step 2: Write the failing configuration test**

Create `src/lib/supabase/server.test.ts` with tests that delete each variable in turn and assert that `getSupabaseServerClient()` throws only the safe message `Supabase server configuration is unavailable.`. Also read the source and assert it contains `import "server-only"` and does not reference `NEXT_PUBLIC_`.

```ts
test("rejects missing server configuration without exposing secret values", () => {
  process.env.SUPABASE_URL = "https://uvicpezvhxmqcnlxjeoz.supabase.co";
  delete process.env.SUPABASE_SECRET_KEY;
  assert.throws(
    () => getSupabaseServerClient(),
    /Supabase server configuration is unavailable\./,
  );
});
```

- [ ] **Step 3: Run the test and verify RED**

Run:

```powershell
node --test --experimental-strip-types src/lib/supabase/server.test.ts
```

Expected: FAIL because `server.ts` and `getSupabaseServerClient` do not exist.

- [ ] **Step 4: Implement the minimal server client**

Create `src/lib/supabase/server.ts` using `createClient<Database>(url, secret, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } })`. Validate that the URL is exactly an HTTPS URL and both values are non-empty. Do not log either value.

- [ ] **Step 5: Document environment names**

Append only these placeholders to `.env.example`:

```text
# Server-only Supabase access for persistent workspace data
SUPABASE_URL=https://uvicpezvhxmqcnlxjeoz.supabase.co
SUPABASE_SECRET_KEY=replace_with_server_only_supabase_secret_key
```

- [ ] **Step 6: Run focused tests and commit**

Run the Task 1 test and targeted ESLint. Expected: PASS and zero errors.

```powershell
git add package.json package-lock.json .env.example src/lib/supabase/server.ts src/lib/supabase/server.test.ts
git commit -m "feat: add server-only Supabase client"
```

---

### Task 2: Create and verify the three-table Supabase schema

**Files:**
- Create via CLI: the timestamped `create_workspace_tables.sql` file reported by `npx supabase migration new create_workspace_tables` under `supabase/migrations/`
- Create from Supabase generator: `src/lib/supabase/database.types.ts`

**Interfaces:**
- Produces: `public.tools`, `public.categories`, `public.tool_categories`
- Produces: generated `Database` TypeScript type.
- External precondition: Supabase connector can call `get_project` for `uvicpezvhxmqcnlxjeoz`.

- [ ] **Step 1: Verify the exact remote target before writing**

Use Supabase `get_project`, `get_project_url`, `list_tables`, and `list_migrations` for `uvicpezvhxmqcnlxjeoz`. Expected URL: `https://uvicpezvhxmqcnlxjeoz.supabase.co`. Stop if the connector still returns permission denied or if any of the three table names already exist with an incompatible schema.

- [ ] **Step 2: Create the migration through the CLI**

Discover commands first, then create the migration:

```powershell
npx supabase --help
npx supabase migration new create_workspace_tables
```

Write the following schema into the CLI-generated migration file:

```sql
create table public.tools (
  id text primary key,
  owner_email text not null check (owner_email = lower(btrim(owner_email)) and length(owner_email) > 3),
  name text not null check (char_length(btrim(name)) between 1 and 60),
  url text,
  description text not null default '' check (char_length(description) <= 160),
  mono text not null,
  icon_key text,
  icon_type text not null default 'monogram' check (icon_type in ('official', 'matching', 'monogram')),
  icon_color text not null check (icon_color in ('violet', 'blue', 'pink', 'orange', 'cyan', 'teal', 'slate')),
  aliases text[] not null default '{}',
  source_type text not null check (source_type in ('internal', 'external')),
  is_favorite boolean not null default false,
  is_pinned boolean not null default false,
  last_used_at timestamptz,
  use_count integer not null default 0 check (use_count >= 0),
  check_status text not null default 'Unknown',
  check_color text not null default '#7C8698',
  last_checked_at timestamptz,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  owner_email text not null check (owner_email = lower(btrim(owner_email)) and length(owner_email) > 3),
  name text not null check (char_length(btrim(name)) between 1 and 24),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tool_categories (
  tool_id text not null references public.tools(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tool_id, category_id)
);

create unique index categories_owner_name_ci
  on public.categories (owner_email, lower(name));
create index tools_owner_sort on public.tools (owner_email, sort_order);
create index tools_owner_recent on public.tools (owner_email, last_used_at desc nulls last);
create index tool_categories_category on public.tool_categories (category_id);

alter table public.tools enable row level security;
alter table public.categories enable row level security;
alter table public.tool_categories enable row level security;

revoke all on public.tools, public.categories, public.tool_categories from anon, authenticated;
grant select, insert, update, delete on public.tools, public.categories, public.tool_categories to service_role;
```

- [ ] **Step 3: Apply the reviewed migration once**

Use Supabase `apply_migration` with name `create_workspace_tables`, target project `uvicpezvhxmqcnlxjeoz`, and the exact reviewed SQL above. Expected: successful migration result. Do not retry blindly if it reports a partial or conflicting schema.

- [ ] **Step 4: Verify structure with read-only queries**

Use `list_tables(verbose: true)` and `execute_sql` to assert:

```sql
select table_name, column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name in ('tools', 'categories', 'tool_categories')
order by table_name, ordinal_position;
```

Expected counts: `tools=22`, `categories=6`, `tool_categories=3`. Verify all three have RLS enabled and there are no `anon` or `authenticated` policies.

- [ ] **Step 5: Run reversible CRUD verification**

Within one SQL transaction, insert an owner `codex-schema-check@example.invalid`, one category, one tool, and one relationship; select and update them; then roll back. Confirm that zero verification rows remain afterward.

- [ ] **Step 6: Run advisors and generate types**

Run Supabase security and performance advisors. Fix only issues introduced by these tables. Generate TypeScript types with `generate_typescript_types` and save the returned type definition as `src/lib/supabase/database.types.ts`.

- [ ] **Step 7: Commit the schema and types**

```powershell
git add supabase/migrations src/lib/supabase/database.types.ts
git commit -m "feat: create Supabase workspace schema"
```

---

### Task 3: Add contracts, mapping, owner authorization, and repository queries

**Files:**
- Create: `src/lib/dashboard/workspace-data.test.ts`
- Create: `src/lib/dashboard/workspace-data.ts`
- Create: `src/lib/dashboard/owner-session.test.ts`
- Create: `src/lib/dashboard/owner-session.ts`
- Create: `src/lib/dashboard/workspace-repository.test.ts`
- Create: `src/lib/dashboard/workspace-repository.ts`

**Interfaces:**
- Produces: `WorkspaceSnapshot`, `LocalMigrationPayload`, `toolRowToTool`, `buildMigrationPayload`.
- Produces: `requireOwnerEmail(): Promise<string>` and `OwnerAuthorizationError`.
- Produces repository functions: `getWorkspaceSnapshot`, `migrateLocalWorkspace`, `createWorkspaceTool`, `patchWorkspaceTool`, `createWorkspaceCategory`.

- [ ] **Step 1: Write failing mapping and payload tests**

Test that a snake_case database tool plus two related category names maps to the current `Tool` shape, including `icon_color -> accent`, `source_type -> sourceType`, `is_favorite -> favorite`, and category names -> `tags`. Test malformed aliases, excessive aliases, invalid URLs, duplicate categories, and unknown patch keys are rejected.

- [ ] **Step 2: Verify RED and implement contracts**

Run the focused test; expect missing exports. Implement pure mapping/validation functions with no React, Next.js, or Supabase dependency. Reuse existing validation behavior from `custom-tools.ts` rather than duplicating rules.

- [ ] **Step 3: Write failing owner authorization tests**

Inject an `authReader` into `requireOwnerEmail` for tests. Assert missing session -> `401`, non-owner email -> `403`, and matching mixed-case email -> normalized lowercase email. The production default calls `auth()` from `src/auth.ts`.

- [ ] **Step 4: Verify RED and implement authorization**

Implement `requireOwnerEmail` so it compares the session email with `AUTH_OWNER_EMAIL` using trimmed lowercase values and returns no session contents to callers on failure.

- [ ] **Step 5: Write failing repository behavior tests**

Use a narrow injected database port rather than a network mock. Assert that every tool/category query includes `owner_email`, built-in seeding preserves mutable fields, migration is idempotent, relationship ownership is verified, failed relationship creation compensates by deleting the new tool, and recent updates increment `use_count`.

- [ ] **Step 6: Verify RED and implement repository functions**

Implement the minimal owner-scoped queries. Seed `TOOLS_RAW` with `upsert(..., { onConflict: "id", ignoreDuplicates: true })`; seed default categories by case-insensitive lookup before insert. Build `WorkspaceSnapshot` only after all three query groups succeed.

- [ ] **Step 7: Run focused tests and commit**

```powershell
node --test --experimental-strip-types src/lib/dashboard/workspace-data.test.ts src/lib/dashboard/owner-session.test.ts src/lib/dashboard/workspace-repository.test.ts
git add src/lib/dashboard/workspace-data.ts src/lib/dashboard/workspace-data.test.ts src/lib/dashboard/owner-session.ts src/lib/dashboard/owner-session.test.ts src/lib/dashboard/workspace-repository.ts src/lib/dashboard/workspace-repository.test.ts
git commit -m "feat: add Supabase workspace repository"
```

---

### Task 4: Expose owner-protected Next.js Route Handlers

**Files:**
- Create: `src/app/api/workspace-data/route.test.ts`
- Create: `src/app/api/workspace-data/route.ts`
- Create: `src/app/api/workspace-data/migrate/route.test.ts`
- Create: `src/app/api/workspace-data/migrate/route.ts`
- Create: `src/app/api/tools/route.test.ts`
- Create: `src/app/api/tools/route.ts`
- Create: `src/app/api/tools/[id]/route.test.ts`
- Create: `src/app/api/tools/[id]/route.ts`
- Create: `src/app/api/categories/route.test.ts`
- Create: `src/app/api/categories/route.ts`

**Interfaces:**
- `GET /api/workspace-data -> WorkspaceSnapshot`
- `POST /api/workspace-data/migrate(LocalMigrationPayload) -> WorkspaceSnapshot`
- `POST /api/tools({ draft, pin }) -> { tool: Tool }`
- `PATCH /api/tools/[id](ToolPatch) -> { tool: Tool }`
- `POST /api/categories({ name }) -> { category: CategoryRecord }`

- [ ] **Step 1: Write failing route tests**

For each route, inject authorization/repository dependencies through exported handler factories. Assert `401`, `403`, `400`, `502`, and `503` mappings, plus one success response. Assert errors contain no owner email, Supabase URL, or secret.

- [ ] **Step 2: Verify RED**

Run the five route test files. Expected: FAIL because route factories do not exist.

- [ ] **Step 3: Implement GET and migration routes**

Use native `Request` and `Response.json`. Mark data routes `export const dynamic = "force-dynamic"`. Parse JSON once, validate with the pure Task 3 contracts, call `requireOwnerEmail`, then call the repository.

- [ ] **Step 4: Implement tool and category mutation routes**

Use the Next.js 16 generated route context shape for `[id]`:

```ts
export async function PATCH(request: Request, context: RouteContext<"/api/tools/[id]">) {
  const { id } = await context.params;
  // authorize, validate, mutate, respond
}
```

Allow only fields explicitly represented by `ToolPatch`; reject owner and ID changes.

- [ ] **Step 5: Run route tests, type generation, and commit**

```powershell
node --test --experimental-strip-types src/app/api/workspace-data/route.test.ts src/app/api/workspace-data/migrate/route.test.ts src/app/api/tools/route.test.ts "src/app/api/tools/[id]/route.test.ts" src/app/api/categories/route.test.ts
npx next typegen
git add src/app/api/workspace-data src/app/api/tools src/app/api/categories
git commit -m "feat: add owner-protected workspace APIs"
```

---

### Task 5: Replace browser-only tool state with server synchronization

**Files:**
- Create: `src/hooks/useCustomTools.supabase.test.ts`
- Modify: `src/hooks/useCustomTools.ts`
- Modify: `src/lib/dashboard/custom-tools.ts`
- Modify: `src/lib/dashboard/recent-tools.ts`
- Modify: `src/lib/dashboard/recent-tools.test.ts`

**Interfaces:**
- Preserves: `tools`, `customTools`, `categories`, `pinnedToolIds`.
- Changes to async: `addCategory(name): Promise<AddCategoryResult>`, `addTool(draft, pin): Promise<Tool>`, `setToolPinned(id, pinned): Promise<void>`.
- Adds: `setToolFavorite(id, favorite): Promise<void>`, `loading`, `syncError`, `retrySync()`.

- [ ] **Step 1: Write failing cache/migration tests**

Test cache-first render, server replacement, one-time migration marker behavior, marker omission on failure, idempotent retry, optimistic pin/favorite rollback, and preservation of local data after successful migration. Use a fake `WorkspaceApi` injected into the hook helper rather than mocking global fetch in every test.

- [ ] **Step 2: Verify RED and extract the API adapter**

Add focused client functions in `workspace-data.ts`: `fetchWorkspaceSnapshot`, `migrateWorkspaceSnapshot`, `postWorkspaceTool`, `postWorkspaceCategory`, and `patchWorkspaceTool`. Each uses `cache: "no-store"`, checks `response.ok`, and throws a safe `WorkspaceSyncError`.

- [ ] **Step 3: Implement cache-first hydration and migration**

Keep the deferred initial localStorage read to satisfy React lint. Fetch the server snapshot after mount. If `phil-studio:supabase-migrated:v1` is missing, build a payload from custom tool/category/pin keys and `phil-studio:recent-tools`, post it, refetch, then set the marker. Never remove the source keys.

- [ ] **Step 4: Implement optimistic mutations with rollback**

Category and Add Tool waits for the server response. Pin and favorite update local state first, call PATCH, and restore the previous snapshot on rejection. Dispatch the existing same-tab change event after successful cache writes.

- [ ] **Step 5: Update recent-use recording**

Keep writing the current recent localStorage entry first, then call `PATCH /api/tools/[id]` with `{ recordUse: true, usedAt: new Date().toISOString() }` without awaiting before `window.open`. Catch the promise to avoid an unhandled rejection.

- [ ] **Step 6: Run focused tests and commit**

```powershell
node --test --experimental-strip-types src/hooks/useCustomTools.test.ts src/hooks/useCustomTools.supabase.test.ts src/lib/dashboard/recent-tools.test.ts
git add src/hooks/useCustomTools.ts src/hooks/useCustomTools.supabase.test.ts src/lib/dashboard/custom-tools.ts src/lib/dashboard/recent-tools.ts src/lib/dashboard/recent-tools.test.ts
git commit -m "feat: sync workspace state with Supabase"
```

---

### Task 6: Await mutations in Add Tool and dashboard surfaces

**Files:**
- Modify: `src/components/dashboard/AddToolModal.tsx`
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/hooks/useDashboardState.ts`
- Modify: `src/hooks/useAllPageState.ts`
- Modify: `src/hooks/useFavsPageState.ts`
- Modify: `src/hooks/useManagePageState.ts`
- Modify: `src/hooks/useRecentPageState.ts`
- Modify: `src/hooks/useShellState.ts`
- Modify: relevant existing `.test.ts` files beside these modules.

**Interfaces:**
- Consumes the async hook API from Task 5.
- Preserves all visible labels, 500-icon picker behavior, multi-category selection, alias search, and indigo theme.

- [ ] **Step 1: Write failing UI source/behavior tests**

Assert both Add Tool implementations `await addTool`, keep the modal open on rejection, show the safe inline error, disable duplicate submits, and await dynamic category creation before auto-selecting it. Add tests proving favorite and pin controls call the async persistent mutations.

- [ ] **Step 2: Verify RED**

Run the relevant Add Tool, dashboard, and hook tests. Expected failures show the existing synchronous calls.

- [ ] **Step 3: Implement awaited Add Tool/category mutations**

Make `handleSave` async with `try/finally`; call `onClose()` only after the server returns. Change `CategorySelector.onCreate` to return `Promise<string>` and keep the inline creator open with an alert on failure.

- [ ] **Step 4: Wire favorite, pin, search, category statistics, and recent views**

Use the server snapshot from `useCustomTools` across Dashboard, All, Favorites, Manage, Recent, and global search. Preserve aliases in `matchesToolQuery`; derive category statistics from merged tool relationships.

- [ ] **Step 5: Run focused tests and commit**

```powershell
node --test --experimental-strip-types src/app/dashboard/add-tool-local-save.test.ts src/app/dashboard/custom-tool-search.test.ts src/components/dashboard/CategorySelector.test.ts src/hooks/useShellState.search.test.ts
git add src/components/dashboard/AddToolModal.tsx src/app/dashboard/page.tsx src/hooks
git commit -m "feat: persist dashboard tool interactions"
```

---

### Task 7: Configure secrets and perform end-to-end verification

**Files:**
- Modify locally only: `.env.local` (never stage)
- No temporary QA route may remain after verification.

**Interfaces:**
- Consumes the target project URL and a user-supplied server secret key.
- Produces evidence for database, API, UI, regression, and security acceptance.

- [ ] **Step 1: Configure local and Vercel server secrets**

Add `SUPABASE_URL` and `SUPABASE_SECRET_KEY` to `.env.local` without printing values. Add the same names to the Vercel project environments only if the user authorizes deployment configuration. Verify with a boolean presence check, never by echoing the values.

- [ ] **Step 2: Run remote database verification**

Use `list_tables(verbose: true)`, `list_migrations`, security advisors, and performance advisors. Execute read-only counts for all three tables. Expected: schema matches Task 2, RLS enabled, no introduced critical advisor findings.

- [ ] **Step 3: Run API authorization and persistence checks**

With the local server running, verify unauthenticated calls return `401`. Through the owner session, create a uniquely named QA category and tool, patch favorite/pin/recent use, refetch, and verify all values and relationships. Remove only those QA rows through owner-protected APIs or an exact SQL predicate.

- [ ] **Step 4: Run browser acceptance**

Verify Add Tool can create and select multiple categories, select one of 500 icons and a color, add an alias, pin the tool, save it, find it by alias, see it in category statistics and Recent, and retain it after reload. Simulate one failed mutation and verify inline error plus optimistic rollback. Remove only the QA record afterward.

- [ ] **Step 5: Run consolidated regression checks**

```powershell
node --test --experimental-strip-types --test-concurrency=1
npx eslint src/lib/supabase src/lib/dashboard/workspace-data.ts src/lib/dashboard/workspace-repository.ts src/lib/dashboard/owner-session.ts src/app/api/workspace-data src/app/api/tools src/app/api/categories src/hooks/useCustomTools.ts src/components/dashboard/CategorySelector.tsx src/components/dashboard/AddToolModal.tsx src/app/dashboard/page.tsx
npm run build
git diff --check
git status --short --branch
```

Expected: all tests pass, zero new lint errors, production build succeeds, diff check is clean, `.env.local` remains unstaged, and no QA data or temporary routes remain.

- [ ] **Step 6: Commit any verification-only tracked fixes**

If verification required a tracked correction, rerun the affected test before committing only that correction. Otherwise create no empty commit.

---

## Execution Gate

Do not start Task 1 until the implementation approach is selected. Do not start Task 2 until the Supabase connector can successfully read project `uvicpezvhxmqcnlxjeoz`. Do not start Task 7 until a server secret key is available through secure environment configuration.
