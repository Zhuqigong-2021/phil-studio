import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("src/app/dashboard/page.tsx", "utf8");
const row = readFileSync("src/components/dashboard/CategoryProgressRow.tsx", "utf8");
const signInStyles = readFileSync("src/app/sign-in/sign-in.css", "utf8");

test("Categories animates bar width and percentage count", () => {
  assert.match(page, /CategoryProgressRow/);
  assert.match(row, /data-category-progress-bar/);
  assert.match(row, /data-category-progress-value/);
  assert.match(row, /getCategoryProgressMotion/);
  assert.match(row, /getCategoryProgressGradient/);
});

test("sign-in brand glyph has explicit desktop and mobile sizing", () => {
  assert.ok(signInStyles.includes(".signin-brand-mark"));
  assert.ok(signInStyles.includes("font-size: 21px"));
  assert.ok(signInStyles.includes(".signin-mobile-brand .signin-brand-mark"));
  assert.ok(signInStyles.includes("font-size: 19px"));
});
