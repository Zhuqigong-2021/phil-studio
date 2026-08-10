import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import nextConfig from "../../../next.config.ts";

test("dashboard owns the migrated page and darktheme permanently redirects to it", async () => {
  assert.equal(existsSync("src/app/dashboard/page.tsx"), true);
  assert.equal(existsSync("src/app/darktheme/page.tsx"), false);

  assert.equal(typeof nextConfig.redirects, "function");
  const redirects = await nextConfig.redirects?.();

  assert.deepEqual(redirects, [
    {
      source: "/darktheme",
      destination: "/dashboard",
      permanent: true,
    },
  ]);
});

test("shared dashboard components import route-local helpers from dashboard", () => {
  const syncedLyricsSource = readFileSync(
    "src/components/dashboard/SyncedLyrics.tsx",
    "utf8",
  );

  assert.doesNotMatch(syncedLyricsSource, /@\/app\/darktheme\//);
  assert.match(syncedLyricsSource, /@\/app\/dashboard\/lyrics-progress-motion/);
});
