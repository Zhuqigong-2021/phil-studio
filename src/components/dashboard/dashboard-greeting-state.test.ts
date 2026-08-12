import assert from "node:assert/strict";
import test from "node:test";

import { getTypedText } from "./dashboard-greeting-state.ts";

test("typewriter reveals whole characters at a steady rate", () => {
  assert.deepEqual(getTypedText("Bonjour", 0, 55), {
    text: "",
    complete: false,
  });
  assert.deepEqual(getTypedText("Bonjour", -400, 55), {
    text: "",
    complete: false,
  });
  assert.deepEqual(getTypedText("Bonjour", 165, 55), {
    text: "Bon",
    complete: false,
  });
  assert.deepEqual(getTypedText("Bonjour", 999, 55), {
    text: "Bonjour",
    complete: true,
  });
});

test("reduced motion can request the final title immediately", () => {
  assert.deepEqual(getTypedText("Bonjour", Number.POSITIVE_INFINITY, 55), {
    text: "Bonjour",
    complete: true,
  });
});
