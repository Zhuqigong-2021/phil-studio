import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dashboard = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");
const modal = readFileSync(
  new URL("../../components/dashboard/AddToolModal.tsx", import.meta.url),
  "utf8",
);
const shell = readFileSync(
  new URL("../../components/dashboard/SecondaryPageShell.tsx", import.meta.url),
  "utf8",
);

test("Dashboard and Manage render the same canonical Add Tool modal", () => {
  assert.match(dashboard, /import AddToolModal from/);
  assert.match(dashboard, /<AddToolModal/);
  assert.doesNotMatch(dashboard, /function AddToolModalDark/);
  assert.match(dashboard, /<DatabaseToastViewport\s*\/>/);
  assert.match(shell, /<AddToolModal/);
  assert.equal((modal.match(/function AddToolForm/g) ?? []).length, 1);
});

test("canonical Add Tool awaits dynamic categories and database persistence", () => {
  assert.match(modal, /<CategorySelector/);
  assert.match(modal, /categories=\{categories\}/);
  assert.match(modal, /\(await addCategory\(name\)\)\.category/);
  assert.match(modal, /runAddToolSubmission/);
  assert.match(modal, /save: async \(\) => \{[\s\S]*await addTool\(/);
  assert.match(modal, /disabled=\{saving\}/);
  assert.match(modal, /LoaderCircle/);
  assert.match(modal, /Saving…/);
  assert.doesNotMatch(modal, /setTimeout\(\(\) => \{\s*setSaving\(false\)/);
});

test("every visible close path is guarded while Add Tool is saving", () => {
  assert.equal((modal.match(/onClick=\{requestClose\}/g) ?? []).length, 3);
  assert.match(modal, /aria-label="Close"[\s\S]*?disabled=\{saving\}/);
  assert.match(modal, /onClick=\{requestClose\}\s*disabled=\{saving\}[\s\S]*?>\s*Cancel/);
  assert.match(modal, /submissionGuard\.requestClose\(onClose\)/);
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
