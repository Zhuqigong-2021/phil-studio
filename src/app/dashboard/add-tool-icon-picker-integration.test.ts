import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const dashboardUrl = new URL("./page.tsx", import.meta.url);

test("the active Dashboard Add Tool modal uses the shared icon picker", async () => {
  const source = await readFile(dashboardUrl, "utf8");
  const modalStart = source.indexOf("function AddToolModalDark");
  const modalEnd = source.indexOf("function HeroSection", modalStart);
  const modalSource = source.slice(modalStart, modalEnd);

  assert.ok(modalStart >= 0);
  assert.match(source, /import ToolIconPicker from/);
  assert.match(source, /DEFAULT_TOOL_ICON_KEY/);
  assert.match(modalSource, /<ToolIconPicker/);
  assert.match(modalSource, /iconKey=\{form\.iconKey\}/);
  assert.match(modalSource, /onIconChange=/);
  assert.match(modalSource, /onAccentChange=/);
  assert.doesNotMatch(modalSource, /monoFromName/);
});
