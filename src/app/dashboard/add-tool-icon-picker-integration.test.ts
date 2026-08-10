import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const dashboardUrl = new URL("./page.tsx", import.meta.url);
const sharedModalUrl = new URL(
  "../../components/dashboard/AddToolModal.tsx",
  import.meta.url,
);

function assertPickerContract(source: string) {
  assert.match(source, /import ToolIconPicker from/);
  assert.match(source, /DEFAULT_TOOL_ICON_KEY/);
  assert.match(source, /iconKey:\s*DEFAULT_TOOL_ICON_KEY/);
  assert.match(source, /accent:\s*"blue"/);
  assert.match(source, /<ToolIconPicker/);
  assert.match(source, /iconKey=\{form\.iconKey\}/);
  assert.match(source, /accent=\{form\.accent\}/);
  assert.match(source, /onIconChange=/);
  assert.match(source, /onAccentChange=/);
}

test("the shared Add Tool modal uses the controlled icon picker", async () => {
  const source = await readFile(sharedModalUrl, "utf8");

  assertPickerContract(source);
});

test("the active Dashboard Add Tool modal uses the shared icon picker", async () => {
  const source = await readFile(dashboardUrl, "utf8");
  const modalStart = source.indexOf("function AddToolModalDark");
  const modalEnd = source.indexOf("function HeroSection", modalStart);
  const modalSource = source.slice(modalStart, modalEnd);

  assert.ok(modalStart >= 0);
  assertPickerContract(source);
  assert.doesNotMatch(modalSource, /monoFromName/);
});
