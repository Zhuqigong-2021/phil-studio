import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentUrl = new URL("./ToolIconPicker.tsx", import.meta.url);
const stylesUrl = new URL("./ToolIconPicker.module.css", import.meta.url);

test("renders the approved searchable category picker contract", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /ICON_CATEGORIES/);
  assert.match(source, /aria-label="Search icons"/);
  assert.match(source, /aria-pressed=/);
  assert.match(source, /No icons found/);
  assert.match(source, /onIconChange/);
  assert.match(source, /onAccentChange/);
});

test("adapts the category sidebar for narrow screens", async () => {
  const styles = await readFile(stylesUrl, "utf8");

  assert.match(styles, /grid-template-columns:\s*96px minmax\(0,\s*1fr\)/);
  assert.match(styles, /@media\s*\(max-width:\s*560px\)/);
  assert.match(styles, /overflow-x:\s*auto/);
  assert.match(styles, /min-(?:width|height):\s*44px/);
});
