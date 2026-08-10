import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("人族 is configured to loop its instrumental label", () => {
  const track = TRACKS.find((candidate) => candidate.title === "人族");

  assert.equal(track?.lyricsSlug, "人族");
  assert.equal(track?.lyricsLoop, true);
});

test("人族 lyric API returns the untimed Instrumental content", async () => {
  const response = await GET(
    new Request("http://localhost/api/lyrics/%E4%BA%BA%E6%97%8F"),
    { params: Promise.resolve({ slug: "人族" }) },
  );
  const payload = (await response.json()) as {
    lines?: unknown[];
    loopText?: string;
  };

  assert.equal(response.status, 200);
  assert.deepEqual(payload.lines, []);
  assert.equal(payload.loopText, "Instrumental");
});
