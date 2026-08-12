import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationUrl = new URL("./20260812034208_allow_custom_tool_colors.sql", import.meta.url);

test("migration preserves named accents and permits normalized custom hexadecimal colors", async () => {
  const migration = await readFile(migrationUrl, "utf8");

  assert.match(migration, /drop constraint if exists tools_icon_color_check;/i);
  assert.match(
    migration,
    /add constraint tools_icon_color_check check\s*\(\s*icon_color in \('violet', 'blue', 'pink', 'orange', 'cyan', 'teal', 'slate'\)\s*or icon_color ~ '\^#\[0-9A-F\]\{6\}\$'/i,
  );
});
