import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const componentSource = readFileSync(
  "src/components/magicui/DiaTextReveal.tsx",
  "utf8",
);
const greetingSource = readFileSync(
  "src/components/dashboard/DashboardGreeting.tsx",
  "utf8",
);

test("dashboard greeting uses a controlled Dia reveal and keeps the wave stable", () => {
  assert.match(greetingSource, /<DiaTextReveal[\s\S]*text=\{typedText\}/);
  assert.match(greetingSource, /<span aria-hidden="true">👋<\/span>/);
  assert.match(componentSource, /useReducedMotion/);
  assert.doesNotMatch(componentSource, /sessionStorage|performance\.timeOrigin/);
  assert.match(componentSource, /requestAnimationFrame\(\(\) => setMounted\(true\)\)/);
  assert.match(componentSource, /clipPath: \[/);
  assert.match(componentSource, /inset\(0 100% 0 0\)/);
  assert.match(componentSource, /inset\(0 0 0 100%\)/);
  assert.match(componentSource, /position: "absolute"/);
  assert.match(componentSource, /onAnimationComplete=\{\(\) => \{/);
  assert.match(componentSource, /onRevealComplete\?\.\(\)/);
});
