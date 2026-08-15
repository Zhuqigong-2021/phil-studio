import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("src/app/dashboard/page.tsx", "utf8");
const runtime = readFileSync("src/components/dashboard/DashboardVisualRuntime.tsx", "utf8");
const splash = readFileSync("src/components/SplashCursor.jsx", "utf8");
const sideRays = readFileSync("src/components/dashboard/SideRays.jsx", "utf8");
const runtimeActivity = readFileSync("src/hooks/useVisualRuntimeActivity.ts", "utf8");

test("browser-heavy visuals are split at module scope with geometry-preserving fallbacks", () => {
  assert.match(runtime, /import dynamic from "next\/dynamic"/);
  assert.doesNotMatch(page, /import WorkspaceSplashCursor from/);
  assert.doesNotMatch(page, /import EnergySandVolume from/);
  assert.doesNotMatch(page, /import MagicRings from/);
  assert.doesNotMatch(page, /import SideRays from/);
  assert.match(runtime, /dynamic\(\s*\(\) => import\("@\/components\/dashboard\/WorkspaceSplashCursor"\)/);
  assert.match(runtime, /dynamic\(\s*\(\) => import\("@\/components\/dashboard\/EnergySandVolume"\)/);
  assert.match(runtime, /dynamic\(\s*\(\) => import\("@\/components\/dashboard\/MagicRings"\)/);
  assert.match(runtime, /dynamic\(\s*\(\) => import\("@\/components\/dashboard\/SideRays"\)/);
  assert.match(runtime, /className="energy-sand-volume"/);
  assert.match(runtime, /className="magic-rings-container"/);
  assert.match(runtime, /className="side-rays-container"/);
});

test("permanent WebGL loops stop while the document is hidden", () => {
  assert.match(splash, /visibilitychange/);
  assert.match(splash, /document\.hidden/);
  assert.match(sideRays, /useVisualRuntimeActivity/);
  assert.match(runtimeActivity, /visibilitychange/);
  assert.match(runtimeActivity, /document\.hidden/);
});
