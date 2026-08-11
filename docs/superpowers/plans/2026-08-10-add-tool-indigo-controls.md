# Add Tool Indigo Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide Icon Picker scrollbars and give Add Tool ordinary controls one indigo visual family before merging the 500-icon feature to `main`.

**Architecture:** Keep existing component structure and data flow. Apply picker-specific CSS tokens in `ToolIconPicker.module.css`, then surgically align inline control styles in both Add Tool consumers without refactoring the large Dashboard page.

**Tech Stack:** React, TypeScript, CSS Modules, Node test runner, ESLint, Next.js production build, Playwright browser QA.

## Global Constraints

- Preserve exactly 500 icons, twenty categories, all saved keys, and all accent values.
- Hide scrollbar chrome without removing `overflow-x` or `overflow-y` scrolling.
- Keep real color swatches and the selected icon's chosen accent.
- Keep Save visually primary; ordinary buttons use indigo secondary treatment.
- Do not alter controls outside Add Tool.

---

### Task 1: Restyle and hide scrollbars in Tool Icon Picker

**Files:**
- Modify: `src/components/dashboard/ToolIconPicker.module.css`
- Modify: `src/components/dashboard/ToolIconPicker.test.ts`

**Interfaces:**
- Consumes: existing Picker markup and CSS class names.
- Produces: unchanged Picker behavior with indigo resting controls and invisible scrollbars.

- [ ] **Step 1: Write failing CSS contract tests**

Assert `.categories` and `.results` retain `overflow-y: auto`; mobile `.categories` retains `overflow-x: auto`. Assert scroll regions use `scrollbar-width: none` and shared `::-webkit-scrollbar { display: none; }`. Assert icon/category resting states contain indigo RGB values and no longer use the old `#a9b2c3` slate foreground.

- [ ] **Step 2: Run the test and verify red**

Run: `node --experimental-strip-types --test src/components/dashboard/ToolIconPicker.test.ts`

Expected: FAIL because scrollbars are visible and resting buttons remain slate.

- [ ] **Step 3: Implement the minimal CSS change**

Use subtle indigo tokens such as `rgba(99, 102, 241, 0.10)` for resting surfaces, `rgba(129, 140, 248, 0.30)` borders, and `#c7d2fe` foreground. Preserve brighter selected/hover states and current accent-colored selected icon border. Add Firefox and WebKit scrollbar hiding to both scroll regions and the mobile horizontal category list.

- [ ] **Step 4: Run focused tests and ESLint**

Run the Picker test plus the 500-icon, loader, renderer, and integration tests. Run ESLint for all changed picker files. Expected: PASS.

---

### Task 2: Align both Add Tool consumers and verify visually

**Files:**
- Modify: `src/components/dashboard/AddToolModal.tsx`
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/app/dashboard/add-tool-icon-picker-integration.test.ts`

**Interfaces:**
- Consumes: existing Add Tool inline styles and controlled Picker props.
- Produces: indigo secondary actions, choices, Cancel, and preserved primary Save in both consumers.

- [ ] **Step 1: Write failing source-level theme assertions**

Assert both consumer sources contain the approved indigo secondary surface/border tokens for `Get details`, `Add`, inactive tags/source choices, and `Cancel`; assert Save remains a gradient/primary treatment and Picker props remain unchanged.

- [ ] **Step 2: Run integration test and verify red**

Run: `node --experimental-strip-types --test src/app/dashboard/add-tool-icon-picker-integration.test.ts`

Expected: FAIL because the shared modal still uses neutral white/slate secondary buttons and choices.

- [ ] **Step 3: Apply surgical inline-style changes**

Replace only ordinary button/choice resting surfaces, borders, and foregrounds with the approved indigo tokens. Preserve disabled opacity, action handlers, layout, Save hierarchy, and swatch colors. Do not modify unrelated Dashboard code.

- [ ] **Step 4: Verify all automated checks**

Run all repository `*.test.ts`, targeted ESLint, and `npm run build`. Expected: all tests and build pass; unrelated full-lint findings are reported without modification.

- [ ] **Step 5: Browser comparison**

Use a temporary unprotected QA route to mount the real Picker, verify desktop and 500px behavior, take a screenshot, check scrolling through all categories, select an icon and color, and confirm zero console errors. Delete the route and rebuild.

- [ ] **Step 6: Commit and merge locally**

Commit only the approved theme/test files. Merge `codex/add-tool-500-icons` into `main`, rerun the 500-icon focused suite and production build on the merged result, then remove the owned worktree and feature branch.
