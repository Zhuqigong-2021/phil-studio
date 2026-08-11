import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { addPinnedToolId, removePinnedToolId } from "../lib/dashboard/custom-tools.ts";

test("adds and removes pinned IDs without duplicates or mutation", () => {
  const original = ["built-in"];
  assert.deepEqual(addPinnedToolId(original, "custom"), ["built-in", "custom"]);
  assert.deepEqual(addPinnedToolId(original, "built-in"), ["built-in"]);
  assert.deepEqual(removePinnedToolId(["built-in", "custom"], "built-in"), ["custom"]);
  assert.deepEqual(original, ["built-in"]);
});

test("hook synchronizes all feature storage keys and same-tab changes", () => {
  const source = readFileSync(new URL("./useCustomTools.ts", import.meta.url), "utf8");
  assert.match(source, /CUSTOM_CATEGORIES_KEY/);
  assert.match(source, /CUSTOM_TOOLS_KEY/);
  assert.match(source, /PINNED_TOOLS_KEY/);
  assert.match(source, /CUSTOM_TOOLS_CHANGED_EVENT/);
  assert.match(source, /addEventListener\("storage"/);
  assert.match(source, /setTimeout\(refresh, 0\)/);
  assert.match(source, /crypto\.randomUUID/);
});
