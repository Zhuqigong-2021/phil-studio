import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("We Are Electric is configured to loop its instrumental label", () => {
  const track = TRACKS.find(
    (candidate) => candidate.title === "We Are Electric",
  );

  assert.equal(track?.lyricsSlug, "Weareelectric");
  assert.equal(track?.lyricsLoop, true);
});

test("We Are Electric lyric API returns the untimed Instrumental content", async () => {
  const response = await GET(
    new Request("http://localhost/api/lyrics/Weareelectric"),
    { params: Promise.resolve({ slug: "Weareelectric" }) },
  );
  const payload = (await response.json()) as {
    lines?: unknown[];
    loopText?: string;
  };

  assert.equal(response.status, 200);
  assert.deepEqual(payload.lines, []);
  assert.equal(payload.loopText, "Instrumental");
});
