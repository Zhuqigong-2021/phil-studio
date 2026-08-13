import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("src/app/dashboard/page.tsx", "utf8");
const splash = readFileSync("src/components/SplashCursor.jsx", "utf8");
const sideRays = readFileSync("src/components/dashboard/SideRays.jsx", "utf8");

test("browser-heavy visuals are split at module scope with geometry-preserving fallbacks", () => {
  assert.match(page, /import dynamic from "next\/dynamic"/);
  assert.doesNotMatch(page, /import WorkspaceSplashCursor from/);
  assert.doesNotMatch(page, /import EnergySandVolume from/);
  assert.doesNotMatch(page, /import MagicRings from/);
  assert.doesNotMatch(page, /import SideRays from/);
  assert.match(page, /dynamic\(\s*\(\) => import\("@\/components\/dashboard\/WorkspaceSplashCursor"\)/);
  assert.match(page, /dynamic\(\s*\(\) => import\("@\/components\/dashboard\/EnergySandVolume"\)/);
  assert.match(page, /dynamic\(\s*\(\) => import\("@\/components\/dashboard\/MagicRings"\)/);
  assert.match(page, /dynamic\(\s*\(\) => import\("@\/components\/dashboard\/SideRays"\)/);
  assert.match(page, /className="energy-sand-volume"/);
  assert.match(page, /className="magic-rings-container"/);
  assert.match(page, /className="side-rays-container"/);
});

test("permanent WebGL loops stop while the document is hidden", () => {
  assert.match(splash, /visibilitychange/);
  assert.match(splash, /document\.hidden/);
  assert.match(sideRays, /visibilitychange/);
  assert.match(sideRays, /document\.hidden/);
});
