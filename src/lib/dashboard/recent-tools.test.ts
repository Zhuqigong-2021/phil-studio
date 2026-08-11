import assert from "node:assert/strict";
import test from "node:test";

import { parseStoredRecentTools, recordRecentTool } from "./recent-tools.ts";

test("parses only valid recent tool entries", () => {
  assert.deepEqual(parseStoredRecentTools('[{"id":"tool-1","openedAt":123}]'), [{ id: "tool-1", openedAt: 123 }]);
  assert.deepEqual(parseStoredRecentTools('[{"id":7,"openedAt":"bad"}]'), []);
  assert.deepEqual(parseStoredRecentTools("bad json"), []);
});

test("records locally before firing a non-blocking persistent recent-use patch", async () => {
  const writes: string[] = [];
  const patches: Array<{ id: string; patch: unknown }> = [];
  const storage = {
    getItem: () => "[]",
    setItem: (_key: string, value: string) => writes.push(value),
  };
  let resolvePatch: (() => void) | undefined;
  const pending = new Promise<void>((resolve) => { resolvePatch = resolve; });

  recordRecentTool("tool-1", {
    storage,
    now: () => 123,
    dispatch: () => undefined,
    patchTool: async (id, patch) => { patches.push({ id, patch }); await pending; },
  });

  assert.equal(writes.length, 1);
  assert.deepEqual(JSON.parse(writes[0]), [{ id: "tool-1", openedAt: 123 }]);
  assert.deepEqual(patches, [{ id: "tool-1", patch: { recordUse: true, usedAt: new Date(123).toISOString() } }]);
  resolvePatch?.();
  await pending;
});

test("swallows persistent recent-use failures after the local write", async () => {
  recordRecentTool("tool-1", {
    storage: { getItem: () => "[]", setItem: () => undefined },
    now: () => 123,
    dispatch: () => undefined,
    patchTool: async () => { throw new Error("offline"); },
  });
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.ok(true);
});
