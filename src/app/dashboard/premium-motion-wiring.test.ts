import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("src/app/dashboard/page.tsx", "utf8");
const cssSource = readFileSync("src/app/dashboard/dashboard.css", "utf8");

test("dashboard wires visible stat count-up and a shared active indicator", () => {
  assert.match(source, /function AnimatedStatValue/);
  assert.match(source, /layoutId="dashboard-active-stat"/);
  assert.match(source, /<AnimatedStatValue value=\{value\}/);
  assert.match(source, /className="stat-card-selection pointer-events-none/);
  assert.match(source, /rgba\(139, 122, 246, 0\.48\)/);
  assert.match(source, /inset 0 1px 0 rgba\(255, 255, 255, 0\.12\)/);
  assert.match(source, /0 8px 24px rgba\(79, 55, 180, 0\.16\)/);
  assert.doesNotMatch(source, /inset 0 0 0 1px rgba\(181,151,255,0\.58\)/);
  assert.doesNotMatch(source, /0 0 0 1\.5px rgba\(154,112,255,0\.85\)/);
  assert.match(source, /role=\{onClick \? "button" : undefined\}/);
  assert.match(source, /tabIndex=\{onClick \? 0 : undefined\}/);
  assert.match(cssSource, /\.stat-card:focus-visible/);
});

test("dashboard entrance wires five runtime layers across desktop and mobile headers", () => {
  assert.match(source, /data-dashboard-sidebar/);
  assert.match(source, /data-dashboard-navbar/);
  assert.match(source, /data-dashboard-utilities/);
  assert.match(source, /data-dashboard-stats/);
  assert.match(source, /data-dashboard-bottom/);
  assert.match(source, /getDashboardEntranceTimeline\(reduceMotion\)/);
});

test("stat panels use an overlapping focus-transfer presence handoff", () => {
  assert.match(source, /getPanelPresenceMotion\(reduceMotion\)/);
  assert.match(source, /<AnimatePresence initial=\{false\} mode="sync">/);
  assert.match(source, /data-active-stat-panel/);
  assert.doesNotMatch(source, /previousActiveRef/);
  assert.doesNotMatch(source, /getPanelMotion\(reduceMotion, direction\)/);
});

test("existing interactive surfaces wire the remaining refinement hooks", () => {
  assert.match(source, /data-quick-access-item/);
  assert.match(source, /dashboard-active-nav/);
  assert.match(source, /getPopoverMotion/);
  assert.match(source, /shouldDismissDrawer/);
  assert.match(source, /drag="x"/);
});
