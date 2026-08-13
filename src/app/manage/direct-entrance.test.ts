import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");

test("Manage keeps the View All handoff branch separate from direct entrance", () => {
  const handoffBranch = source.indexOf("if (entrance.handoff)");
  const directPlan = source.lastIndexOf("getManageDirectEntrancePlan");

  assert.ok(handoffBranch >= 0);
  assert.ok(source.indexOf("return;", handoffBranch) < directPlan);
});

test("direct Manage entrance targets the shell and all library regions", () => {
  for (const selector of [
    "[data-dashboard-sidebar]",
    "[data-dashboard-navbar]",
    "[data-manage-entrance-header]",
    "[data-manage-entrance-table]",
    "[data-manage-entrance-row]",
    "[data-manage-entrance-pagination]",
  ]) {
    assert.ok(source.includes(selector), `Missing direct entrance target ${selector}`);
  }
});

test("View All handoff mounts Manage at its final state without a second entrance", () => {
  const handoffStart = source.indexOf("if (entrance.handoff)");
  const handoffEnd = source.indexOf("return;", handoffStart);
  const handoffBranch = source.slice(handoffStart, handoffEnd);

  assert.match(handoffBranch, /gsap\.set\(targets, \{ opacity: 1, y: 0 \}\)/);
  assert.doesNotMatch(handoffBranch, /fromTo/);
  assert.doesNotMatch(handoffBranch, /y: reduceMotion \? 0 : 12/);
  assert.doesNotMatch(handoffBranch, /stagger/);
});

test("retained overlay cleanup starts only after the Manage root is mounted", () => {
  const mounted = source.indexOf('root.setAttribute("data-tool-library-handoff-mounted", "true")');
  const cleanup = source.indexOf("completeToolLibraryHandoff(reduceMotion)");

  assert.ok(mounted >= 0);
  assert.ok(cleanup > mounted);
});
