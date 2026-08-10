import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("斗牛，要不要 points to its lyric timeline", () => {
  const track = TRACKS.find(
    (candidate) => candidate.title === "斗牛，要不要",
  );

  assert.equal(track?.lyricsSlug, "斗牛要不要");
});

test("斗牛要不要 lyric API returns its complete timed text", async () => {
  const response = await GET(
    new Request("http://localhost/api/lyrics/bull-fighting"),
    { params: Promise.resolve({ slug: "斗牛要不要" }) },
  );
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.ok(payload.lines?.some((line) =>
    line.time === 17.05 && line.text === "斗牛要不要"
  ));
  assert.deepEqual(payload.lines?.at(-1), {
    time: 178.38,
    text: "你现在还来得及逃",
  });
});
