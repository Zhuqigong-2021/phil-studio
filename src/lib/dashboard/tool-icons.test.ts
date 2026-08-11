import assert from "node:assert/strict";
import test from "node:test";
import dynamicIconImports from "lucide-react/dynamicIconImports.mjs";

import {
  getToolIcon,
  ICON_CATEGORIES,
  searchToolIcons,
  TOOL_ICONS,
} from "./tool-icons.ts";
import { TOOLS_RAW } from "./mock-data.ts";

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

test("resolves every stable key to an installed Lucide dynamic import", () => {
  for (const icon of TOOL_ICONS) {
    const lucideName = icon.lucideName ?? icon.key;
    assert.ok(
      lucideName in dynamicIconImports,
      `${icon.key} resolves to missing Lucide icon ${lucideName}`,
    );
  }
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

test("assigns catalog-valid matching icons to every built-in tool", () => {
  const expected = {
    ap: "palette",
    cv: "contact",
    ps: "image",
    pdf: "file-text",
    am: "clapperboard",
    mm: "chart-network",
    sm: "graduation-cap",
    no: "book-open-text",
    ai: "brain-circuit",
  };

  assert.deepEqual(
    Object.fromEntries(TOOLS_RAW.map((tool) => [tool.id, tool.iconKey])),
    expected,
  );
  assert.ok(
    TOOLS_RAW.every(
      (tool) =>
        tool.iconType === "matching" &&
        TOOL_ICONS.some((icon) => icon.key === tool.iconKey),
    ),
  );
});
