import assert from "node:assert/strict";
import test from "node:test";

import { getFavoriteRowMotion } from "./favorites-list-motion.ts";

test("favorite rows enter with restrained stagger and reflow smoothly", () => {
  const first = getFavoriteRowMotion(0, false);
  const third = getFavoriteRowMotion(2, false);
  assert.deepEqual(first.initial, { opacity: 0, transform: "translateY(8px)" });
  assert.equal(first.transition.delay, 0);
  assert.equal(third.transition.delay, 0.09);
  assert.equal(first.transition.layout.duration, 0.22);
  assert.equal(first.exit.transition.duration, 0.16);
});

test("favorite rows remove positional motion when reduced motion is requested", () => {
  const motion = getFavoriteRowMotion(3, true);
  assert.deepEqual(motion.initial, { opacity: 0 });
  assert.equal(motion.transition.delay, 0);
  assert.equal(motion.transition.layout.duration, 0);
});
