import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { isVisualRuntimeActive } from "./useVisualRuntimeActivity.ts";

test("runtime activity requires every lifecycle gate", () => {
  assert.equal(isVisualRuntimeActive({ enabled: true, reducedMotion: false, pageVisible: true, intersecting: true }), true);
  assert.equal(isVisualRuntimeActive({ enabled: false, reducedMotion: false, pageVisible: true, intersecting: true }), false);
  assert.equal(isVisualRuntimeActive({ enabled: true, reducedMotion: true, pageVisible: true, intersecting: true }), false);
  assert.equal(isVisualRuntimeActive({ enabled: true, reducedMotion: false, pageVisible: false, intersecting: true }), false);
  assert.equal(isVisualRuntimeActive({ enabled: true, reducedMotion: false, pageVisible: true, intersecting: false }), false);
});

test("the hook observes visibility and intersection and cleans up both listeners", () => {
  const source = readFileSync("src/hooks/useVisualRuntimeActivity.ts", "utf8");
  assert.match(source, /document\.addEventListener\("visibilitychange"/);
  assert.match(source, /document\.removeEventListener\("visibilitychange"/);
  assert.match(source, /new IntersectionObserver/);
  assert.match(source, /observer\.disconnect\(\)/);
});

test("Side Rays uses the shared runtime gate while Splash Cursor preserves its context-safe pause", () => {
  const splash = readFileSync("src/components/SplashCursor.jsx", "utf8");
  const sideRays = readFileSync("src/components/dashboard/SideRays.jsx", "utf8");
  assert.match(sideRays, /useVisualRuntimeActivity/);
  assert.doesNotMatch(sideRays, /new IntersectionObserver/);
  assert.match(sideRays, /let cancelled = false/);
  assert.match(sideRays, /if \(cancelled \|\| !containerRef\.current\) return/);
  assert.match(splash, /stopFrameLoop/);
  assert.match(splash, /visibilitychange/);
});
