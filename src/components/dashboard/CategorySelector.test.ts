import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const selectorSource = readFileSync(new URL("./CategorySelector.tsx", import.meta.url), "utf8");
const selectorCss = readFileSync(new URL("./CategorySelector.module.css", import.meta.url), "utf8");
const sharedModal = readFileSync(new URL("./AddToolModal.tsx", import.meta.url), "utf8");

test("offers an accessible dynamic category creation flow", () => {
  assert.match(selectorSource, /Categories/);
  assert.match(selectorSource, /\+ New category/);
  assert.match(selectorSource, /New category name/);
  assert.match(selectorSource, /maxLength=\{24\}/);
  assert.match(selectorSource, /role="alert"/);
  assert.match(selectorSource, /aria-pressed=\{selected\.has\(category\)\}/);
});

test("keeps new category controls in the indigo visual system", () => {
  assert.match(selectorCss, /99, 102, 241/);
  assert.match(selectorCss, /129, 140, 248/);
  assert.doesNotMatch(selectorCss, /rgba\(255,\s*255,\s*255/);
});

test("shared Add Tool uses the reusable category selector", () => {
  assert.match(sharedModal, /<CategorySelector/);
  assert.doesNotMatch(sharedModal, /\{TAGS\.map/);
});

test("shared Add Tool persists the complete tool instead of using a fake save timer", () => {
  assert.match(sharedModal, /addTool\(/);
  assert.match(sharedModal, /aliases: form\.aliases/);
  assert.match(sharedModal, /tags: \[\.\.\.form\.tags\]/);
  assert.doesNotMatch(sharedModal, /setTimeout\(\(\) => \{\s*setSaving\(false\)/);
});
