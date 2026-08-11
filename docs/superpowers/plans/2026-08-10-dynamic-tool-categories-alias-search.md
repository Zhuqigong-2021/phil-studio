# Dynamic Tool Categories and Alias Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Add Tool save local tools with reusable multi-select categories and aliases that work in global search and dashboard category statistics.

**Architecture:** A pure storage/domain module validates and serializes custom categories and tools. A client hook owns browser synchronization and exposes one merged tool/category collection, while a reusable CategorySelector keeps both Add Tool implementations aligned. Dashboard consumers derive cards, search results, category statistics, and Quick Access from the merged collection.

**Tech Stack:** Next.js 16.2 App Router, React 19, TypeScript, browser `localStorage`, Node test runner, ESLint, Playwright browser verification.

## Global Constraints

- Keep the stored `tags: string[]` property for compatibility; user-facing copy says Categories.
- One tool may select multiple categories.
- Custom category names are trimmed, at most 24 characters, and unique case-insensitively.
- A tool may have at most 10 aliases; each alias is at most 32 characters and unique case-insensitively.
- Store categories under `phil-studio:custom-categories:v1` and tools under `phil-studio:custom-tools:v1`.
- Store persistent Quick Access membership under `phil-studio:pinned-tools:v1` as tool IDs.
- Do not add Supabase, category rename/delete, category colors, or tool editing.
- Preserve the 500-icon picker, indigo secondary-control theme, real color swatches, and hidden-but-scrollable icon lists.
- Preserve unrelated user files and existing dashboard behavior.

---

### Task 1: Pure Local Tool Domain and Storage Contract

**Files:**
- Create: `src/lib/dashboard/custom-tools.ts`
- Create: `src/lib/dashboard/custom-tools.test.ts`
- Modify: `src/lib/dashboard/types.ts`

**Interfaces:**
- Produces: `CUSTOM_CATEGORIES_KEY`, `CUSTOM_TOOLS_KEY`, `PINNED_TOOLS_KEY`, `normalizeCategoryName`, `mergeCategories`, `parseStoredCategories`, `parseStoredTools`, `parseStoredToolIds`, `createCustomTool`, `matchesToolQuery`, and `CustomToolDraft`.
- Consumes: existing `Tool`, `Accent`, and `SourceType` types.

- [ ] **Step 1: Write failing domain tests**

Cover exact behavior:

```ts
test("merges defaults and custom categories case-insensitively", () => {
  assert.deepEqual(mergeCategories(["AI", "Work"], [" ai ", "ServiceNow"]), [
    "AI", "Work", "ServiceNow",
  ]);
});

test("parsers reject malformed local storage payloads", () => {
  assert.deepEqual(parseStoredCategories('{"bad":true}'), []);
  assert.deepEqual(parseStoredTools('[{"name":4}]'), []);
  assert.deepEqual(parseStoredToolIds('[4, null]'), []);
});

test("search matches name aliases and categories", () => {
  const tool = createCustomTool({
    name: "Study Mate", url: "https://example.com", description: "",
    iconKey: "database", accent: "violet", tags: ["ServiceNow"],
    aliases: ["考试助手"], sourceType: "internal",
  }, "tool-1");
  assert.equal(matchesToolQuery(tool, "study"), true);
  assert.equal(matchesToolQuery(tool, "考试"), true);
  assert.equal(matchesToolQuery(tool, "servicenow"), true);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
node --experimental-strip-types --test src/lib/dashboard/custom-tools.test.ts
```

Expected: FAIL because `custom-tools.ts` does not exist.

- [ ] **Step 3: Implement the minimal pure module**

Use these signatures:

```ts
export const CUSTOM_CATEGORIES_KEY = "phil-studio:custom-categories:v1";
export const CUSTOM_TOOLS_KEY = "phil-studio:custom-tools:v1";
export const PINNED_TOOLS_KEY = "phil-studio:pinned-tools:v1";

export interface CustomToolDraft {
  name: string;
  url: string;
  description: string;
  iconKey: string;
  accent: Accent;
  tags: string[];
  aliases: string[];
  sourceType: SourceType;
}

export function normalizeCategoryName(value: string): string;
export function mergeCategories(defaults: readonly string[], custom: readonly string[]): string[];
export function parseStoredCategories(raw: string | null): string[];
export function parseStoredTools(raw: string | null): Tool[];
export function parseStoredToolIds(raw: string | null): string[];
export function createCustomTool(draft: CustomToolDraft, id: string): Tool;
export function matchesToolQuery(tool: Tool, query: string): boolean;
```

`createCustomTool` must normalize HTTP/HTTPS URLs, derive `mono` from the first two name characters, set `favorite: false`, and throw a descriptive error for an empty name or invalid protocol.

- [ ] **Step 4: Run the domain tests and verify GREEN**

Run the Task 1 test command. Expected: all tests PASS.

- [ ] **Step 5: Commit Task 1**

```powershell
git add src/lib/dashboard/custom-tools.ts src/lib/dashboard/custom-tools.test.ts src/lib/dashboard/types.ts
git commit -m "feat: define local custom tool storage"
```

---

### Task 2: Browser-Synchronized Custom Tool Hook

**Files:**
- Create: `src/hooks/useCustomTools.ts`
- Create: `src/hooks/useCustomTools.test.ts`
- Modify: `src/lib/dashboard/custom-tools.ts`

**Interfaces:**
- Consumes: Task 1 storage keys, parsers, `createCustomTool`, `mergeCategories`, `TOOLS_RAW`, and `TAGS`.
- Produces: `useCustomTools(): { tools: Tool[]; customTools: Tool[]; categories: string[]; pinnedToolIds: string[]; addCategory(name: string): AddCategoryResult; addTool(draft: CustomToolDraft, pin: boolean): Tool; setToolPinned(id: string, pinned: boolean): void }`.

```ts
export interface AddCategoryResult {
  categories: string[];
  category: string;
}
```

- [ ] **Step 1: Write failing tests for immutable storage mutations**

Extract testable functions and prove:

```ts
assert.deepEqual(addCategoryToList(["AI"], " ServiceNow "), {
  categories: ["AI", "ServiceNow"], category: "ServiceNow",
});
assert.throws(() => addCategoryToList(["AI"], "ai"), /already exists/i);
assert.throws(() => addCategoryToList([], ""), /required/i);
assert.throws(() => addCategoryToList([], "x".repeat(25)), /24 characters/i);
```

Also assert `appendCustomTool` returns a new array and does not mutate its input.

- [ ] **Step 2: Run the hook/domain tests and verify RED**

Run:

```powershell
node --experimental-strip-types --test src/hooks/useCustomTools.test.ts
```

Expected: FAIL because the hook helpers do not exist.

- [ ] **Step 3: Implement browser synchronization**

On mount, read all three feature keys safely. On mutations, write JSON and update React state in the same call. Listen for the browser `storage` event so another tab updates. Generate IDs with `crypto.randomUUID()`.

Expose built-in plus custom tools through:

```ts
const tools = React.useMemo(
  () => [...TOOLS_RAW, ...customTools],
  [customTools],
);
```

Dispatch a same-tab `CustomEvent("phil-studio:custom-tools-changed")` after writes so independent dashboard surfaces stay synchronized.

- [ ] **Step 4: Run Task 2 tests and verify GREEN**

Run the Task 2 test command. Expected: all tests PASS.

- [ ] **Step 5: Commit Task 2**

```powershell
git add src/hooks/useCustomTools.ts src/hooks/useCustomTools.test.ts src/lib/dashboard/custom-tools.ts
git commit -m "feat: synchronize local custom tools"
```

---

### Task 3: Reusable Dynamic Category Selector

**Files:**
- Create: `src/components/dashboard/CategorySelector.tsx`
- Create: `src/components/dashboard/CategorySelector.module.css`
- Create: `src/components/dashboard/CategorySelector.test.ts`
- Modify: `src/components/dashboard/AddToolModal.tsx`
- Modify: `src/app/dashboard/add-tool-icon-picker-integration.test.ts`

**Interfaces:**
- Consumes: `categories`, selected `Set<string>`, `onToggle`, and `onCreate`.
- Produces: `CategorySelector` with `+ New category`, inline Add/Cancel controls, automatic selection, and inline validation errors.

- [ ] **Step 1: Write failing component contract tests**

Assert the source contains `Categories`, `+ New category`, a 24-character limit, `onCreate`, and indigo control tokens. Assert `AddToolModal.tsx` renders `CategorySelector` instead of mapping `TAGS` directly.

- [ ] **Step 2: Run tests and verify RED**

```powershell
node --experimental-strip-types --test src/components/dashboard/CategorySelector.test.ts src/app/dashboard/add-tool-icon-picker-integration.test.ts
```

Expected: FAIL because the component is absent.

- [ ] **Step 3: Implement CategorySelector**

Use accessible buttons with `aria-pressed`, an input labelled `New category name`, and an error element with `role="alert"`. When `onCreate` succeeds, clear and close the input; the parent adds the returned category to the selected set.

- [ ] **Step 4: Integrate the shared Add Tool modal**

Replace its static Tags mapping with `CategorySelector`. Obtain `categories`, `addCategory`, and `addTool` from `useCustomTools`. Make alias duplicate checks case-insensitive.

- [ ] **Step 5: Run tests and verify GREEN**

Run the Task 3 command. Expected: all tests PASS.

- [ ] **Step 6: Commit Task 3**

```powershell
git add src/components/dashboard/CategorySelector.tsx src/components/dashboard/CategorySelector.module.css src/components/dashboard/CategorySelector.test.ts src/components/dashboard/AddToolModal.tsx src/app/dashboard/add-tool-icon-picker-integration.test.ts
git commit -m "feat: add dynamic category selector"
```

---

### Task 4: Make the Active Dashboard Add Tool Save Real Tools

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/app/dashboard/add-tool-icon-picker-integration.test.ts`
- Create: `src/app/dashboard/add-tool-local-save.test.ts`

**Interfaces:**
- Consumes: `CategorySelector`, `useCustomTools`, `CustomToolDraft`, and existing recent/Quick Access storage behavior.
- Produces: active Add Tool modal that creates categories, validates aliases, saves tools, pins requested tools, and reports errors without closing.

- [ ] **Step 1: Write failing integration tests**

Assert `AddToolModalDark` receives `categories`, `onCreateCategory`, and `onSaveTool` props rather than owning an isolated fake timer. Assert the save path passes `name`, `url`, `description`, `iconKey`, `accent`, selected `tags`, `aliases`, and `sourceType`.

- [ ] **Step 2: Run the new integration test and verify RED**

```powershell
node --experimental-strip-types --test src/app/dashboard/add-tool-local-save.test.ts src/app/dashboard/add-tool-icon-picker-integration.test.ts
```

Expected: FAIL because Save still uses a timer and closes without persisting.

- [ ] **Step 3: Lift custom-tool state to `DarkThemePage`**

Call `useCustomTools` once in the dashboard root. Pass merged tools/categories and mutation callbacks down to `HeroSection`, `GlobalSearchBar`, `CategoriesPanel`, and `AddToolModalDark` through explicit props.

- [ ] **Step 4: Replace fake Save with validated persistence**

Construct a `CustomToolDraft`, call `onSaveTool`, and only close on success. Render inline errors for missing name, invalid URL, duplicate alias, or localStorage failure. If Pin is enabled, call `addTool(draft, true)` so the returned tool ID is also written to `phil-studio:pinned-tools:v1`.

- [ ] **Step 5: Run Task 4 tests and verify GREEN**

Run the Task 4 command. Expected: all tests PASS.

- [ ] **Step 6: Commit Task 4**

```powershell
git add src/app/dashboard/page.tsx src/app/dashboard/add-tool-local-save.test.ts src/app/dashboard/add-tool-icon-picker-integration.test.ts
git commit -m "feat: save tools from Add Tool"
```

---

### Task 5: Merge Custom Tools into Cards, Search, and Categories

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Create: `src/app/dashboard/custom-tool-search.test.ts`
- Modify: `src/hooks/useAllPageState.ts`
- Modify: `src/hooks/useDashboardState.ts`
- Modify: `src/hooks/useFavsPageState.ts`
- Modify: `src/hooks/useManagePageState.ts`
- Modify: `src/hooks/useRecentPageState.ts`

**Interfaces:**
- Consumes: merged `Tool[]`, `matchesToolQuery`, `decorate`, and `DynamicToolIcon`.
- Produces: searchable custom tools and consistent custom-tool visibility across dashboard routes.

- [ ] **Step 1: Write failing search/category tests**

Prove that a custom tool is returned for its alias and category, that built-in name search remains functional, and that category percentages include custom tool assignments while an unused custom category reports zero.

- [ ] **Step 2: Run tests and verify RED**

```powershell
node --experimental-strip-types --test src/app/dashboard/custom-tool-search.test.ts
```

Expected: FAIL because `GlobalSearchBar` only checks `label` and Categories uses `TOOLS_RAW`/`TAGS` directly.

- [ ] **Step 3: Derive dashboard view models from merged tools**

Replace the fixed dashboard-only `allTools` dependency with a pure mapper from `Tool` to the existing tile model. Use `DynamicToolIcon` for `iconKey` and the existing mono fallback otherwise. Keep existing hardcoded visual colors as defaults derived from each tool accent.

- [ ] **Step 4: Update search and category statistics**

Use `matchesToolQuery` for name, aliases, and tags. Pass merged tools and categories into `CategoriesPanel`; calculate percentages from all tag assignments and retain zero-percent categories.

- [ ] **Step 5: Update route state hooks**

Replace direct `TOOLS_RAW`-only derivations in All, Dashboard, Favorites, Manage, and Recent hooks with `useCustomTools().tools`. Do not change their existing favorite, visibility, recent, or editing behavior beyond allowing custom records to participate.

- [ ] **Step 6: Run Task 5 tests and the focused regression suite**

```powershell
node --experimental-strip-types --test src/app/dashboard/custom-tool-search.test.ts src/lib/dashboard/custom-tools.test.ts src/hooks/useCustomTools.test.ts src/components/dashboard/CategorySelector.test.ts src/app/dashboard/add-tool-local-save.test.ts src/app/dashboard/add-tool-icon-picker-integration.test.ts src/components/dashboard/ToolIconPicker.test.ts src/lib/dashboard/tool-icons.test.ts
```

Expected: all tests PASS.

- [ ] **Step 7: Commit Task 5**

```powershell
git add src/app/dashboard/page.tsx src/app/dashboard/custom-tool-search.test.ts src/hooks/useAllPageState.ts src/hooks/useDashboardState.ts src/hooks/useFavsPageState.ts src/hooks/useManagePageState.ts src/hooks/useRecentPageState.ts
git commit -m "feat: search and display custom tools"
```

---

### Task 6: Consolidated Static Verification

**Files:**
- Modify only files required by failures directly caused by Tasks 1-5.

**Interfaces:**
- Consumes: completed feature.
- Produces: passing full suite, lint, and production build.

- [ ] **Step 1: Run all TypeScript tests**

```powershell
node --experimental-strip-types --test (Get-ChildItem -Recurse -Filter '*.test.ts' src).FullName
```

Expected: all tests PASS.

- [ ] **Step 2: Run targeted ESLint**

```powershell
npx eslint src/app/dashboard/page.tsx src/components/dashboard/AddToolModal.tsx src/components/dashboard/CategorySelector.tsx src/hooks/useCustomTools.ts src/hooks/useAllPageState.ts src/hooks/useDashboardState.ts src/hooks/useFavsPageState.ts src/hooks/useManagePageState.ts src/hooks/useRecentPageState.ts src/lib/dashboard/custom-tools.ts
```

Expected: zero errors; document pre-existing warnings without unrelated cleanup.

- [ ] **Step 3: Run the production build**

```powershell
npm run build
```

Expected: Next.js compilation, TypeScript, static generation, and route collection succeed.

- [ ] **Step 4: Commit verification fixes if required**

```powershell
git add src/app/dashboard/page.tsx src/components/dashboard/AddToolModal.tsx src/components/dashboard/CategorySelector.tsx src/hooks/useCustomTools.ts src/hooks/useAllPageState.ts src/hooks/useDashboardState.ts src/hooks/useFavsPageState.ts src/hooks/useManagePageState.ts src/hooks/useRecentPageState.ts src/lib/dashboard/custom-tools.ts
git commit -m "fix: complete local tool integration"
```

Skip this commit when no code changes are required.

---

### Task 7: Browser Acceptance and Final Handoff

**Files:**
- No permanent files expected; any temporary QA route must be deleted before completion.

**Interfaces:**
- Consumes: production-ready local feature.
- Produces: visual and behavioral acceptance evidence.

- [ ] **Step 1: Start the development server on an unused port**

```powershell
npx next dev -p 3101
```

- [ ] **Step 2: Verify the complete Add Tool journey with Playwright**

Perform this exact journey:

1. open `/dashboard` and Add Tool;
2. create category `Knowledge Base`;
3. select it alongside `AI`;
4. enter a unique tool name and valid URL;
5. add alias `知识库测试`;
6. select a non-default icon and color;
7. enable Pin to Quick Access;
8. save and verify the tool appears without reload;
9. search `知识库测试` and verify the real tool name appears;
10. open the Categories panel and verify `Knowledge Base` participates;
11. reload and verify tool/category/search persistence.

- [ ] **Step 3: Check visual and runtime quality**

Verify zero console errors, no Next.js error overlay, indigo controls remain consistent, the 500-icon picker opens, and category/icon lists scroll with hidden scrollbars. Capture a screenshot of the completed Add Tool category UI and alias search result.

- [ ] **Step 4: Remove browser test data**

Delete only the `Knowledge Base` test category and the uniquely named QA tool from the two feature-owned localStorage keys. Do not clear unrelated browser storage.

- [ ] **Step 5: Confirm a clean tracked worktree and report**

```powershell
git status --porcelain --untracked-files=no
git log --oneline -8
```

Expected: no tracked modifications remain. Report changed behavior, test/build results, browser evidence, remaining Supabase migration boundary, and whether changes were pushed.
