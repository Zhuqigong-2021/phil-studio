import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");

test("sidebar navigation icons use a true flex center without an SVG baseline gap", () => {
  assert.match(
    source,
    /className={`relative z-10 flex size-5 flex-shrink-0 items-center justify-center \[&>svg\]:block/,
  );
});

test("the home glyph receives a vertical optical correction without changing horizontal alignment", () => {
  assert.match(
    source,
    /function HomeIcon\(\)[\s\S]*?<svg[\s\S]*?className="block -translate-y-px"/,
  );
  assert.match(source, /justifyContent: expanded \? "flex-start" : "center"/);
});
