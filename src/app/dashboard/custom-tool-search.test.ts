import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildCategoryStats, createCustomTool } from "../../lib/dashboard/custom-tools.ts";

const page = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");

test("category statistics include local tools and retain unused categories", () => {
  const tool = createCustomTool(
    {
      name: "Knowledge Tool",
      url: "https://example.com",
      description: "",
      iconKey: "book-open",
      accent: "violet",
      tags: ["AI", "Knowledge Base"],
      aliases: ["知识库"],
      sourceType: "internal",
    },
    "local-1",
  );
  assert.deepEqual(buildCategoryStats([tool], ["AI", "Knowledge Base", "Unused"]), [
    { tag: "AI", percent: 50 },
    { tag: "Knowledge Base", percent: 50 },
    { tag: "Unused", percent: 0 },
  ]);
});

test("dashboard search and cards derive from merged local tools", () => {
  assert.match(page, /function useToolViews/);
  assert.match(page, /matchesToolQuery\(t\.tool, trimmed\)/);
  assert.match(page, /const \{ tools, categories \} = useCustomTools\(\)/);
  assert.match(page, /buildCategoryStats\(tools, categories\)/);
  assert.match(page, /pinnedToolIds/);
});
