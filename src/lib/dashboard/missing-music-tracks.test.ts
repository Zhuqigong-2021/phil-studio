import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

import { TRACKS } from "./music.ts";

for (const title of ["七里香", "黑色毛衣"]) {
  test(`${title} is available in the player with audio and cover`, () => {
    const track = TRACKS.find((candidate) => candidate.title === title);

    assert.equal(track?.artist, "周杰伦");
    assert.equal(track?.src, encodeURI(`/music/${title}.mp3`));
    assert.equal(track?.cover, encodeURI(`/music/covers/${title}.png`));
    assert.equal(
      existsSync(new URL(`../../../public/music/${title}.mp3`, import.meta.url)),
      true,
    );
  });
}
