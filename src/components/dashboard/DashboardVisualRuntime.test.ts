import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("src/app/dashboard/page.tsx", "utf8");
const runtime = readFileSync("src/components/dashboard/DashboardVisualRuntime.tsx", "utf8");

test("the permanent splash runtime is isolated behind a stable memoized boundary", () => {
  assert.match(runtime, /^"use client";/);
  assert.match(runtime, /dynamic\(\s*\(\) => import\("@\/components\/dashboard\/WorkspaceSplashCursor"\)/);
  assert.match(runtime, /React\.memo/);
  assert.match(page, /<DashboardVisualRuntime\s*\/>/);
  assert.doesNotMatch(page, /const WorkspaceSplashCursor = dynamic/);
});

test("deferred visual fallbacks retain their existing geometry hooks", () => {
  assert.match(runtime, /className="energy-sand-volume"/);
  assert.match(runtime, /className="magic-rings-container"/);
  assert.match(runtime, /className="side-rays-container"/);
});
