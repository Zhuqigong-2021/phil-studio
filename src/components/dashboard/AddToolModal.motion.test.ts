import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sourceUrl = new URL("./AddToolModal.tsx", import.meta.url);

test("Add Tool uses the focused modal entrance without changing its submission lifecycle", async () => {
  const source = await readFile(sourceUrl, "utf8");

  assert.match(source, /getOverlayMotion\(reduceMotion, "modal"\)/);
  assert.match(source, /\.\.\.overlayMotion\.backdrop/);
  assert.match(source, /data-add-tool-modal-surface/);
  assert.match(source, /\.\.\.overlayMotion\.surface/);
  assert.match(source, /runAddToolSubmission/);
  assert.match(source, /completeClose/);
});
