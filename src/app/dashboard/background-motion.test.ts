import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pageSource = readFileSync("src/app/dashboard/page.tsx", "utf8");
const cssSource = readFileSync("src/app/dashboard/dashboard.css", "utf8");

test("dashboard background has isolated cinematic motion wiring", () => {
  const focusStart = cssSource.indexOf("@keyframes dashboard-background-resolve");
  const focusEnd = cssSource.indexOf("@keyframes dashboard-background-breathe");
  const focusSource = cssSource.slice(focusStart, focusEnd);

  assert.match(pageSource, /function DashboardBackground/);
  assert.match(pageSource, /gsap\.quickTo/);
  assert.match(pageSource, /dashboard-background-water-shimmer/);
  assert.match(cssSource, /@keyframes dashboard-background-breathe/);
  assert.match(cssSource, /@keyframes dashboard-water-shimmer/);
  assert.match(
    cssSource,
    /dashboard-background-resolve 2\.2s[\s\S]*dashboard-background-breathe 20s ease-in-out 2\.2s/,
  );
  assert.match(
    cssSource,
    /@keyframes dashboard-background-resolve \{[\s\S]*?0% \{[\s\S]*?blur\(32px\)[\s\S]*?scale\(1\.045\)[\s\S]*?35% \{[\s\S]*?blur\(24px\)[\s\S]*?68% \{[\s\S]*?blur\(8px\)[\s\S]*?100% \{[\s\S]*?blur\(0\)[\s\S]*?scale\(1\.02\)/,
  );
  assert.doesNotMatch(cssSource, /dashboard-background-blur-reveal/);
  assert.doesNotMatch(focusSource, /opacity:/);
});

test("dashboard background motion respects reduced motion and page visibility", () => {
  assert.match(pageSource, /visibilitychange/);
  assert.match(pageSource, /dashboard-background--paused/);
  assert.match(cssSource, /@media \(prefers-reduced-motion: reduce\)[\s\S]*dashboard-background-sharp/);
});
