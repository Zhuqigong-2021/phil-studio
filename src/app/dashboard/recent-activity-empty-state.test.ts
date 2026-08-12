import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("src/app/dashboard/page.tsx", "utf8");

test("Recent Activity empty message is hidden while a focus session is active", () => {
  assert.match(page, /entries\.length === 0 && !session/);
});
