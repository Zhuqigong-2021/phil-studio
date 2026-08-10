import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("中国话 track points to its lyric timeline", () => {
  const track = TRACKS.find((candidate) => candidate.title === "中国话");

  assert.equal(track?.lyricsSlug, "中国话");
});

test("中国话 lyric API returns its complete timed text", async () => {
  const response = await GET(
    new Request("http://localhost/api/lyrics/%E4%B8%AD%E5%9B%BD%E8%AF%9D"),
    { params: Promise.resolve({ slug: "中国话" }) },
  );
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.ok(payload.lines?.some((line) =>
    line.time === 0.3 && line.text === "扁担宽板凳长扁担想绑在板凳上"
  ));
  assert.deepEqual(payload.lines?.at(-1), {
    time: 177.2,
    text: "我们说的话让世界都认真听话",
  });
});

test("lyric API still rejects path traversal with Unicode slugs enabled", async () => {
  const response = await GET(
    new Request("http://localhost/api/lyrics/traversal"),
    { params: Promise.resolve({ slug: "../中国话" }) },
  );

  assert.equal(response.status, 400);
});
