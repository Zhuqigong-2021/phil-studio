import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("src/app/dashboard/page.tsx", "utf8");

test("Favorites replaces one visible item so retained rows reflow into the gap", () => {
  assert.match(page, /data-favorites-animated-list/);
  assert.match(page, /FAVORITES_VISIBLE_COUNT\s*=\s*4/);
  assert.match(page, /visibleFavoriteTools/);
  assert.match(page, /mode="popLayout"/);
  assert.match(page, /exit=\{reduceMotion/);
  assert.doesNotMatch(page, /favoritesListRef/);
  assert.doesNotMatch(page, /list\.scrollTo/);
  assert.match(page, /onPointerEnter/);
  assert.match(page, /onWheel=\{handleFavoritesWheel\}/);
  assert.match(page, /event\.deltaY/);
  assert.match(page, /accumulateWheelIntent/);
  assert.match(page, /favoritesWheelIntentRef/);
  assert.match(page, /favoritesWheelGestureTimerRef/);
  assert.match(page, /FAVORITES_GESTURE_END_MS\s*=\s*520/);
  assert.match(page, /2000/);
  assert.doesNotMatch(page, /whileHover=\{reduceMotion \? undefined : \{ transform: "translateX\(3px\)" \}\}/);
  assert.doesNotMatch(page, /whileTap=\{reduceMotion \? undefined : \{ transform: "translateX\(3px\) scale\(0\.99\)" \}\}/);
});

test("Task Completion progress and count animate after check or uncheck", () => {
  assert.match(page, /data-task-progress-bar/);
  assert.match(page, /animate=\{\{ width: `\$\{progress\}%` \}\}/);
  assert.match(page, /data-task-completion-count/);
  assert.match(page, /key=\{`\$\{completedCount\}-\$\{tasks\.length\}`\}/);
});
