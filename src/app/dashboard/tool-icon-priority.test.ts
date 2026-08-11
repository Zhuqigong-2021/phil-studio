import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageUrl = new URL("./page.tsx", import.meta.url);

test("built-in tools prefer a valid icon key and retain their legacy icon as fallback", async () => {
  const source = await readFile(pageUrl, "utf8");
  const toolViews = source.slice(source.indexOf("function useToolViews"), source.indexOf("function GlobalSearchBar"));
  const builtInBranch = source.slice(
    source.indexOf("if (builtIn)"),
    source.indexOf("return {\n        id: tool.id", source.indexOf("if (builtIn)")),
  );

  assert.match(toolViews, /const rgb = toolColorRgb\(tool\.accent\);/);
  assert.match(builtInBranch, /hasToolIcon\(tool\.iconKey\)/);
  assert.match(builtInBranch, /<DynamicToolIcon/);
  assert.match(builtInBranch, /color=\{`rgb\(\$\{rgb\}\)`\}/);
  assert.match(builtInBranch, /:\s*builtIn\.icon/);
});

test("custom tool catalog icons use their selected accent color", async () => {
  const source = await readFile(pageUrl, "utf8");
  const toolViews = source.slice(source.indexOf("function useToolViews"), source.indexOf("function GlobalSearchBar"));
  const customBranch = source.slice(
    source.indexOf("return {\n        id: tool.id", source.indexOf("if (builtIn)")),
    source.indexOf("};", source.indexOf("return {\n        id: tool.id", source.indexOf("if (builtIn)"))) + 2,
  );

  assert.match(toolViews, /const rgb = toolColorRgb\(tool\.accent\);/);
  assert.match(customBranch, /color=\{`rgb\(\$\{rgb\}\)`\}/);
});

test("tool tiles keep their outline but use a more transparent inner tint", async () => {
  const source = await readFile(pageUrl, "utf8");
  const tileSource = source.slice(
    source.indexOf("function ToolTile"),
    source.indexOf("// ───", source.indexOf("function ToolTile") + 1),
  );

  assert.match(tileSource, /rgba\(255,255,255,0\.05\)/);
  assert.match(tileSource, /background: `[^`]*\$\{bgColor\}`/);
  assert.match(source, /bg: `rgba\(\$\{rgb\},0\.07\)`/);
  assert.match(tileSource, /border: `1px solid \$\{borderColor\}`/);
});

test("tool labels stay one line, match the icon width, and expose the full label on hover", async () => {
  const source = await readFile(pageUrl, "utf8");
  const tileSource = source.slice(
    source.indexOf("function ToolTile"),
    source.indexOf("// ───", source.indexOf("function ToolTile") + 1),
  );

  assert.match(tileSource, /<p[^>]*title=\{label\}/);
  assert.match(tileSource, /w-\[70px\]/);
  assert.match(tileSource, /whitespace-nowrap/);
  assert.match(tileSource, /truncate/);
});

test("quick access labels match their responsive icon width and use the same ellipsis tooltip behavior", async () => {
  const source = await readFile(pageUrl, "utf8");
  const quickTileSource = source.slice(
    source.indexOf("function QuickTile"),
    source.indexOf("// ───", source.indexOf("function QuickTile") + 1),
  );

  assert.match(quickTileSource, /<p[^>]*title=\{label\}/);
  assert.match(quickTileSource, /w-\[clamp\(44px,5\.5vh,64px\)\]/);
  assert.match(quickTileSource, /whitespace-nowrap/);
  assert.match(quickTileSource, /truncate/);
});
