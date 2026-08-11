import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");
const modalStart = source.indexOf("function AddToolModalDark");
const modalEnd = source.indexOf("function HeroSection", modalStart);
const modal = source.slice(modalStart, modalEnd);

test("active Add Tool uses dynamic categories and real local persistence", () => {
  assert.match(modal, /<CategorySelector/);
  assert.match(modal, /categories=\{categories\}/);
  assert.match(modal, /addCategory\(name\)\.category/);
  assert.match(modal, /addTool\(/);
  assert.doesNotMatch(modal, /setTimeout\(\(\) => \{\s*setSaving\(false\)/);
});

test("save forwards aliases, categories, icon, color, source, and pin", () => {
  for (const field of [
    "name: form.name",
    "url: form.url",
    "description: form.description",
    "iconKey: form.iconKey",
    "accent: form.accent",
    "tags: [...form.tags]",
    "aliases: form.aliases",
    "sourceType: form.source",
  ]) {
    assert.ok(modal.includes(field), `missing saved field: ${field}`);
  }
  assert.match(modal, /addTool\([\s\S]*form\.pin/);
  assert.match(modal, /role="alert"/);
});
