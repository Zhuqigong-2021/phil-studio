import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const musicSource = readFileSync(path.join(projectRoot, "src/lib/dashboard/music.ts"), "utf8");

test("Sold Out uses a production-safe lowercase lyric slug and matching file", () => {
  assert.match(musicSource, /lyricsSlug: "soldout"/);
  assert.equal(existsSync(path.join(projectRoot, "music/soldout/soldout.txt")), true);
});

test("the China Talk audio asset keeps the configured Unicode filename", () => {
  assert.match(musicSource, /file: "中国话\.mp3"/);
  assert.equal(existsSync(path.join(projectRoot, "public/music/中国话.mp3")), true);
});

test("the two oversized dashboard tracks stay within a web delivery budget", () => {
  for (const fileName of ["七里香.mp3", "黑色毛衣.mp3"]) {
    const bytes = statSync(path.join(projectRoot, "public/music", fileName)).size;
    assert.ok(bytes < 12 * 1024 * 1024, `${fileName} is still ${bytes} bytes`);
  }
});
