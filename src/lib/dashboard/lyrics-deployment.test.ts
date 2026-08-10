import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { TRACKS } from "./music.ts";

const projectRoot = path.resolve(import.meta.dirname, "../../..");

test("production lyric route traces every configured lyric source", () => {
  const nextConfig = readFileSync(
    path.join(projectRoot, "next.config.ts"),
    "utf8",
  );

  assert.match(nextConfig, /outputFileTracingIncludes/);
  assert.match(nextConfig, /["']\/api\/lyrics\/\*["']/);
  assert.match(nextConfig, /["']\.\/music\/\*\/\*\.txt["']/);

  const missingSources = TRACKS.filter(
    (track) =>
      track.lyricsSlug &&
      !existsSync(
        path.join(
          projectRoot,
          "music",
          track.lyricsSlug,
          `${track.lyricsSlug}.txt`,
        ),
      ),
  ).map((track) => track.lyricsSlug);

  assert.deepEqual(missingSources, []);
});
