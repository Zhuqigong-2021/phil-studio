import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./SplashCursor.jsx", import.meta.url), "utf8");

test("Splash Cursor defaults to the fixed violet color instead of rainbow mode", () => {
  assert.match(source, /RAINBOW_MODE = false/);
  assert.match(source, /COLOR = '#bb8af0'/);
});
