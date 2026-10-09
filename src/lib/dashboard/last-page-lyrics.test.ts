import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("最后一页 is available with its local audio and lyric timeline", async () => {
  const track = TRACKS.find((candidate) => candidate.title === "最后一页");

  assert.equal(track?.artist, "江语晨");
  assert.equal(track?.src, encodeURI("/music/最后一页-江语晨.mp3"));
  assert.equal(track?.cover, encodeURI("/music/covers/最后一页.png"));
  assert.equal(track?.lyricsSlug, "最后一页");
  assert.equal(
    existsSync(
      new URL("../../../public/music/最后一页-江语晨.mp3", import.meta.url),
    ),
    true,
  );
  assert.equal(
    existsSync(
      new URL("../../../public/music/covers/最后一页.png", import.meta.url),
    ),
    true,
  );

  const response = await GET(
    new Request("http://localhost/api/lyrics/last-page"),
    { params: Promise.resolve({ slug: "最后一页" }) },
  );
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.ok(
    payload.lines?.some(
      (line) => line.time === 14.41 && line.text === "雨停滞天空之间",
    ),
  );
  assert.deepEqual(payload.lines?.at(-1), {
    time: 232.28,
    text: "能否让我把故事重写",
  });
});
