import assert from "node:assert/strict";
import test from "node:test";

import { getDashboardEntranceTimeline } from "./motion-system.ts";

test("dashboard entrance plan assigns each region its spatial origin", () => {
  const plan = getDashboardEntranceTimeline(false);

  assert.deepEqual(plan.sidebar.from, { autoAlpha: 0, x: -44 });
  assert.deepEqual(plan.navbar.from, { autoAlpha: 0, y: -32 });
  assert.deepEqual(plan.utilities.from, { autoAlpha: 0, x: 44 });
  assert.deepEqual(plan.stats.from, { autoAlpha: 0, y: 38 });
  assert.deepEqual(plan.bottom.from, { autoAlpha: 0, y: 46 });
  assert.equal(plan.duration, 1.45);
  assert.equal(plan.ease, "power3.inOut");
  assert.notEqual(plan.sidebar.to, plan.navbar.to);
});

test("reduced motion uses opacity only for every region", () => {
  const plan = getDashboardEntranceTimeline(true);

  assert.deepEqual(plan.sidebar.from, { autoAlpha: 0 });
  assert.deepEqual(plan.navbar.from, { autoAlpha: 0 });
  assert.deepEqual(plan.utilities.from, { autoAlpha: 0 });
  assert.deepEqual(plan.stats.from, { autoAlpha: 0 });
  assert.deepEqual(plan.bottom.from, { autoAlpha: 0 });
  assert.equal(plan.duration, 0.16);
});
