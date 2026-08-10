import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("Attraction is configured to loop its instrumental label", () => {
  const track = TRACKS.find((candidate) => candidate.title === "Attraction");

  assert.equal(track?.lyricsSlug, "Attraction");
  assert.equal(track?.lyricsLoop, true);
});

test("Attraction lyric API returns the untimed Instrumental content", async () => {
  const response = await GET(new Request("http://localhost/api/lyrics/Attraction"), {
    params: Promise.resolve({ slug: "Attraction" }),
  });
  const payload = (await response.json()) as {
    lines?: unknown[];
    loopText?: string;
  };

  assert.equal(response.status, 200);
  assert.deepEqual(payload.lines, []);
  assert.equal(payload.loopText, "Instrumental");
});
