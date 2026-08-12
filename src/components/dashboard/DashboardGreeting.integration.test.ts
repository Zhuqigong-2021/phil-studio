import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("src/components/dashboard/DashboardGreeting.tsx", "utf8");
const page = readFileSync("src/app/dashboard/page.tsx", "utf8");

test("greeting sequences title typing, subtitle typing, then the location bounce", () => {
  assert.match(page, /<DashboardGreeting/);
  assert.match(source, /titleTypingComplete/);
  assert.match(source, /subtitleTypingComplete/);
  assert.match(source, /titleRevealActive/);
  assert.match(source, /active=\{titleRevealActive && !reduceMotion\}/);
  assert.match(source, /TITLE_REVEAL_DELAY_MS/);
  assert.match(source, /ENTRANCE_SETTLE_MS/);
  assert.match(source, /Math\.max\(0, ENTRANCE_SETTLE_MS - elapsedMs\)/);
  assert.match(source, /WELCOME/);
  assert.match(source, /setTypedWelcome/);
  assert.match(source, /aria-hidden=\{!titleTypingComplete\}/);
  assert.match(source, /subtitleTypingComplete && \(/);
  assert.match(source, /data-dashboard-location/);
  assert.match(source, /y: \[0, -18, 0, -10, 0, -5, 0, -2, 0\]/);
  assert.match(source, /Bonjour, Phil !/);
  assert.match(source, /Montréal, Canada/);
});

test("wave stays outside the typed and colorized title", () => {
  assert.match(source, /titleTypingComplete && <span/);
  assert.match(source, /<span aria-hidden="true">👋<\/span>/);
});
