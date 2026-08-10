import assert from "node:assert/strict";
import test from "node:test";

import {
  getToolIcon,
  ICON_CATEGORIES,
  searchToolIcons,
  TOOL_ICONS,
} from "./tool-icons.ts";

const ORIGINAL_TOOL_ICON_KEYS = [
  "app-window", "home", "search", "settings", "star", "heart", "bookmark", "user",
  "users", "bell", "calendar-days", "clock", "check-circle", "circle-plus",
  "external-link", "link", "briefcase-business", "building", "presentation", "bar-chart",
  "pie-chart", "trending-up", "target", "clipboard-list", "list-todo", "kanban", "mail",
  "phone", "contact", "badge-check", "palette", "brush", "pen-tool", "pencil", "shapes",
  "layers", "image", "camera", "magic-wand", "sparkles", "frame", "crop", "pipette",
  "swatch-book", "code", "terminal", "braces", "file-code", "bug", "git-branch",
  "git-pull-request", "database", "server", "cloud", "cpu", "bot", "workflow", "webhook",
  "play", "pause", "music", "video", "mic", "headphones", "volume", "radio", "podcast",
  "film", "clapperboard", "disc", "audio-lines", "gallery", "file", "files", "folder",
  "folder-open", "file-text", "file-spreadsheet", "file-image", "file-video", "file-audio",
  "file-archive", "download", "upload", "save", "paperclip", "lightbulb", "rocket", "globe",
  "map", "map-pin", "compass", "key", "lock", "shield-check", "wrench", "hammer", "package",
  "shopping-cart", "gift",
] as const;

test("contains exactly 500 unique icons across twenty non-empty categories", () => {
  assert.equal(TOOL_ICONS.length, 500);
  assert.equal(new Set(TOOL_ICONS.map(({ key }) => key)).size, 500);
  assert.equal(ICON_CATEGORIES.length, 20);

  for (const category of ICON_CATEGORIES) {
    assert.ok(
      TOOL_ICONS.some((icon) => icon.category === category),
      `${category} must contain at least one icon`,
    );
  }
});

test("preserves every original icon key", () => {
  for (const key of ORIGINAL_TOOL_ICON_KEYS) {
    assert.equal(getToolIcon(key).key, key);
  }
});

test("keeps icon metadata serializable and component-free", () => {
  assert.ok(TOOL_ICONS.every((icon) => !("Icon" in icon)));
  assert.doesNotThrow(() => JSON.stringify(TOOL_ICONS));
});

test("searches labels, keys, categories, and bilingual keywords", () => {
  assert.ok(
    searchToolIcons("briefcase", "all").some(
      ({ key }) => key === "briefcase-business",
    ),
  );
  assert.ok(
    searchToolIcons("数据库", "all").some(({ key }) => key === "database"),
  );
  assert.ok(
    searchToolIcons("Security", "all").every(
      ({ category }) => category === "Security",
    ),
  );
  assert.ok(
    searchToolIcons("automation", "all").some(
      ({ category }) => category === "AI & Automation",
    ),
  );
});

test("falls back safely for an unknown key", () => {
  assert.equal(getToolIcon("not-real").key, "app-window");
  assert.equal(getToolIcon(undefined).key, "app-window");
});
