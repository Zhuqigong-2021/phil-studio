import assert from "node:assert/strict";
import test from "node:test";

import {
  beginToolLibraryHandoffEntrance,
  createToolLibraryHandoffMarker,
  createToolLibraryHandoffRegistry,
  createToolTransitionLock,
  createToolLibraryTransitionStarter,
  getToolTransitionPlan,
  type ToolTransitionOverlay,
  type ToolTransitionRect,
} from "./tool-transition.ts";

class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

class FakeOverlay implements ToolTransitionOverlay {
  readonly attributes = new Map<string, string>();
  readonly classes: string[] = [];
  readonly style: Record<string, string> = {};
  removed = false;

  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
  }

  removeAttribute(name: string) {
    this.attributes.delete(name);
  }

  classList = {
    add: (name: string) => {
      this.classes.push(name);
    },
  };

  remove() {
    this.removed = true;
  }
}

test("maps the source shell onto the destination bounds over the approved timing", () => {
  const plan = getToolTransitionPlan(
    { left: 24, top: 180, width: 400, height: 240 },
    { left: 276, top: 80, width: 1120, height: 704 },
    false,
  );

  assert.deepEqual(plan, {
    x: 252,
    y: -100,
    width: 1120,
    height: 704,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    borderRadius: 20,
    duration: 0.62,
    ease: "power3.inOut",
  });
});

test("reduced motion keeps the shell in place and uses only a short opacity handoff", () => {
  const plan = getToolTransitionPlan(
    { left: 24, top: 180, width: 400, height: 240 },
    { left: 276, top: 80, width: 1120, height: 704 },
    true,
  );

  assert.deepEqual(plan, {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 0,
    borderRadius: 16,
    duration: 0.16,
    ease: "power3.inOut",
  });
});

test("the transition lock rejects repeat activation until cleanup releases it", () => {
  const lock = createToolTransitionLock();

  assert.equal(lock.acquire(), true);
  assert.equal(lock.acquire(), false);

  lock.release();
  assert.equal(lock.acquire(), true);
});

test("Strict Mode setup replay preserves the handoff until the committed entrance clears it", () => {
  const storage = new MemoryStorage();
  let now = 1_000;
  const marker = createToolLibraryHandoffMarker({ storage: () => storage, now: () => now });
  const scheduled = new Map<number, () => void>();
  let nextId = 0;
  const schedule = (callback: () => void) => {
    const id = ++nextId;
    scheduled.set(id, callback);
    return () => scheduled.delete(id);
  };

  marker.mark();
  const firstSetup = beginToolLibraryHandoffEntrance(marker);
  assert.equal(firstSetup.handoff, true);
  const firstCleanup = firstSetup.establish(schedule);
  firstCleanup();

  now += 1;
  const replayedSetup = beginToolLibraryHandoffEntrance(marker);
  assert.equal(replayedSetup.handoff, true);
  replayedSetup.establish(schedule);

  for (const callback of scheduled.values()) callback();
  assert.equal(marker.detect(), false);
  assert.equal(storage.getItem("phil-studio:tool-library-handoff"), null);
});

test("handoff markers expire instead of leaking into a later direct navigation", () => {
  const storage = new MemoryStorage();
  let now = 10_000;
  const marker = createToolLibraryHandoffMarker({
    storage: () => storage,
    now: () => now,
    ttlMs: 5_000,
  });

  marker.mark();
  assert.equal(marker.detect(), true);

  now += 5_001;
  assert.equal(marker.detect(), false);
  assert.equal(storage.getItem("phil-studio:tool-library-handoff"), null);
});

test("transition starter owns marker, overlay, lock, cleanup, and route-once lifecycle", () => {
  const sourceRect: ToolTransitionRect = { left: 10, top: 20, width: 200, height: 100 };
  const destinationRect: ToolTransitionRect = { left: 30, top: 50, width: 400, height: 300 };
  const overlay = new FakeOverlay();
  const storage = new MemoryStorage();
  const marker = createToolLibraryHandoffMarker({ storage: () => storage, now: () => 1_000 });
  const pushes: string[] = [];
  const appended: ToolTransitionOverlay[] = [];
  const handoff = createToolLibraryHandoffRegistry();
  let cloneDepth: boolean | undefined;
  let animationComplete: (() => void) | undefined;
  let animationCancels = 0;
  let animationPlan: ReturnType<typeof getToolTransitionPlan> | undefined;
  const start = createToolLibraryTransitionStarter({
    lock: createToolTransitionLock(),
    findDestinationRect: () => destinationRect,
    cloneShell: (_source, deep) => {
      cloneDepth = deep;
      return overlay;
    },
    appendOverlay: (node) => appended.push(node),
    prefersReducedMotion: () => false,
    marker,
    handoff,
    animate: (_node, plan, onComplete) => {
      animationPlan = plan;
      animationComplete = onComplete;
      return () => { animationCancels += 1; };
    },
  });
  const router = { push: (href: string) => pushes.push(href) };
  const source = { getBoundingClientRect: () => sourceRect };

  const cleanup = start(source, router);
  assert.equal(typeof cleanup, "function");
  assert.equal(start(source, router), null);
  assert.equal(cloneDepth, true);
  assert.deepEqual(appended, [overlay]);
  assert.deepEqual(animationPlan, getToolTransitionPlan(sourceRect, destinationRect, false));

  animationComplete?.();
  animationComplete?.();
  cleanup?.();

  assert.deepEqual(pushes, ["/manage"]);
  assert.equal(marker.detect(), true);
  marker.clear();
  assert.equal(marker.detect(), false);
  assert.equal(overlay.removed, false);
  assert.equal(animationCancels, 0);
  assert.equal(start(source, router), null);

  handoff.complete();
  assert.equal(overlay.removed, true);
  assert.equal(animationCancels, 1);
  assert.notEqual(start(source, router), null);
});

test("manual transition cleanup releases the lock without marking or navigating", () => {
  const sourceRect: ToolTransitionRect = { left: 0, top: 0, width: 100, height: 50 };
  const overlay = new FakeOverlay();
  const storage = new MemoryStorage();
  const marker = createToolLibraryHandoffMarker({ storage: () => storage, now: () => 1_000 });
  let cancels = 0;
  const pushes: string[] = [];
  const start = createToolLibraryTransitionStarter({
    lock: createToolTransitionLock(),
    findDestinationRect: () => ({ left: 20, top: 20, width: 200, height: 100 }),
    cloneShell: () => overlay,
    appendOverlay: () => undefined,
    prefersReducedMotion: () => false,
    marker,
    handoff: createToolLibraryHandoffRegistry(),
    animate: () => () => { cancels += 1; },
  });
  const source = { getBoundingClientRect: () => sourceRect };
  const router = { push: (href: string) => pushes.push(href) };

  const cleanup = start(source, router);
  cleanup?.();
  cleanup?.();

  assert.equal(cancels, 1);
  assert.equal(marker.detect(), false);
  assert.deepEqual(pushes, []);
  assert.notEqual(start(source, router), null);
});

test("browser handoff reuses the Manage scene instead of a dark inline veil", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("./tool-transition.ts", import.meta.url), "utf8");
  assert.match(source, /className = "manage-scene-background"/);
  assert.doesNotMatch(source, /background: "radial-gradient\(circle at 56%/);
  assert.match(source, /timeline\.to\(veil, \{ opacity: 1, duration: 0\.38[\s\S]*\}, 0\.70\)/);
  assert.match(source, /timeline\.to\(content, \{[\s\S]*opacity: 0\.48[\s\S]*\}, 0\.22\)/);
  assert.doesNotMatch(source, /gsap\.to\(veil, \{ opacity: 1/);
  assert.match(source, /querySelector<HTMLElement>\("\[data-dashboard-transition-content\]"\)/);
  assert.match(source, /const bounds = destination\.getBoundingClientRect\(\)/);
  assert.match(source, /const styles = window\.getComputedStyle\(destination\)/);
  assert.match(source, /bounds\.left \+ paddingLeft/);
  assert.doesNotMatch(source, /const left = desktop \? 300 : 20/);
});

test("handoff registry completes retained transition cleanup only once", () => {
  const handoff = createToolLibraryHandoffRegistry();
  let cleanups = 0;

  handoff.retain(() => { cleanups += 1; });
  assert.equal(handoff.hasActive(), true);
  handoff.complete();
  handoff.complete();

  assert.equal(cleanups, 1);
  assert.equal(handoff.hasActive(), false);
});
