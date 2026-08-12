import assert from "node:assert/strict";
import test from "node:test";
import * as customTools from "./custom-tools.ts";
import {
  addCategoryToList,
  appendCustomTool,
  createCustomTool,
  matchesToolQuery,
  mergeCategories,
  parseStoredCategories,
  parseStoredToolIds,
  parseStoredTools,
} from "./custom-tools.ts";

test("Quick Access selects pinned tools by database update time descending", () => {
  const selectPinnedTools = (customTools as unknown as {
    selectPinnedTools?: <T extends { id: string }>(tools: readonly T[], pinnedIds: readonly string[]) => T[];
  }).selectPinnedTools;
  assert.equal(typeof selectPinnedTools, "function", "selectPinnedTools is not implemented");

  const tools = [
    { id: "recent", updatedAt: "2026-08-12T00:00:00.000Z" },
    { id: "pinned-2", updatedAt: "2026-08-11T00:00:00.000Z" },
    { id: "default", updatedAt: "2026-08-09T00:00:00.000Z" },
    { id: "pinned-1", updatedAt: "2026-08-10T00:00:00.000Z" },
  ];
  assert.deepEqual(selectPinnedTools!(tools, ["pinned-1", "missing", "pinned-2", "pinned-1"]), [
    { id: "pinned-2", updatedAt: "2026-08-11T00:00:00.000Z" },
    { id: "pinned-1", updatedAt: "2026-08-10T00:00:00.000Z" },
  ]);
});

test("merges default and custom categories without case-insensitive duplicates", () => {
  assert.deepEqual(mergeCategories(["AI", "Work"], [" ai ", "ServiceNow"]), [
    "AI",
    "Work",
    "ServiceNow",
  ]);
});

test("rejects malformed stored category, tool, and pinned-id payloads", () => {
  assert.deepEqual(parseStoredCategories('{"bad":true}'), []);
  assert.deepEqual(parseStoredTools('[{"name":4}]'), []);
  assert.deepEqual(parseStoredToolIds('[4,null]'), []);
});

test("keeps every valid cached tool when named and custom colors share the same payload", () => {
  const stored = [
    {
      id: "named-tool", name: "Named", url: "https://example.com/named", description: "",
      mono: "NA", accent: "teal", tags: [], aliases: [], favorite: false,
      sourceType: "external", iconKey: "globe", iconType: "matching",
    },
    {
      id: "custom-color-tool", name: "Custom Color", url: "https://example.com/custom", description: "",
      mono: "CC", accent: "#22d3ee", tags: [], aliases: [], favorite: true,
      sourceType: "external", iconKey: "palette", iconType: "matching",
    },
  ];

  const tools = parseStoredTools(JSON.stringify(stored));

  assert.deepEqual(tools.map((tool) => [tool.id, tool.accent]), [
    ["named-tool", "teal"],
    ["custom-color-tool", "#22D3EE"],
  ]);
});

test("creates a normalized local tool that is searchable by name, alias, and category", () => {
  const tool = createCustomTool(
    {
      name: " Study Mate ",
      url: "example.com",
      description: " Exam helper ",
      iconKey: "database",
      accent: "violet",
      tags: ["ServiceNow"],
      aliases: ["考试助手"],
      sourceType: "internal",
    },
    "tool-1",
  );

  assert.equal(tool.name, "Study Mate");
  assert.equal(tool.url, "https://example.com/");
  assert.equal(tool.description, "Exam helper");
  assert.equal(tool.mono, "SM");
  assert.equal(matchesToolQuery(tool, "study"), true);
  assert.equal(matchesToolQuery(tool, "考试"), true);
  assert.equal(matchesToolQuery(tool, "servicenow"), true);
  assert.equal(matchesToolQuery(tool, "missing"), false);
});

test("validates category creation and appends tools immutably", () => {
  assert.deepEqual(addCategoryToList(["AI"], " ServiceNow "), {
    categories: ["AI", "ServiceNow"],
    category: "ServiceNow",
  });
  assert.throws(() => addCategoryToList(["AI"], "ai"), /already exists/i);
  assert.throws(() => addCategoryToList([], ""), /required/i);
  assert.throws(() => addCategoryToList([], "x".repeat(25)), /24 characters/i);

  const tool = createCustomTool(
    {
      name: "Notes",
      url: "https://example.com",
      description: "",
      iconKey: "notebook",
      accent: "blue",
      tags: [],
      aliases: [],
      sourceType: "external",
    },
    "tool-2",
  );
  const original: typeof tool[] = [];
  const next = appendCustomTool(original, tool);
  assert.deepEqual(original, []);
  assert.deepEqual(next, [tool]);
});

test("rejects invalid tools and duplicate aliases", () => {
  const base = {
    name: "Tool",
    url: "ftp://example.com",
    description: "",
    iconKey: "app-window",
    accent: "blue" as const,
    tags: [],
    aliases: [],
    sourceType: "internal" as const,
  };
  assert.throws(() => createCustomTool(base, "bad"), /HTTP or HTTPS/i);
  assert.throws(
    () => createCustomTool({ ...base, url: "https://example.com", aliases: ["Docs", "docs"] }, "bad"),
    /duplicate alias/i,
  );
});
