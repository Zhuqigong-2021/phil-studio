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
  const empty: FavoriteToastState = { current: null, retiring: null };
  const shown = reduceFavoriteToast(empty, { type: "show", detail: first });
  const replaced = reduceFavoriteToast(shown, { type: "show", detail: second });

  assert.deepEqual(shown.current, first);
  assert.deepEqual(replaced.current, second);
  assert.deepEqual(replaced.retiring, first);
  assert.deepEqual(reduceFavoriteToast(replaced, { type: "dismiss", id: first.id }), replaced);
  assert.deepEqual(
    reduceFavoriteToast(replaced, { type: "dismiss", id: second.id }),
    { current: null, retiring: second },
  );
  assert.deepEqual(
    reduceFavoriteToast(replaced, { type: "retired", id: first.id }),
    { current: second, retiring: null },
  );
});

test("root layout mounts one global accessible favorite toast host", async () => {
  const [layout, host, globals] = await Promise.all([
    readFile(new URL("../../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("./FavoriteToastHost.tsx", import.meta.url), "utf8"),
    readFile(new URL("../../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.equal((layout.match(/<FavoriteToastHost\s*\/>/g) ?? []).length, 1);
  assert.match(host, /FAVORITE_TOAST_EVENT/);
  assert.match(host, /3000/);
  assert.match(host, /role=\{toast\.tone === "error" \? "alert" : "status"\}/);
  assert.match(host, /fixed left-1\/2 top-5/);
  assert.match(host, /-translate-x-1\/2/);
  assert.match(host, /rounded-\[10px\]/);
  assert.doesNotMatch(host, /bottom-20|sm:bottom-6|rounded-2xl/);
  assert.match(host, /rounded-full.*bg-emerald-500/);
  assert.match(host, /rounded-full.*bg-indigo-500/);
  assert.match(host, /rounded-full.*bg-rose-500/);
  assert.match(host, /flex h-5 w-5 shrink-0/);
  assert.match(host, /className="h-\[15px\] w-\[15px\] text-white" strokeWidth=\{3\}/);
  assert.match(host, /import \{ Check, Minus, X \} from "lucide-react"/);
  assert.doesNotMatch(host, /CheckCircle2|AlertCircle|\bInfo\b/);
  assert.match(host, /animate-\[favorite-toast-fade-in_180ms_ease-out_both\]/);
  assert.match(host, /motion-reduce:animate-none/);
  assert.match(host, /RETIRE_AFTER_MS = 220/);
  assert.match(host, /favorite-toast-retire/);
  assert.match(host, /pointer-events-auto/);
  assert.match(host, /onClick=\{\(\) => dismissToast\(toast\.id\)\}/);
  assert.match(host, /tabIndex=\{0\}/);
  assert.match(globals, /@keyframes favorite-toast-fade-in/);
  assert.match(globals, /@keyframes favorite-toast-retire/);
  assert.match(globals, /filter:\s*blur\(4px\)/);
  assert.match(globals, /transform:\s*translateY\(-4px\) scale\(0\.94\)/);
  assert.match(globals, /from\s*\{\s*opacity:\s*0/);
  assert.match(globals, /to\s*\{\s*opacity:\s*1/);
});
