import assert from "node:assert/strict";
import test from "node:test";

import { createWorkspaceReadCoordinator } from "./workspace-read-coordinator.ts";

test("shares one in-flight read for the same key", async () => {
  const coordinator = createWorkspaceReadCoordinator<number>();
  const key = {};
  let calls = 0;
  const loader = async () => ++calls;

  const first = coordinator.read(key, loader);
  const second = coordinator.read(key, loader);

  assert.equal(first.generation, second.generation);
  assert.equal(first.promise, second.promise);
  assert.equal(await first.promise, 1);
  assert.equal(calls, 1);
});

test("a different key starts a newer generation", async () => {
  const coordinator = createWorkspaceReadCoordinator<number>();
  const first = coordinator.read({}, async () => 1);
  const second = coordinator.read({}, async () => 2);

  assert.equal(coordinator.isCurrent(first.generation), false);
  assert.equal(coordinator.isCurrent(second.generation), true);
  assert.equal(await second.promise, 2);
});

test("invalidation makes an older response stale", async () => {
  const coordinator = createWorkspaceReadCoordinator<number>();
  const read = coordinator.read({}, async () => 1);

  coordinator.invalidate();

  assert.equal(coordinator.isCurrent(read.generation), false);
});

test("settling an older promise does not clear a newer read", async () => {
  const coordinator = createWorkspaceReadCoordinator<number>();
  const key = {};
  let resolveFirst!: (value: number) => void;
  let resolveSecond!: (value: number) => void;
  const first = coordinator.read(key, () => new Promise<number>((resolve) => { resolveFirst = resolve; }));
  coordinator.invalidate();
  const second = coordinator.read(key, () => new Promise<number>((resolve) => { resolveSecond = resolve; }));

  resolveFirst(1);
  await first.promise;
  const sharedSecond = coordinator.read(key, async () => 3);

  assert.equal(sharedSecond.promise, second.promise);
  resolveSecond(2);
  assert.equal(await sharedSecond.promise, 2);
});
