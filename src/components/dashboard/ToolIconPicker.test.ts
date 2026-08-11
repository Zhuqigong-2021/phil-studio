import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentUrl = new URL("./ToolIconPicker.tsx", import.meta.url);
const stylesUrl = new URL("./ToolIconPicker.module.css", import.meta.url);

test("renders the approved searchable category picker contract", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /DynamicToolIcon/);
  assert.match(source, /ICON_CATEGORIES/);
  assert.match(source, /aria-label="Search icons"/);
  assert.match(source, /Search 500 icons\.\.\./);
  assert.match(source, /query\.trim\(\) \? "all" : activeCategory/);
  assert.match(source, /aria-pressed=/);
  assert.match(source, /No icons found/);
  assert.match(source, /onIconChange/);
  assert.match(source, /onAccentChange/);
  assert.doesNotMatch(source, /definition\.Icon|selected\.Icon/);
});

test("adapts the category sidebar for narrow screens", async () => {
  const styles = await readFile(stylesUrl, "utf8");

  assert.match(styles, /grid-template-columns:\s*96px minmax\(0,\s*1fr\)/);
  assert.match(styles, /\.categories[\s\S]*?max-height:[\s\S]*?overflow-y:\s*auto/);
  assert.match(styles, /\.results[\s\S]*?max-height:[\s\S]*?overflow-y:\s*auto/);
  assert.match(styles, /@media\s*\(max-width:\s*560px\)/);
  assert.match(styles, /overflow-x:\s*auto/);
  assert.match(styles, /overflow-y:\s*hidden/);
  assert.match(styles, /min-(?:width|height):\s*44px/);
  assert.match(styles, /scrollbar-width:\s*none/);
  assert.match(styles, /::-webkit-scrollbar[\s\S]*?display:\s*none/);
});

test("uses indigo surfaces for ordinary picker controls", async () => {
  const styles = await readFile(stylesUrl, "utf8");

  assert.match(styles, /rgba\(99,\s*102,\s*241,\s*0\.1\)/);
  assert.match(styles, /rgba\(129,\s*140,\s*248,\s*0\.3\)/);
  assert.match(styles, /#c7d2fe/i);
  assert.doesNotMatch(styles, /#a9b2c3/i);
});
