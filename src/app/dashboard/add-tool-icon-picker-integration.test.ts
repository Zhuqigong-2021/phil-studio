import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const dashboardUrl = new URL("./page.tsx", import.meta.url);
const sharedModalUrl = new URL(
  "../../components/dashboard/AddToolModal.tsx",
  import.meta.url,
);
const addToolSubmissionUrl = new URL(
  "../../lib/dashboard/add-tool-submission.ts",
  import.meta.url,
);

function assertPickerContract(source: string, stateSource: string) {
  assert.match(source, /import ToolIconPicker from/);
  assert.match(source, /createEmptyAddToolForm/);
  assert.match(stateSource, /iconKey:\s*"app-window"/);
  assert.match(stateSource, /accent:\s*"blue"/);
  assert.match(source, /<ToolIconPicker/);
  assert.match(source, /iconKey=\{form\.iconKey\}/);
  assert.match(source, /accent=\{form\.accent\}/);
  assert.match(source, /onIconChange=/);
  assert.match(source, /onAccentChange=/);
}

function assertIndigoControlContract(source: string) {
  assert.match(
    source,
    /ADD_TOOL_SECONDARY_BACKGROUND\s*=\s*"rgba\(99, 102, 241, 0\.14\)"/,
  );
  assert.match(
    source,
    /ADD_TOOL_SECONDARY_BORDER\s*=\s*"1px solid rgba\(129, 140, 248, 0\.34\)"/,
  );
  assert.match(source, /ADD_TOOL_SECONDARY_TEXT\s*=\s*"#e0e7ff"/);
  assert.ok(
    (source.match(/background:\s*ADD_TOOL_SECONDARY_BACKGROUND/g) ?? [])
      .length >= 4,
  );
  assert.ok(
    (source.match(/color:\s*ADD_TOOL_SECONDARY_TEXT/g) ?? []).length >= 4,
  );
  assert.match(source, /linear-gradient\([^)]*(?:#3B82F6|#7255db)/i);
}

test("the shared Add Tool modal uses the controlled icon picker", async () => {
  const source = await readFile(sharedModalUrl, "utf8");
  const stateSource = await readFile(addToolSubmissionUrl, "utf8");

  assert.match(source, /import "@\/app\/dashboard\/dashboard\.css"/);
  assertPickerContract(source, stateSource);
  assertIndigoControlContract(source);
});

test("the Dashboard uses the canonical shared Add Tool modal", async () => {
  const source = await readFile(dashboardUrl, "utf8");

  assert.match(source, /import AddToolModal from/);
  assert.match(source, /<AddToolModal/);
  assert.doesNotMatch(source, /function AddToolModalDark/);
  assert.doesNotMatch(source, /<ToolIconPicker/);
});
