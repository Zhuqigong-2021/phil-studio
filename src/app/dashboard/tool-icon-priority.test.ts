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
  const customBranch = source.match(
    /if \(builtIn\)[\s\S]*?return \{\s*id: tool\.id,[\s\S]*?\n\s*\};/,
  )?.[0] ?? "";

  assert.match(toolViews, /const rgb = toolColorRgb\(tool\.accent\);/);
  assert.match(customBranch, /color=\{`rgb\(\$\{rgb\}\)`\}/);
});

test("tool tiles use the current layered frosted-glass treatment without restoring an outline", async () => {
  const source = await readFile(pageUrl, "utf8");
  const tileSource = source.slice(
    source.indexOf("function ToolTile"),
    source.indexOf("// ───", source.indexOf("function ToolTile") + 1),
  );

  assert.match(tileSource, /all-tools-glass-stack/);
  assert.match(tileSource, /all-tools-glass-backplate/);
  assert.match(tileSource, /all-tools-glass-face/);
  assert.match(tileSource, /background: `[^`]*\$\{bgColor\}`/);
  assert.match(source, /bg: `rgba\(\$\{rgb\},0\.07\)`/);
  assert.match(tileSource, /layeredGlass \? "all-tools-layered-glass" : ""/);
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

test("Quick Access keeps four visible slots and horizontally scrolls additional pins", async () => {
  const source = await readFile(pageUrl, "utf8");
  const quickTileSource = source.slice(
    source.indexOf("function QuickTile"),
    source.indexOf("// 鈹€鈹€鈹€", source.indexOf("function QuickTile") + 1),
  );

  assert.match(quickTileSource, /min-\[1180px\]:w-\[calc\(\(100%-48px\)\/4\)\]/);

  const panelSource = source.slice(source.indexOf("const quickAccessPanel"), source.indexOf("return (", source.indexOf("const quickAccessPanel")));
  assert.match(panelSource, /min-\[1180px\]:gap-\[16px\]/);
  assert.match(panelSource, /overflow-x-auto/);
});

test("Quick Access tiles use neutral frosted glass with position-aware tower lighting", async () => {
  const source = await readFile(pageUrl, "utf8");
  const css = await readFile(new URL("./dashboard.css", import.meta.url), "utf8");
  const quickTileSource = source.slice(
    source.indexOf("function QuickTile"),
    source.indexOf("// ─── Sidebar", source.indexOf("function QuickTile") + 1),
  );

  assert.match(quickTileSource, /quick-access-glass/);
  assert.match(quickTileSource, /data-quick-light=\{index % 4\}/);
  assert.match(css, /\.quick-access-glass/);
  assert.match(css, /backdrop-filter:\s*blur\(/);
  assert.match(css, /\.quick-access-glass\[data-quick-light="0"\]/);
  assert.match(css, /\.quick-access-glass\[data-quick-light="3"\]/);
  assert.doesNotMatch(quickTileSource, /background:\s*[^\n]*toolColorRgb/);
  assert.doesNotMatch(css, /\.quick-access-glass > svg,[\s\S]*?drop-shadow/);
  assert.doesNotMatch(css, /radial-gradient\(circle at var\(--quick-light-x\)/);
});
