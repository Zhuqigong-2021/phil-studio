import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("对峙 is configured to loop its instrumental label", () => {
  const track = TRACKS.find((candidate) => candidate.title === "对峙");

  assert.equal(track?.lyricsSlug, "对峙");
  assert.equal(track?.lyricsLoop, true);
});

test("对峙 lyric API returns the untimed Instrumental content", async () => {
  const response = await GET(
    new Request("http://localhost/api/lyrics/confrontation"),
    { params: Promise.resolve({ slug: "对峙" }) },
  );
  const payload = (await response.json()) as {
    lines?: unknown[];
    loopText?: string;
  };

  assert.equal(response.status, 200);
  assert.deepEqual(payload.lines, []);
  assert.equal(payload.loopText, "Instrumental");
});
