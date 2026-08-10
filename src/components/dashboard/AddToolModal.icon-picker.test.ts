import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sourceUrl = new URL("./AddToolModal.tsx", import.meta.url);

test("Add Tool owns stable icon and accent values", async () => {
  const source = await readFile(sourceUrl, "utf8");

  assert.match(source, /iconKey:\s*DEFAULT_TOOL_ICON_KEY/);
  assert.match(source, /<ToolIconPicker/);
  assert.match(source, /iconKey=\{form\.iconKey\}/);
  assert.match(source, /accent=\{form\.accent\}/);
  assert.match(source, /onIconChange=/);
  assert.match(source, /onAccentChange=/);
  assert.doesNotMatch(source, /monoFromName/);
});
