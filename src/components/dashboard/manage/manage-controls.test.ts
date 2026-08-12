import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("pending row controls hide open popovers and disable descendant choices", async () => {
  const [row, color, categories] = await Promise.all([
    readFile(new URL("./EditableToolRow.tsx", import.meta.url), "utf8"),
    readFile(new URL("./ToolColorPicker.tsx", import.meta.url), "utf8"),
    readFile(new URL("./CategoryCollector.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(row, /isManagePopoverOpen\(open, disabled\)/);
  assert.match(color, /isManagePopoverOpen\(open, disabled\)/);
  assert.match(categories, /isManagePopoverOpen\(open, disabled\)/);
  assert.match(row, /key=\{updating \? "pending" : "ready"\}/);
  assert.ok((color.match(/disabled=\{disabled\}/g) ?? []).length >= 3);
  assert.ok((categories.match(/disabled=\{disabled\}/g) ?? []).length >= 3);
});

test("delete pending focus stays contained and failure restores Cancel focus", async () => {
  const dialog = await readFile(new URL("./DeleteToolDialog.tsx", import.meta.url), "utf8");

  assert.match(dialog, /tabIndex=\{-1\}/);
  assert.match(dialog, /dialogRef\.current\?\.focus\(\)/);
  assert.match(dialog, /cancelRef\.current\?\.focus\(\)/);
  assert.match(dialog, /if \(!focusable\.length\)/);
});

test("alias display is controlled by reducer state rather than redundant row-local state", async () => {
  const row = await readFile(new URL("./EditableToolRow.tsx", import.meta.url), "utf8");

  assert.match(row, /aliasInput: string/);
  assert.doesNotMatch(row, /useState\(draft\.aliases\.join/);
});

test("category choices expose checkbox-group semantics instead of listbox semantics", async () => {
  const categories = await readFile(new URL("./CategoryCollector.tsx", import.meta.url), "utf8");

  assert.match(categories, /role="group"/);
  assert.match(categories, /type="checkbox"/);
  assert.doesNotMatch(categories, /role="listbox"|aria-multiselectable/);
});

test("every database row exposes Delete and routes errors through Toast instead of table rows", async () => {
  const row = await readFile(new URL("./EditableToolRow.tsx", import.meta.url), "utf8");
  const page = await readFile(new URL("../pages/ManageContent.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(row, /isBuiltInToolId|Built-in tools cannot be deleted|tool-row-error-row/);
  assert.match(row, /aria-label=\{`Delete \$\{tool\.name\}`\}/);
  assert.match(row, /disabled=\{updating\}/);
  assert.doesNotMatch(page, /tool-library-sync-error/);
});

test("management popovers are mutually exclusive and scroll without visible scrollbars", async () => {
  const [row, color, categories, css] = await Promise.all([
    readFile(new URL("./EditableToolRow.tsx", import.meta.url), "utf8"),
    readFile(new URL("./ToolColorPicker.tsx", import.meta.url), "utf8"),
    readFile(new URL("./CategoryCollector.tsx", import.meta.url), "utf8"),
    readFile(new URL("../../../styles/secondary.css", import.meta.url), "utf8"),
  ]);

  assert.match(row, /useExclusiveManagePopover/);
  assert.match(color, /useExclusiveManagePopover/);
  assert.match(categories, /useExclusiveManagePopover/);
  assert.match(css, /\.inline-icon-grid[\s\S]*scrollbar-width:\s*none/);
  assert.match(css, /\.category-options[\s\S]*scrollbar-width:\s*none/);
});

test("desktop library fits ten rows with naturally spaced pagination and offers five rows", async () => {
  const [pagination, state, css] = await Promise.all([
    readFile(new URL("./ToolLibraryPagination.tsx", import.meta.url), "utf8"),
    readFile(new URL("../../../hooks/manage-page-state.ts", import.meta.url), "utf8"),
    readFile(new URL("../../../styles/secondary.css", import.meta.url), "utf8"),
  ]);

  assert.match(pagination, /<option value=\{5\}>5<\/option>/);
  assert.match(state, /ManagePageSize = 5 \| 10 \| 20 \| 50/);
  assert.match(css, /\.tool-library-row td\s*\{[^}]*height:\s*54px/);
  assert.match(css, /\.tool-library-pagination\s*\{[^}]*margin-top:\s*10px/);
  assert.doesNotMatch(css, /\.tool-library-pagination\s*\{[^}]*margin-top:\s*auto/);
  assert.match(pagination, /data-page-size=\{pageSize\}/);
  assert.match(await readFile(new URL("../pages/ManageContent.tsx", import.meta.url), "utf8"), /data-page-size=\{state\.pageSize\}/);
  assert.match(css, /\.tool-library-page-enter\s*\{[^}]*padding-top:\s*clamp\(/);
  assert.match(css, /\.tool-library\[data-page-size="10"\]\s*\{[^}]*padding-top:\s*18px/);
  assert.match(css, /@media \(min-width:\s*900px\)[\s\S]*\.tool-library-pagination\[data-page-size="10"\]\s*\{[^}]*margin-top:\s*auto/);
});

test("Manage delete confirmation shares the established overlay exit motion", async () => {
  const [page, dialog] = await Promise.all([
    readFile(new URL("../pages/ManageContent.tsx", import.meta.url), "utf8"),
    readFile(new URL("./DeleteToolDialog.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /AnimatePresence/);
  assert.match(dialog, /getOverlayMotion/);
  assert.match(dialog, /<motion\.div/);
  assert.match(dialog, /\.\.\.overlayMotion\.surface/);
});

test("Manage shared Add Tool modal propagates exit motion before its workspace owner unmounts", async () => {
  const [shell, modal] = await Promise.all([
    readFile(new URL("../SecondaryPageShell.tsx", import.meta.url), "utf8"),
    readFile(new URL("../AddToolModal.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(shell, /<AnimatePresence>/);
  assert.match(shell, /state\.addToolOpen && <SecondaryAddToolModal/);
  assert.match(modal, /<AnimatePresence propagate>/);
});

test("Category table header provides an accessible multi-select filter separate from row editors", async () => {
  const [page, filter, css] = await Promise.all([
    readFile(new URL("../pages/ManageContent.tsx", import.meta.url), "utf8"),
    readFile(new URL("./CategoryTableFilter.tsx", import.meta.url), "utf8"),
    readFile(new URL("../../../styles/secondary.css", import.meta.url), "utf8"),
  ]);
  assert.match(page, /<CategoryTableFilter/);
  assert.match(filter, /All categories/);
  assert.match(filter, /type="checkbox"/);
  assert.match(filter, /aria-label="Filter tools by category"/);
  assert.match(filter, /Escape/);
  assert.match(filter, /createPortal/);
  assert.match(filter, /position:\s*"fixed"/);
  assert.match(filter, /getBoundingClientRect/);
  assert.match(css, /\.category-table-filter-options[\s\S]*scrollbar-width:\s*none/);
});
