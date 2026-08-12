import assert from "node:assert/strict";
import test from "node:test";

import { getManageDirectEntrancePlan } from "./manage-entrance-motion.ts";

test("direct Manage entrance assigns spatial origins and restrained row stagger", () => {
  const plan = getManageDirectEntrancePlan(false);

  assert.deepEqual(plan.sidebar.from, { autoAlpha: 0, x: -44 });
  assert.deepEqual(plan.navbar.from, { autoAlpha: 0, y: -32 });
  assert.deepEqual(plan.header.from, { autoAlpha: 0, y: -20 });
  assert.deepEqual(plan.table.from, { autoAlpha: 0, x: 46 });
  assert.deepEqual(plan.pagination.from, { autoAlpha: 0, y: 26 });
  assert.deepEqual(plan.rows.from, { autoAlpha: 0, y: 8 });
  assert.equal(plan.rows.to.stagger, 0.04);
  assert.equal(plan.duration, 1.4);
});

test("reduced Manage motion removes translations and stagger", () => {
  const plan = getManageDirectEntrancePlan(true);

  for (const region of [plan.sidebar, plan.navbar, plan.header, plan.table, plan.pagination, plan.rows]) {
    assert.deepEqual(region.from, { autoAlpha: 0 });
  }
  assert.equal(plan.rows.to.stagger, 0);
  assert.equal(plan.duration, 0.16);
});
