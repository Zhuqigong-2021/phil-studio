import assert from "node:assert/strict";
import test from "node:test";

import {
  getToolIcon,
  searchToolIcons,
  TOOL_ICONS,
} from "./tool-icons.ts";

test("contains exactly 100 unique icons in the approved category counts", () => {
  assert.equal(TOOL_ICONS.length, 100);
  assert.equal(new Set(TOOL_ICONS.map(({ key }) => key)).size, 100);

  const counts = Object.fromEntries(
    ["Popular", "Work", "Design", "Code", "Media", "Files", "Objects"].map(
      (category) => [
        category,
        TOOL_ICONS.filter((icon) => icon.category === category).length,
      ],
    ),
  );

  assert.deepEqual(counts, {
    Popular: 16,
    Work: 14,
    Design: 14,
    Code: 14,
    Media: 14,
    Files: 14,
    Objects: 14,
  });
});

test("searches labels, keys, categories, and bilingual keywords", () => {
  assert.ok(
    searchToolIcons("briefcase", "all").some(
      ({ key }) => key === "briefcase-business",
    ),
  );
  assert.ok(
    searchToolIcons("工作", "all").some(
      ({ key }) => key === "briefcase-business",
    ),
  );
  assert.ok(
    searchToolIcons("", "Design").every(
      ({ category }) => category === "Design",
    ),
  );
});

test("falls back safely for an unknown key", () => {
  assert.equal(getToolIcon("not-real").key, "app-window");
  assert.equal(getToolIcon(undefined).key, "app-window");
});
