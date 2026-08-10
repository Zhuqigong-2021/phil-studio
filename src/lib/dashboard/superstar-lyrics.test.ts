import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("Super Star track points to its lyric timeline", () => {
  const track = TRACKS.find((candidate) => candidate.title === "Super Star");

  assert.equal(track?.lyricsSlug, "superstar");
});

test("Super Star lyric API returns readable timed Chinese text", async () => {
  const response = await GET(new Request("http://localhost/api/lyrics/superstar"), {
    params: Promise.resolve({ slug: "superstar" }),
  });
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.ok(payload.lines?.some((line) =>
    line.time === 15.46 && line.text === "笑 就歌颂 一皱眉头就心痛"
  ));
  assert.equal(
    payload.lines?.some((line) => /[璇嶏細�]/.test(line.text)),
    false,
  );
  assert.deepEqual(payload.lines?.at(-1), {
    time: 182.47,
    text: "You're my super star boy",
  });
});
