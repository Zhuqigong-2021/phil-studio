import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("src/app/sign-in/page.tsx", "utf8");
const styles = readFileSync("src/app/sign-in/sign-in.css", "utf8");

test("sign-in renders the dark theme by default and preserves light tokens", () => {
  assert.match(page, /signin-page signin-theme-dark/);
  assert.match(styles, /\.signin-theme-dark\s*\{/);
  assert.match(styles, /\.signin-theme-light\s*\{/);
});

test("theme styling keeps the existing Google authentication action", () => {
  assert.match(page, /form action=\{signInWithGoogle\}/);
  assert.match(page, /Continue with Google/);
});
