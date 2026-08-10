# Add Tool 500 Icon Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Add Tool from 100 to exactly 500 searchable, colorable Lucide icons in twenty categories while keeping the initial modal bundle free of 500 static icon component imports.

**Architecture:** Replace the component-bearing icon registry with serializable metadata and resolve allowlisted Lucide names through `lucide-react/dynamicIconImports`. A focused lazy renderer owns loading and fallback behavior; the existing picker owns category/search state and renders only the active result set. Both Add Tool consumers retain the existing `iconKey` and `accent` state contract.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS Modules, `lucide-react@1.28.0`, Node test runner, ESLint.

## Global Constraints

- The registry contains exactly 500 unique keys across exactly twenty non-empty categories.
- Preserve every key in the current 100-icon registry; keep defaults `app-window` and `blue`.
- Do not add brand logos, uploaded assets, Supabase work, or unrelated Add Tool changes.
- Do not statically import icon components into the metadata registry.
- Only registry-allowlisted names may reach Lucide's dynamic import map.
- Search matches key, label, category, English keywords, and curated Chinese keywords.
- Desktop categories and results scroll independently; at or below 560px categories become a horizontal row.
- All icon selection targets remain at least 44 by 44 CSS pixels.

---

### Task 1: Build the 500-item serializable metadata registry

**Files:**
- Modify: `src/lib/dashboard/tool-icons.ts`
- Modify: `src/lib/dashboard/tool-icons.test.ts`

**Interfaces:**
- Produces: `ICON_CATEGORIES`, `ToolIconCategory`, `ToolIconMetadata`, `TOOL_ICONS`, `ToolIconKey`, `DEFAULT_TOOL_ICON_KEY`, `getToolIcon(key)`, and `searchToolIcons(query, category)`.
- Consumes: no React components; all values are plain strings and readonly arrays.

- [ ] **Step 1: Freeze the old-key compatibility contract in a failing test**

In `tool-icons.test.ts`, add an `ORIGINAL_TOOL_ICON_KEYS` readonly array containing the 100 current keys from `app-window` through `gift`. Assert that every old key exists after expansion, `TOOL_ICONS.length === 500`, all keys are unique, `ICON_CATEGORIES.length === 20`, and every category count is greater than zero.

```ts
assert.equal(TOOL_ICONS.length, 500);
assert.equal(new Set(TOOL_ICONS.map(({ key }) => key)).size, 500);
assert.equal(ICON_CATEGORIES.length, 20);
for (const category of ICON_CATEGORIES) {
  assert.ok(TOOL_ICONS.some((icon) => icon.category === category));
}
for (const key of ORIGINAL_TOOL_ICON_KEYS) {
  assert.equal(getToolIcon(key).key, key);
}
```

- [ ] **Step 2: Add search and serializability failure cases**

Assert an English label query, an English category query, and a Chinese keyword query each return a known item. Assert unknown values fall back to `app-window`, and assert metadata has no `Icon` property or function values.

```ts
assert.ok(searchToolIcons("automation", "all").length > 0);
assert.ok(searchToolIcons("Security", "all").length > 0);
assert.ok(searchToolIcons("数据库", "all").some(({ key }) => key === "database"));
assert.equal(getToolIcon("not-real").key, "app-window");
assert.ok(TOOL_ICONS.every((item) => !("Icon" in item)));
assert.doesNotThrow(() => JSON.stringify(TOOL_ICONS));
```

- [ ] **Step 3: Run the registry test and confirm the old 100-item implementation fails**

Run: `node --test src/lib/dashboard/tool-icons.test.ts`

Expected: FAIL because the registry has 100 entries, seven categories, and component-bearing records.

- [ ] **Step 4: Replace the registry with twenty typed metadata groups**

Define the exact approved categories and a metadata-only helper:

```ts
export const ICON_CATEGORIES = [
  "Popular", "Work & Business", "Productivity", "Design", "Development",
  "AI & Automation", "Data & Analytics", "Communication",
  "Files & Documents", "Media", "Education", "Finance & Commerce",
  "Security", "Cloud & Network", "Devices & Hardware",
  "Travel & Location", "Health & Lifestyle", "Nature & Weather",
  "Buildings & Places", "Actions & Status",
] as const;

export interface ToolIconMetadata {
  key: string;
  label: string;
  category: ToolIconCategory;
  keywords: readonly string[];
}

function defineIcon(
  key: string,
  label: string,
  category: ToolIconCategory,
  keywords: readonly string[] = [],
): ToolIconMetadata {
  return { key, label, category, keywords };
}
```

Author twenty category blocks totalling exactly 500 entries. Reassign all original keys to the closest new category without renaming them. Use canonical kebab-case Lucide names, human-readable English labels, and useful English/Chinese synonyms; replace the currently mojibake Chinese strings with valid UTF-8 text. Keep `Popular` concise and distribute the remaining records by real use rather than equal padding.

- [ ] **Step 5: Preserve lookup and search behavior with the new types**

Keep a key map and search over all serializable fields:

```ts
export type ToolIconKey = (typeof TOOL_ICONS)[number]["key"];
export const DEFAULT_TOOL_ICON_KEY: ToolIconKey = "app-window";
const iconsByKey = new Map(TOOL_ICONS.map((icon) => [icon.key, icon]));

export function getToolIcon(key: string | null | undefined): ToolIconMetadata {
  return iconsByKey.get(key ?? "") ?? iconsByKey.get(DEFAULT_TOOL_ICON_KEY)!;
}
```

When `query.trim()` is non-empty, search ignores category; otherwise return only the requested category. Normalize with `toLocaleLowerCase()`.

- [ ] **Step 6: Run the registry test**

Run: `node --test src/lib/dashboard/tool-icons.test.ts`

Expected: PASS for 500 uniqueness, twenty non-empty categories, old-key compatibility, bilingual search, fallback, and serializability.

- [ ] **Step 7: Commit the registry**

```bash
git add src/lib/dashboard/tool-icons.ts src/lib/dashboard/tool-icons.test.ts
git commit -m "feat: expand tool icon metadata to 500"
```

---

### Task 2: Add an allowlisted dynamic Lucide renderer

**Files:**
- Create: `src/components/dashboard/DynamicToolIcon.tsx`
- Create: `src/components/dashboard/DynamicToolIcon.module.css`
- Create: `src/components/dashboard/DynamicToolIcon.test.ts`
- Modify: `src/lib/dashboard/tool-icons.test.ts`

**Interfaces:**
- Consumes: `ToolIconKey`, `DEFAULT_TOOL_ICON_KEY`, `getToolIcon()` and `TOOL_ICONS` from Task 1; `dynamicIconImports` from `lucide-react/dynamicIconImports`.
- Produces: default component `DynamicToolIcon({ iconKey, ...svgProps })` accepting `iconKey: string` plus `LucideProps`.

- [ ] **Step 1: Write failing resolver-contract tests**

Read the renderer and registry as source where necessary, and import `dynamicIconImports` in the registry test. Assert every registry key is a property of the installed map, the renderer resolves through that map, and the fallback key is referenced.

```ts
for (const { key } of TOOL_ICONS) {
  assert.ok(key in dynamicIconImports, `Missing Lucide dynamic import: ${key}`);
}
```

Also assert the renderer contains `React.lazy`, `Suspense`, `DEFAULT_TOOL_ICON_KEY`, and an error boundary or rejected-import fallback path.

- [ ] **Step 2: Run tests and verify failure**

Run: `node --test src/lib/dashboard/tool-icons.test.ts src/components/dashboard/DynamicToolIcon.test.ts`

Expected: FAIL because the dynamic renderer does not exist and any invalid curated names are reported explicitly.

- [ ] **Step 3: Correct registry names reported by the installed-map test**

Replace only missing keys with the intended canonical keys present in `lucide-react@1.28.0`. Re-run the registry test until all 500 keys resolve; do not weaken the assertion or accept arbitrary import paths.

- [ ] **Step 4: Implement cached lazy loading and fallback**

Build a module-level cache keyed by the validated icon name. Resolve `getToolIcon(iconKey).key`, look up that key in `dynamicIconImports`, and lazy-load the returned icon module. Normalize Lucide's module shape to `{ default: module.default }`. If loading rejects, render the cached `app-window` loader. Wrap the lazy icon in a local error boundary so one failed chunk does not close or crash Add Tool.

```ts
interface DynamicToolIconProps extends LucideProps {
  iconKey: string;
}

export default function DynamicToolIcon({ iconKey, ...props }: DynamicToolIconProps) {
  const safeKey = getToolIcon(iconKey).key;
  const Icon = getLazyIcon(safeKey);
  return (
    <IconLoadBoundary fallbackKey={DEFAULT_TOOL_ICON_KEY} iconProps={props}>
      <Suspense fallback={<span className={styles.placeholder} aria-hidden="true" />}>
        <Icon {...props} />
      </Suspense>
    </IconLoadBoundary>
  );
}
```

The placeholder must use `display: inline-block`, `width: 1em`, and `height: 1em` so loading causes no layout shift.

- [ ] **Step 5: Run dynamic-renderer tests**

Run: `node --test src/lib/dashboard/tool-icons.test.ts src/components/dashboard/DynamicToolIcon.test.ts`

Expected: PASS, including all 500 installed-map checks and source-level loading/fallback contract checks.

- [ ] **Step 6: Commit the dynamic renderer**

```bash
git add src/lib/dashboard/tool-icons.test.ts src/components/dashboard/DynamicToolIcon.tsx src/components/dashboard/DynamicToolIcon.module.css src/components/dashboard/DynamicToolIcon.test.ts
git commit -m "feat: dynamically load tool icons"
```

---

### Task 3: Upgrade the picker to twenty scrollable categories

**Files:**
- Modify: `src/components/dashboard/ToolIconPicker.tsx`
- Modify: `src/components/dashboard/ToolIconPicker.module.css`
- Modify: `src/components/dashboard/ToolIconPicker.test.ts`

**Interfaces:**
- Consumes: `DynamicToolIcon`, metadata/search APIs from Tasks 1-2, existing `ACCENTS`, `ACCENT_RGB`, and `Accent`.
- Produces: the unchanged controlled picker props `iconKey`, `accent`, `onIconChange`, and `onAccentChange`.

- [ ] **Step 1: Expand the picker contract test**

Assert the component imports and renders `DynamicToolIcon`, displays `Search 500 icons...`, keeps `query.trim() ? "all" : activeCategory`, and never reads `definition.Icon`. Assert CSS gives `.categories` and `.results` bounded vertical overflow, preserves the 96px desktop sidebar, uses horizontal overflow at 560px, and retains 44px targets.

- [ ] **Step 2: Run the picker test and verify failure**

Run: `node --test src/components/dashboard/ToolIconPicker.test.ts`

Expected: FAIL because the existing picker reads static `Icon` fields, says 100 icons, and does not bound both scroll regions.

- [ ] **Step 3: Render selected and result icons dynamically**

Replace `const SelectedIcon = selected.Icon` and per-result `definition.Icon` usage with:

```tsx
<DynamicToolIcon iconKey={selected.key} size={21} strokeWidth={1.9} aria-hidden="true" />
```

and:

```tsx
<DynamicToolIcon iconKey={definition.key} size={20} strokeWidth={1.8} aria-hidden="true" />
```

Update only the placeholder copy to `Search 500 icons...`. Keep color selection and callbacks unchanged. Keep search global while query text exists; clicking a category clears search and activates it.

- [ ] **Step 4: Bound desktop regions and retain mobile behavior**

Set a shared bounded browser height around 300px. Apply `max-height` and `overflow-y: auto` independently to `.categories` and `.results`. At `max-width: 560px`, remove the vertical category limit, set `overflow-x: auto`, `overflow-y: hidden`, and keep the result grid independently scrollable. Preserve six desktop columns, five columns under 560px, four under 420px, and 44px minimum buttons.

- [ ] **Step 5: Run picker and registry tests**

Run: `node --test src/components/dashboard/ToolIconPicker.test.ts src/components/dashboard/DynamicToolIcon.test.ts src/lib/dashboard/tool-icons.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit picker behavior**

```bash
git add src/components/dashboard/ToolIconPicker.tsx src/components/dashboard/ToolIconPicker.module.css src/components/dashboard/ToolIconPicker.test.ts
git commit -m "feat: browse 500 tool icons by category"
```

---

### Task 4: Verify both Add Tool consumers and production behavior

**Files:**
- Modify only if the test identifies a regression: `src/components/dashboard/AddToolModal.tsx`
- Modify only if the test identifies a regression: `src/app/dashboard/page.tsx`
- Modify: `src/app/dashboard/add-tool-icon-picker-integration.test.ts`

**Interfaces:**
- Consumes: unchanged `ToolIconPicker` controlled props.
- Produces: both real Add Tool entry paths render the 500-icon picker and retain defaults `app-window` plus `blue`.

- [ ] **Step 1: Strengthen the existing integration test**

Read both consumers and assert each imports/renders `ToolIconPicker`, initializes `iconKey` with `DEFAULT_TOOL_ICON_KEY`, initializes accent with `blue`, and passes all four controlled props. Do not require consumers to know about dynamic imports.

- [ ] **Step 2: Run the focused integration suite**

Run: `node --test src/app/dashboard/add-tool-icon-picker-integration.test.ts src/components/dashboard/ToolIconPicker.test.ts src/components/dashboard/DynamicToolIcon.test.ts src/lib/dashboard/tool-icons.test.ts`

Expected: PASS. If it fails, make the smallest consumer wiring correction and repeat.

- [ ] **Step 3: Run static checks**

Run: `npx tsc --noEmit`

Run: `npm run lint -- --max-warnings=0`

Expected: PASS for changed files. Record unrelated pre-existing failures separately with exact file and line; do not modify unrelated dashboard motion, lyric, music, or visualizer code.

- [ ] **Step 4: Run a network-enabled production build and inspect bundle evidence**

Run: `npm run build`

Expected: PASS. Inspect the dashboard initial-route chunk and confirm the 500 icon component modules are not statically bundled into the initial Add Tool code path; dynamic icon chunks may appear separately.

- [ ] **Step 5: Perform real browser acceptance**

Against the existing development server, open Dashboard, click Add Tool, expand the icon picker, and verify:

1. Twenty categories are reachable by independent category scrolling.
2. Representative icons from every category load without shifting the grid.
3. English and Chinese queries search globally; clearing restores the prior category.
4. Selecting an icon and then each color changes the preview while preserving the chosen icon.
5. A no-result query shows `No icons found` and recovers when edited.
6. At 560px and 420px widths the category row scrolls horizontally and icon buttons stay usable.
7. Both Add Tool entry paths expose the same picker.

- [ ] **Step 6: Review the final diff and commit integration-only changes if any**

Run: `git diff --check`

Run: `git status --short`

If Task 4 changed consumer or integration-test files, stage only those exact files and commit:

```bash
git add src/app/dashboard/add-tool-icon-picker-integration.test.ts src/components/dashboard/AddToolModal.tsx src/app/dashboard/page.tsx
git commit -m "test: verify expanded icon picker integration"
```

Do not stage any unrelated dirty workspace files.
