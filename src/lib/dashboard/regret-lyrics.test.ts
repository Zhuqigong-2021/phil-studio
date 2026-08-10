import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("遗憾 is configured to loop its instrumental label", () => {
  const track = TRACKS.find((candidate) => candidate.title === "遗憾");

  assert.equal(track?.lyricsSlug, "遗憾");
  assert.equal(track?.lyricsLoop, true);
});

test("遗憾 lyric API returns the untimed Instrumental content", async () => {
  const response = await GET(
    new Request("http://localhost/api/lyrics/regret"),
    { params: Promise.resolve({ slug: "遗憾" }) },
  );
  const payload = (await response.json()) as {
    lines?: unknown[];
    loopText?: string;
  };

  assert.equal(response.status, 200);
  assert.deepEqual(payload.lines, []);
  assert.equal(payload.loopText, "Instrumental");
});
