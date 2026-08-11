import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  reduceFavoriteToast,
  type FavoriteToastDetail,
  type FavoriteToastState,
} from "../../lib/dashboard/favorite-toast.ts";

const first: FavoriteToastDetail = { id: 1, tone: "success", message: "Favorited: Notion" };
const second: FavoriteToastDetail = { id: 2, tone: "info", message: "Removed from favorites: Notion" };

test("new favorite results replace the current toast and obsolete dismissals cannot clear them", () => {
  const empty: FavoriteToastState = { current: null };
  const shown = reduceFavoriteToast(empty, { type: "show", detail: first });
  const replaced = reduceFavoriteToast(shown, { type: "show", detail: second });

  assert.deepEqual(shown.current, first);
  assert.deepEqual(replaced.current, second);
  assert.deepEqual(reduceFavoriteToast(replaced, { type: "dismiss", id: first.id }).current, second);
  assert.equal(reduceFavoriteToast(replaced, { type: "dismiss", id: second.id }).current, null);
});

test("root layout mounts one global accessible favorite toast host", async () => {
  const [layout, host] = await Promise.all([
    readFile(new URL("../../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("./FavoriteToastHost.tsx", import.meta.url), "utf8"),
  ]);

  assert.equal((layout.match(/<FavoriteToastHost\s*\/>/g) ?? []).length, 1);
  assert.match(host, /FAVORITE_TOAST_EVENT/);
  assert.match(host, /3000/);
  assert.match(host, /role=\{toast\.tone === "error" \? "alert" : "status"\}/);
  assert.match(host, /motion-reduce:transition-none/);
});
