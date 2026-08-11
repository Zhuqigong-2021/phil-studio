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
