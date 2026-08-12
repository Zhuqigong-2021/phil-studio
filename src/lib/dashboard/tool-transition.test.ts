import assert from "node:assert/strict";
import test from "node:test";

import {
  createToolTransitionLock,
  getToolTransitionPlan,
} from "./tool-transition.ts";

test("maps the source shell onto the destination bounds over the approved timing", () => {
  const plan = getToolTransitionPlan(
    { left: 24, top: 180, width: 400, height: 240 },
    { left: 276, top: 80, width: 1120, height: 704 },
    false,
  );

  assert.deepEqual(plan, {
    x: 252,
    y: -100,
    scaleX: 2.8,
    scaleY: 704 / 240,
    opacity: 0.16,
    borderRadius: 20,
    duration: 0.42,
    ease: "power3.inOut",
  });
});

test("reduced motion keeps the shell in place and uses only a short opacity handoff", () => {
  const plan = getToolTransitionPlan(
    { left: 24, top: 180, width: 400, height: 240 },
    { left: 276, top: 80, width: 1120, height: 704 },
    true,
  );

  assert.deepEqual(plan, {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 0,
    borderRadius: 16,
    duration: 0.16,
    ease: "power3.inOut",
  });
});

test("the transition lock rejects repeat activation until cleanup releases it", () => {
  const lock = createToolTransitionLock();

  assert.equal(lock.acquire(), true);
  assert.equal(lock.acquire(), false);

  lock.release();
  assert.equal(lock.acquire(), true);
});
