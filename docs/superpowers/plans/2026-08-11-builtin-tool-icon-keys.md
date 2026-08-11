# Built-in Tool Icon Keys Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give all nine built-in tools stable, catalog-valid icon keys in both source code and the live Supabase data.

**Architecture:** `TOOLS_RAW` remains the source definition used for future owner seeding, while a timestamped data migration updates rows already stored in Supabase. The update changes only `icon_key`, `icon_type`, and `updated_at` for the nine exact built-in IDs; current icon colors and every other field remain unchanged.

**Tech Stack:** TypeScript, Node test runner, Next.js 16, Supabase Postgres migrations.

## Global Constraints

- Keep exactly the three existing business tables.
- Use only keys present in `TOOL_ICONS`.
- Preserve every existing `icon_color`.
- Set `icon_type` to `matching` for all nine built-ins.
- Never update custom tools or expose the Supabase secret.
- Target only Supabase project `uvicpezvhxmqcnlxjeoz`.

---

### Task 1: Assign catalog-valid keys in the built-in source definitions

**Files:**
- Modify: `src/lib/dashboard/mock-data.ts`
- Modify: `src/lib/dashboard/tool-icons.test.ts`

**Interfaces:**
- Consumes: `TOOLS_RAW`, `TOOL_ICONS`, and the existing `Tool.iconKey` / `Tool.iconType` fields.
- Produces: nine built-in tools whose `iconKey` values resolve through the current icon catalog and whose `iconType` is `matching`.

- [ ] **Step 1: Write the failing mapping test**

Add a test that asserts this exact mapping and verifies every key is in `TOOL_ICONS`:

```ts
const expected = {
  ap: "palette",
  cv: "contact",
  ps: "image",
  pdf: "file-text",
  am: "clapperboard",
  mm: "chart-network",
  sm: "graduation-cap",
  no: "book-open-text",
  ai: "brain-circuit",
};

assert.deepEqual(
  Object.fromEntries(TOOLS_RAW.map((tool) => [tool.id, tool.iconKey])),
  expected,
);
assert.equal(TOOLS_RAW.every((tool) => tool.iconType === "matching"), true);
assert.equal(TOOLS_RAW.every((tool) => TOOL_ICONS.some((icon) => icon.key === tool.iconKey)), true);
```

- [ ] **Step 2: Verify RED**

Run:

```powershell
node --test --experimental-strip-types src/lib/dashboard/tool-icons.test.ts
```

Expected: FAIL because all nine built-ins currently have no `iconKey`.

- [ ] **Step 3: Add the exact icon metadata**

Add `iconKey` and `iconType: "matching"` to each `TOOLS_RAW` record using the mapping above. Do not change colors, tags, URLs, favorites, or ordering.

- [ ] **Step 4: Verify GREEN and commit**

Run the focused test, targeted ESLint, and `git diff --check`. Expected: PASS.

```powershell
git add src/lib/dashboard/mock-data.ts src/lib/dashboard/tool-icons.test.ts
git commit -m "feat: assign built-in tool icons"
```

---

### Task 2: Apply and verify the scoped Supabase data migration

**Files:**
- Create via CLI: `supabase/migrations/<timestamp>_assign_builtin_icon_keys.sql`

**Interfaces:**
- Consumes: the exact nine IDs and keys from Task 1.
- Produces: live rows with matching `icon_key` and `icon_type`, without schema or permission changes.

- [ ] **Step 1: Create the migration through the current CLI**

Discover the command and create the file:

```powershell
npx supabase migration new --help
npx supabase migration new assign_builtin_icon_keys
```

- [ ] **Step 2: Add the exact guarded SQL**

```sql
with icon_mapping(id, icon_key) as (
  values
    ('ap', 'palette'),
    ('cv', 'contact'),
    ('ps', 'image'),
    ('pdf', 'file-text'),
    ('am', 'clapperboard'),
    ('mm', 'chart-network'),
    ('sm', 'graduation-cap'),
    ('no', 'book-open-text'),
    ('ai', 'brain-circuit')
)
update public.tools as tools
set icon_key = icon_mapping.icon_key,
    icon_type = 'matching',
    updated_at = now()
from icon_mapping
where tools.id = icon_mapping.id;
```

- [ ] **Step 3: Verify target and apply once**

Use Supabase MCP to verify project URL `https://uvicpezvhxmqcnlxjeoz.supabase.co`, confirm all nine current keys are null, then apply the migration once with name `assign_builtin_icon_keys`.

- [ ] **Step 4: Verify the live mapping**

Run this read-only query and compare all rows with Task 1:

```sql
select id, name, icon_key, icon_type, icon_color
from public.tools
where id in ('ap','cv','ps','pdf','am','mm','sm','no','ai')
order by sort_order, id;
```

Expected: exactly nine rows; every `icon_key` matches; every `icon_type` is `matching`; existing colors remain unchanged.

- [ ] **Step 5: Run advisors and consolidated checks**

Run Supabase security/performance advisors, the full Node suite, targeted ESLint, production build, and `git diff --check`. No new warning/error finding may be introduced.

- [ ] **Step 6: Align migration history and commit**

If Supabase assigns a different authoritative timestamp, rename the local migration file to that version without changing its SQL.

```powershell
git add supabase/migrations
git commit -m "data: assign built-in tool icon keys"
```
