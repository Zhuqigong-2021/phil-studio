import assert from "node:assert/strict";
import test from "node:test";

import {
  runFavoriteMutationWithToast,
  type FavoriteToastDetail,
} from "./favorite-toast.ts";

test("publishes favorite success only after the database mutation resolves", async () => {
  const published: FavoriteToastDetail[] = [];
  let resolveMutation!: () => void;
  const mutation = new Promise<void>((resolve) => {
    resolveMutation = resolve;
  });

  const pending = runFavoriteMutationWithToast({
    toolName: "Notion",
    favorite: true,
    mutate: () => mutation,
    publish: (detail) => published.push(detail),
  });

  assert.deepEqual(published, []);
  resolveMutation();
  await pending;
  assert.equal(published.length, 1);
  assert.deepEqual(
    { tone: published[0]?.tone, message: published[0]?.message },
    { tone: "success", message: "Favorited: Notion" },
  );
});

test("publishes unfavorite success after confirmation", async () => {
  const published: FavoriteToastDetail[] = [];

  await runFavoriteMutationWithToast({
    toolName: "Notion",
    favorite: false,
    mutate: async () => undefined,
    publish: (detail) => published.push(detail),
  });

  assert.equal(published[0]?.tone, "info");
  assert.equal(published[0]?.message, "Removed from favorites: Notion");
});

test("publishes the matching rollback error and preserves the mutation rejection", async () => {
  const published: FavoriteToastDetail[] = [];
  const failure = new Error("offline");

  await assert.rejects(
    () => runFavoriteMutationWithToast({
      toolName: "Notion",
      favorite: false,
      mutate: async () => { throw failure; },
      publish: (detail) => published.push(detail),
    }),
    (error) => error === failure,
  );

  assert.equal(published.length, 1);
  assert.deepEqual(
    { tone: published[0]?.tone, message: published[0]?.message },
    { tone: "error", message: "Could not remove Notion from favorites. Previous state restored." },
  );
});
