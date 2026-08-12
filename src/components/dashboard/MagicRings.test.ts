import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("./MagicRings.jsx", import.meta.url),
  "utf8",
);

test("updates animation props after commit instead of writing a ref during render", () => {
  const firstEffect = source.indexOf("useEffect(() => {");
  const propsUpdate = source.indexOf("propsRef.current = {");

  assert.ok(firstEffect >= 0, "MagicRings must synchronize its animation props in an effect");
  assert.ok(propsUpdate > firstEffect, "MagicRings must not write animation props during render");
});
