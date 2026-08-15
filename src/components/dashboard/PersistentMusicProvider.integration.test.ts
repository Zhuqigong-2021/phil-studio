import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const layout = readFileSync("src/app/layout.tsx", "utf8");
const provider = readFileSync("src/components/dashboard/PersistentMusicProvider.tsx", "utf8");
const dashboard = readFileSync("src/app/dashboard/page.tsx", "utf8");

test("root layout owns the audio element so route changes cannot unmount playback", () => {
  assert.match(layout, /PersistentMusicProvider/);
  assert.match(provider, /<audio/);
  assert.doesNotMatch(dashboard, /<audio\s/);
});

test("dashboard consumes persistent playback and lyrics state", () => {
  assert.match(dashboard, /usePersistentMusic/);
  assert.match(provider, /showLyrics/);
  assert.match(provider, /writeLyricsPreference/);
});

test("stable playback consumers do not subscribe to transient time updates", () => {
  const stableContext = provider.match(/type PersistentMusicContextValue = \{([\s\S]*?)\n\};/)?.[1] ?? "";
  assert.doesNotMatch(stableContext, /currentTime/);
  assert.doesNotMatch(stableContext, /duration/);
  assert.match(provider, /useSyncExternalStore/);
  assert.match(provider, /usePersistentMusicTiming/);
  assert.match(provider, /React\.useMemo<PersistentMusicContextValue>/);
  assert.match(dashboard, /function MusicPlayerPanel[\s\S]*?usePersistentMusicTiming\(\)/);
  assert.doesNotMatch(dashboard, /function useMusicPlayer\(\)[\s\S]{0,900}usePersistentMusicTiming/);
});

test("preloads only the current track and next track metadata", () => {
  assert.match(provider, /const nextTrackIndex = \(currentIndex \+ 1\) % TRACKS\.length/);
  assert.match(provider, /<audio[\s\S]*?preload="auto"[\s\S]*?src=\{TRACKS\[currentIndex\]\.src\}/);
  assert.match(provider, /<audio[\s\S]*?aria-hidden="true"[\s\S]*?preload="metadata"[\s\S]*?src=\{TRACKS\[nextTrackIndex\]\.src\}/);
  assert.doesNotMatch(provider, /TRACKS\.map\([\s\S]*?preload/);
});
