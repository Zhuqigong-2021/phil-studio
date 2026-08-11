import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  databaseErrorMessage,
  databaseSuccessMessage,
} from "./tool-mutations.ts";

test("creates concise success copy for database tool actions", () => {
  assert.equal(databaseSuccessMessage("updated", "Notion"), "Updated: Notion");
  assert.equal(databaseSuccessMessage("deleted", "Notion"), "Deleted: Notion");
});

test("maps validation and authorization failures to actionable database messages", () => {
  assert.match(databaseErrorMessage({ status: 400 }, "update", "Notion"), /check the tool details/i);
  assert.match(databaseErrorMessage({ status: 401 }, "delete", "Notion"), /sign in/i);
  assert.match(databaseErrorMessage({ status: 403 }, "delete", "Notion"), /permission/i);
});

test("maps availability, network, and unknown database failures separately", () => {
  assert.match(databaseErrorMessage({ status: 503 }, "update", "Notion"), /temporarily unavailable/i);
  assert.match(databaseErrorMessage(new TypeError("Failed to fetch"), "update", "Notion"), /connection/i);
  assert.match(databaseErrorMessage(new Error("unexpected"), "update", "Notion"), /try again/i);
});

test("uses the established toast replacement and motion behavior in secondary shells", async () => {
  const [viewport, shell] = await Promise.all([
    readFile(new URL("../../components/dashboard/DatabaseToastViewport.tsx", import.meta.url), "utf8"),
    readFile(new URL("../../components/dashboard/SecondaryPageShell.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(viewport, /DATABASE_TOAST_EVENT/);
  assert.match(viewport, /reduceFavoriteToast/);
  assert.match(viewport, /favorite-toast-enter/);
  assert.match(viewport, /favorite-toast-retiring/);
  assert.doesNotMatch(viewport, /@keyframes/);
  assert.match(shell, /DatabaseToastViewport/);
  assert.equal((shell.match(/<DatabaseToastViewport\s*\/>/g) ?? []).length, 1);
});
