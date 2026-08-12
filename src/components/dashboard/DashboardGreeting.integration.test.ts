import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("src/components/dashboard/DashboardGreeting.tsx", "utf8");
const page = readFileSync("src/app/dashboard/page.tsx", "utf8");

test("greeting sequences typing, Dia reveal, then the location bounce", () => {
  assert.match(page, /<DashboardGreeting/);
  assert.match(source, /onTypingComplete/);
  assert.match(source, /active=\{typingComplete && !reduceMotion\}/);
  assert.match(source, /onRevealComplete/);
  assert.match(source, /data-dashboard-location/);
  assert.match(source, /y: \[0, -18, 0, -10, 0, -5, 0, -2, 0\]/);
  assert.match(source, /Bonjour, Phil !/);
  assert.match(source, /Montréal, Canada/);
});

test("wave stays outside the typed and colorized title", () => {
  assert.match(source, /<span aria-hidden="true">👋<\/span>/);
});
