import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pageSource = readFileSync("src/app/dashboard/page.tsx", "utf8");
const cssSource = readFileSync("src/app/dashboard/dashboard.css", "utf8");

test("desktop lighthouse beacon starts after the dashboard entrance and stops for navigation", () => {
  assert.match(pageSource, /function LighthouseBeacon/);
  assert.match(pageSource, /phil-studio:dashboard-entrance-complete/);
  assert.match(pageSource, /phil-studio:tool-library-transition-start/);
  assert.match(pageSource, /data-lighthouse-beacon/);
  assert.match(pageSource, /<LighthouseBeacon \/>/);
  assert.match(cssSource, /@media \(min-width: 1280px\)/);
  assert.match(cssSource, /@keyframes lighthouse-beacon-sweep/);
  assert.match(cssSource, /transform-origin: 0 50%/);
  assert.match(cssSource, /lighthouse-beacon--active/);
  assert.match(pageSource, /LIGHTHOUSE_SOURCE_X = 929/);
  assert.match(pageSource, /LIGHTHOUSE_SOURCE_Y = 145/);
  assert.match(pageSource, /Math\.max\(width \/ LIGHTHOUSE_BACKGROUND_WIDTH, height \/ LIGHTHOUSE_BACKGROUND_HEIGHT\)/);
  assert.match(cssSource, /mask-image:[\s\S]*conic-gradient/);
  assert.doesNotMatch(cssSource, /clip-path: polygon/);
});

test("lighthouse beacon is absent for reduced motion", () => {
  assert.match(pageSource, /useReducedMotion\(\)/);
  assert.match(cssSource, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.lighthouse-beacon/);
});

test("lighthouse beacon begins at the tower without a floating light orb", () => {
  assert.doesNotMatch(pageSource, /lighthouse-beacon__source(?:-core)?/);
  assert.match(pageSource, /lighthouse-beacon__near-field/);
  assert.doesNotMatch(cssSource, /\.lighthouse-beacon__source(?:-core)?/);
  assert.match(cssSource, /\.lighthouse-beacon__near-field/);
  assert.match(cssSource, /width: 132px/);
  assert.match(cssSource, /conic-gradient\(from 0deg at 0 50%/);
});
