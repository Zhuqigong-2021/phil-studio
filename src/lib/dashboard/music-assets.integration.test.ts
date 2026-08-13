import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
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
