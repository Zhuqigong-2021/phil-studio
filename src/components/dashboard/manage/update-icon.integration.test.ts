import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const row = readFileSync("src/components/dashboard/manage/EditableToolRow.tsx", "utf8");

test("update action uses a green circular refresh icon instead of a check", () => {
  assert.match(row, /RefreshCcw/);
  assert.match(row, /data-tool-update-icon/);
  assert.doesNotMatch(row, /:\s*<Check size=\{16\}/);
  assert.match(row, /updating\s*\?\s*\([\s\S]*?<LoaderCircle/);
});
