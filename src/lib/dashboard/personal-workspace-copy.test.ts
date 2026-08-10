import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../../app/dashboard/page.tsx", import.meta.url),
  "utf8",
);

test("replaces commercial plan copy with personal workspace language", () => {
  assert.match(source, />\s*Personal\s*</);
  assert.match(source, /My Workspace/);
  assert.match(source, /Built for my flow/);
  assert.equal(source.match(/>\s*Curated\s*</g)?.length, 2);
  assert.match(
    source,
    /className="text-\[#c094ff\] font-semibold text-\[15px\] whitespace-nowrap"[^>]*>\s*My Workspace/,
  );
  assert.doesNotMatch(source, /Pro Plan|Unlock premium|>\s*Upgrade\s*</);
});

test("Curated is decorative rather than interactive", () => {
  assert.doesNotMatch(source, />\s*(?:Edit|Customize)\s*</);
  assert.doesNotMatch(source, /<button[\s\S]{0,600}>\s*Curated\s*<\/button>/);
  assert.doesNotMatch(
    source,
    /onClick=\{\(\) => setSettingsOpen\(true\)\}[\s\S]{0,600}>\s*Curated\s*</,
  );
});
