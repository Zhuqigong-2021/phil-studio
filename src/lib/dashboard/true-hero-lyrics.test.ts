import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("真英雄 is available with its audio, cover, and lyric timeline", async () => {
  const track = TRACKS.find((candidate) => candidate.title === "真英雄");

  assert.equal(track?.artist, "张卫健");
  assert.equal(track?.src, encodeURI("/music/真英雄-张卫健.mp3"));
  assert.equal(track?.cover, encodeURI("/music/covers/真英雄.png"));
  assert.equal(track?.lyricsSlug, "真英雄");
  assert.equal(
    existsSync(
      new URL("../../../public/music/真英雄-张卫健.mp3", import.meta.url),
    ),
    true,
  );
  assert.equal(
    existsSync(
      new URL("../../../public/music/covers/真英雄.png", import.meta.url),
    ),
    true,
  );

  const response = await GET(
    new Request("http://localhost/api/lyrics/true-hero"),
    { params: Promise.resolve({ slug: "真英雄" }) },
  );
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.ok(
    payload.lines?.some(
      (line) => line.time === 19 && line.text === "醉卧于沙场 听呐喊的沙哑",
    ),
  );
  assert.deepEqual(payload.lines?.at(-1), {
    time: 248.94,
    text: "我是真英雄 怎会假",
  });
});
