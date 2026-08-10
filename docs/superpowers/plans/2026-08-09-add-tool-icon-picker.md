# Add Tool Icon Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a searchable, categorized picker of exactly 100 colorable Lucide icons to the existing Add Tool form.

**Architecture:** A pure icon registry module owns verified icon metadata, search, and safe fallback. A controlled `ToolIconPicker` client component owns picker-only UI state while `AddToolModal` retains the selected `iconKey` and `accent` in its form state. No persistence or Supabase integration is added in this feature.

**Tech Stack:** Next.js 16.2.10 App Router, React 19.2.4, TypeScript, lucide-react 1.28.0, Node test runner, ESLint.

## Global Constraints

- Use exactly 100 verified exports from the installed `lucide-react` package.
- Categories are Popular, Work, Design, Code, Media, Files, and Objects.
- Defaults are `iconKey: "app-window"` and `accent: "blue"`.
- Unknown icon keys fall back to `app-window`.
- Store or expose stable icon keys only; never persist SVG markup or dynamically import a user-provided component name.
- Do not implement Supabase, custom image uploads, favicons, or brand-logo libraries.
- Preserve all existing Add Tool fields and its current mock save behavior.

---

## File Structure

- Create `src/lib/dashboard/tool-icons.ts`: typed registry, categories, normalized search, and safe icon lookup.
- Create `src/lib/dashboard/tool-icons.test.ts`: registry count, uniqueness, category counts, search, and fallback tests.
- Create `src/components/dashboard/ToolIconPicker.tsx`: controlled picker UI and local search/category/open state.
- Create `src/components/dashboard/ToolIconPicker.module.css`: desktop sidebar layout, icon grid styling, and narrow-screen horizontal categories.
- Create `src/components/dashboard/ToolIconPicker.test.ts`: source-level UI contract checks compatible with the existing dependency set.
- Modify `src/components/dashboard/AddToolModal.tsx`: replace monogram generation with selected Lucide icon and integrate the picker.
- Create `src/components/dashboard/AddToolModal.icon-picker.test.ts`: integration contract for defaults and controlled values.

### Task 1: Build and verify the icon registry

**Files:**
- Create: `src/lib/dashboard/tool-icons.ts`
- Test: `src/lib/dashboard/tool-icons.test.ts`

**Interfaces:**
- Produces: `ICON_CATEGORIES`, `TOOL_ICONS`, `DEFAULT_TOOL_ICON_KEY`, `ToolIconKey`, `ToolIconCategory`, `getToolIcon(key)`, and `searchToolIcons(query, category)`.
- `getToolIcon(key: string | null | undefined): ToolIconDefinition` always returns a definition.
- `searchToolIcons(query: string, category: ToolIconCategory | "all"): ToolIconDefinition[]` performs case-insensitive normalized matching.

- [ ] **Step 1: Write failing registry tests**

```ts
test("contains exactly 100 unique icons in the approved category counts", () => {
  assert.equal(TOOL_ICONS.length, 100);
  assert.equal(new Set(TOOL_ICONS.map(({ key }) => key)).size, 100);
  assert.deepEqual(categoryCounts(), {
    Popular: 16, Work: 14, Design: 14, Code: 14,
    Media: 14, Files: 14, Objects: 14,
  });
});

test("searches labels, keys, categories, and bilingual keywords", () => {
  assert.ok(searchToolIcons("briefcase", "all").some(({ key }) => key === "briefcase-business"));
  assert.ok(searchToolIcons("工作", "all").some(({ key }) => key === "briefcase-business"));
  assert.ok(searchToolIcons("", "Design").every(({ category }) => category === "Design"));
});

test("falls back safely for an unknown key", () => {
  assert.equal(getToolIcon("not-real").key, "app-window");
});
```

- [ ] **Step 2: Run tests and confirm the missing-module failure**

Run: `node --test src/lib/dashboard/tool-icons.test.ts`

Expected: FAIL because `tool-icons.ts` does not exist.

- [ ] **Step 3: Implement the static registry and pure helpers**

Create the seven category constants and 100 static definitions using verified Lucide imports. Normalize searchable text with `toLocaleLowerCase()` and combine `key`, `label`, `category`, and `keywords`. Build a module-private `Map` for safe lookup and return the default definition when a key is missing.

- [ ] **Step 4: Run registry tests**

Run: `node --test src/lib/dashboard/tool-icons.test.ts`

Expected: 3 tests PASS.

### Task 2: Build the responsive controlled picker

**Files:**
- Create: `src/components/dashboard/ToolIconPicker.tsx`
- Create: `src/components/dashboard/ToolIconPicker.module.css`
- Test: `src/components/dashboard/ToolIconPicker.test.ts`

**Interfaces:**
- Consumes: registry exports from Task 1; `ACCENTS` and `ACCENT_RGB`; `Accent`.
- Produces: `ToolIconPicker({ iconKey, accent, onIconChange, onAccentChange })`.

```ts
interface ToolIconPickerProps {
  iconKey: string;
  accent: Accent;
  onIconChange: (iconKey: ToolIconKey) => void;
  onAccentChange: (accent: Accent) => void;
}
```

- [ ] **Step 1: Write failing UI contract tests**

Read the component and stylesheet as source, then assert the component includes the accessible search label, all seven category labels through `ICON_CATEGORIES`, `aria-pressed` for selection, `No icons found`, both callbacks, and a CSS media query that changes the category list to a horizontal row below 560px.

- [ ] **Step 2: Run tests and confirm failure**

Run: `node --test src/components/dashboard/ToolIconPicker.test.ts`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the picker**

Use local `query`, `activeCategory`, and `open` state. Render a button containing the selected icon and selected label. When open, render the search input, sidebar categories, filtered icon buttons, no-results state, and the seven accent buttons. Use `currentColor` through the Lucide component's `color` inheritance; calculate the preview background and border from `ACCENT_RGB`.

- [ ] **Step 4: Implement responsive CSS**

Desktop uses a two-column `96px minmax(0, 1fr)` layout. At `max-width: 560px`, switch to one column, make categories a horizontally scrollable flex row, and retain a minimum 44px icon-button target.

- [ ] **Step 5: Run picker and registry tests**

Run: `node --test src/lib/dashboard/tool-icons.test.ts src/components/dashboard/ToolIconPicker.test.ts`

Expected: all tests PASS.

### Task 3: Integrate the picker into Add Tool

**Files:**
- Modify: `src/components/dashboard/AddToolModal.tsx:3-52,111-192`
- Test: `src/components/dashboard/AddToolModal.icon-picker.test.ts`

**Interfaces:**
- Consumes: `ToolIconPicker` from Task 2 and `DEFAULT_TOOL_ICON_KEY` from Task 1.
- Preserves: existing URL detail suggestion, name, description, tags, aliases, source, pin, mock save, and close behavior.

- [ ] **Step 1: Write failing integration contract test**

```ts
test("Add Tool owns stable icon and accent values", () => {
  assert.match(source, /iconKey:\s*DEFAULT_TOOL_ICON_KEY/);
  assert.match(source, /<ToolIconPicker/);
  assert.match(source, /iconKey=\{form\.iconKey\}/);
  assert.match(source, /accent=\{form\.accent\}/);
  assert.match(source, /onIconChange=/);
  assert.match(source, /onAccentChange=/);
  assert.doesNotMatch(source, /monoFromName/);
});
```

- [ ] **Step 2: Run test and confirm failure**

Run: `node --test src/components/dashboard/AddToolModal.icon-picker.test.ts`

Expected: FAIL because Add Tool does not yet import or render the picker.

- [ ] **Step 3: Make the minimal integration change**

Add `iconKey: DEFAULT_TOOL_ICON_KEY` to `emptyForm()`. Remove `monoFromName`, the derived `mono`/`rgb`, and the old preview/color block. Render `ToolIconPicker` with controlled values and callbacks that update only `iconKey` or `accent` in the existing form state.

- [ ] **Step 4: Run all focused tests**

Run: `node --test src/lib/dashboard/tool-icons.test.ts src/components/dashboard/ToolIconPicker.test.ts src/components/dashboard/AddToolModal.icon-picker.test.ts`

Expected: all focused tests PASS.

### Task 4: Validate production compatibility and behavior

**Files:**
- Verify only; fix only issues directly caused by Tasks 1-3.

**Interfaces:**
- Consumes the completed feature.
- Produces verification evidence, not new behavior.

- [ ] **Step 1: Run TypeScript checking**

Run: `npx tsc --noEmit`

Expected: exit code 0.

- [ ] **Step 2: Run ESLint on changed source and tests**

Run: `npx eslint src/lib/dashboard/tool-icons.ts src/lib/dashboard/tool-icons.test.ts src/components/dashboard/ToolIconPicker.tsx src/components/dashboard/ToolIconPicker.test.ts src/components/dashboard/AddToolModal.tsx src/components/dashboard/AddToolModal.icon-picker.test.ts`

Expected: exit code 0.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: exit code 0. If an existing external-resource/network restriction blocks the build, report that separately and do not misclassify it as feature success.

- [ ] **Step 4: Perform manual browser acceptance**

Start the existing app, open Add Tool, and verify: all seven categories render; the library totals 100 icons; search filters across categories; selecting an icon changes the preview; selecting each color recolors it; no-result search is recoverable; and the category list becomes horizontal at a narrow viewport.

- [ ] **Step 5: Review the focused diff**

Run: `git diff --check` and `git diff -- src/lib/dashboard/tool-icons.ts src/lib/dashboard/tool-icons.test.ts src/components/dashboard/ToolIconPicker.tsx src/components/dashboard/ToolIconPicker.module.css src/components/dashboard/ToolIconPicker.test.ts src/components/dashboard/AddToolModal.tsx src/components/dashboard/AddToolModal.icon-picker.test.ts`

Expected: no whitespace errors and no unrelated changes.
