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
  assert.match(
    dashboardSource,
    /sessionKey="phil-studio:dashboard-greeting-reveal"/,
  );
  assert.match(dashboardSource, /<span aria-hidden="true">👋<\/span>/);
  assert.match(componentSource, /useReducedMotion/);
  assert.match(componentSource, /claimDiaTextReveal\(window\.sessionStorage/);
  assert.match(componentSource, /onAnimationComplete=\{\(\) => setSettled\(true\)\}/);
});
