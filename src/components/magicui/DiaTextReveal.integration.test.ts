import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const componentSource = readFileSync(
  "src/components/magicui/DiaTextReveal.tsx",
  "utf8",
);
const dashboardSource = readFileSync("src/app/dashboard/page.tsx", "utf8");

test("dashboard greeting uses a one-session Dia reveal and keeps the wave stable", () => {
  assert.match(dashboardSource, /<DiaTextReveal[\s\S]*text="Bonjour, Phil !"/);
  assert.match(dashboardSource, /<span aria-hidden="true">👋<\/span>/);
  assert.match(componentSource, /useReducedMotion/);
  assert.doesNotMatch(componentSource, /sessionStorage|performance\.timeOrigin/);
  assert.match(componentSource, /requestAnimationFrame\(\(\) => setMounted\(true\)\)/);
  assert.match(componentSource, /clipPath: \[/);
  assert.match(componentSource, /inset\(0 100% 0 0\)/);
  assert.match(componentSource, /inset\(0 0 0 100%\)/);
  assert.match(componentSource, /position: "absolute"/);
  assert.match(componentSource, /onAnimationComplete=\{\(\) => setSettled\(true\)\}/);
});
