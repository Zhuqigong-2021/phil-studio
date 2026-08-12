import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { CUSTOM_CATEGORIES_KEY, CUSTOM_TOOLS_KEY, PINNED_TOOLS_KEY } from "../lib/dashboard/custom-tools.ts";
import { FAVORITES_STORAGE_KEY } from "../lib/dashboard/favorites.ts";
import { RECENT_TOOLS_STORAGE_KEY } from "../lib/dashboard/recent-tools.ts";
import { TOOLS_RAW } from "../lib/dashboard/mock-data.ts";
import type { Tool } from "../lib/dashboard/types.ts";
import {
  WorkspaceSyncError,
  fetchWorkspaceSnapshot,
  type LocalMigrationPayload,
  type WorkspaceSnapshot,
} from "../lib/dashboard/workspace-data.ts";
import {
  SUPABASE_MIGRATED_KEY,
  createOptimisticToolPatch,
  synchronizeWorkspaceOnce,
  createSyncGuard,
  mergeCreatedTool,
  readCachedWorkspace,
  runGuardedSync,
  synchronizeWorkspace,
  writeWorkspaceCache,
  useCustomTools,
  type WorkspaceApi,
  type WorkspaceStorage,
} from "./useCustomTools.ts";

const customTool = {
  id: "custom-1", name: "Cached Tool", url: "https://example.com/", description: "",
  mono: "CT", accent: "blue" as const, tags: ["Research"], aliases: ["cache"],
  favorite: false, sourceType: "external" as const, iconKey: "book", iconType: "matching" as const,
};

const serverTool = { ...customTool, name: "Server Tool", favorite: true };

class MemoryStorage implements WorkspaceStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

function snapshot(tool: Tool = serverTool): WorkspaceSnapshot {
  return { tools: [tool], categories: ["Research"], pinnedToolIds: [tool.id], recentTools: [] };
}

function api(overrides: Partial<WorkspaceApi> = {}): WorkspaceApi {
  return {
    fetchSnapshot: async () => snapshot(),
    migrate: async () => snapshot(),
    postTool: async () => serverTool,
    postCategory: async (name) => ({ id: "category-1", name, sortOrder: 0 }),
    patchTool: async () => serverTool,
    deleteTool: async () => undefined,
    ...overrides,
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

async function withBrowserWindow<T>(storage: WorkspaceStorage, task: () => Promise<T>): Promise<T> {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: storage,
      dispatchEvent() {},
      setTimeout() { return 0; },
      clearTimeout() {},
      addEventListener() {},
      removeEventListener() {},
    },
  });
  try {
    return await task();
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else delete (globalThis as { window?: unknown }).window;
  }
}

function renderCustomTools(api: WorkspaceApi) {
  let result: ReturnType<typeof useCustomTools> | undefined;
  function Probe() {
    result = useCustomTools(api);
    return React.createElement("div");
  }
  renderToStaticMarkup(React.createElement(Probe));
  assert.ok(result);
  return result;
}

test("reads the local cache first and later replaces it with the server snapshot", async () => {
  const storage = new MemoryStorage();
  storage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify([customTool]));
  storage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(["Research"]));
  storage.setItem(PINNED_TOOLS_KEY, JSON.stringify([customTool.id]));
  storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify({ [customTool.id]: false }));
  storage.setItem(RECENT_TOOLS_STORAGE_KEY, "[]");
  storage.setItem(SUPABASE_MIGRATED_KEY, "true");

  assert.equal(readCachedWorkspace(storage).tools.some((tool) => tool.name === "Cached Tool"), true);
  assert.equal((await synchronizeWorkspace(storage, api())).tools[0].name, "Server Tool");
});

test("workspace cache round-trip preserves multiple custom tools with named and hexadecimal colors", () => {
  const storage = new MemoryStorage();
  const namedTool = { ...customTool, id: "named-tool", accent: "teal" as const };
  const colorTool = { ...customTool, id: "color-tool", accent: "#22D3EE" as const };

  writeWorkspaceCache(storage, {
    tools: [...TOOLS_RAW, namedTool, colorTool],
    categories: ["Research"],
    pinnedToolIds: [namedTool.id, colorTool.id],
    recentTools: [],
  });
  const restored = readCachedWorkspace(storage);

  assert.deepEqual(
    restored.tools.filter((tool) => tool.id === namedTool.id || tool.id === colorTool.id)
      .map((tool) => [tool.id, tool.accent]),
    [[namedTool.id, "teal"], [colorTool.id, "#22D3EE"]],
  );
});

test("authoritative workspace ignores a stale favorite cache and rewrites it", async () => {
  const storage = new MemoryStorage();
  const ap = TOOLS_RAW.find((tool) => tool.id === "ap");
  assert.ok(ap);
  storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify({ ap: false }));
  storage.setItem(SUPABASE_MIGRATED_KEY, "true");
  const getWorkspace = async () => snapshot({ ...ap, favorite: true });

  const workspace = readCachedWorkspace(storage, await getWorkspace());
  const synchronized = await synchronizeWorkspace(storage, api({ fetchSnapshot: getWorkspace }));

  assert.equal(workspace.tools.find((tool) => tool.id === "ap")?.favorite, true);
  assert.equal(synchronized.tools.find((tool) => tool.id === "ap")?.favorite, true);
  assert.equal(JSON.parse(storage.getItem(FAVORITES_STORAGE_KEY) ?? "{}").ap, true);
});

test("authoritative workspace does not resurrect a seeded tool deleted from the database", () => {
  const storage = new MemoryStorage();
  const authoritative = { ...snapshot(), tools: TOOLS_RAW.filter((tool) => tool.id !== "ap") };

  const cached = readCachedWorkspace(storage, authoritative);

  assert.equal(cached.tools.some((tool) => tool.id === "ap"), false);
});

test("sets the migration marker only after migration and refetch succeed and preserves source keys", async () => {
  const storage = new MemoryStorage();
  storage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify([customTool]));
  storage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(["Research"]));
  storage.setItem(PINNED_TOOLS_KEY, JSON.stringify([customTool.id]));
  storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify({ [customTool.id]: true }));
  storage.setItem(RECENT_TOOLS_STORAGE_KEY, JSON.stringify([{ id: customTool.id, openedAt: 123 }]));
  let migrationCalls = 0;
  let fail = true;
  let received: LocalMigrationPayload | undefined;
  const fake = api({
    migrate: async (payload) => {
      migrationCalls += 1;
      received = payload;
      if (fail) throw new Error("offline");
      return snapshot();
    },
  });

  await assert.rejects(() => synchronizeWorkspace(storage, fake), /offline/);
  assert.equal(storage.getItem(SUPABASE_MIGRATED_KEY), null);
  fail = false;
  await synchronizeWorkspace(storage, fake);
  assert.equal(storage.getItem(SUPABASE_MIGRATED_KEY), "true");
  assert.equal(migrationCalls, 2);
  assert.equal(received?.tools[0].id, customTool.id);
  assert.equal(storage.getItem(CUSTOM_TOOLS_KEY) !== null, true);
  assert.equal(storage.getItem(CUSTOM_CATEGORIES_KEY) !== null, true);
  assert.equal(storage.getItem(PINNED_TOOLS_KEY) !== null, true);
  assert.equal(storage.getItem(FAVORITES_STORAGE_KEY) !== null, true);
  assert.equal(storage.getItem(RECENT_TOOLS_STORAGE_KEY) !== null, true);

  await synchronizeWorkspace(storage, fake);
  assert.equal(migrationCalls, 2);
});

test("optimistic pin and favorite patches roll back the exact previous snapshot on failure", async () => {
  const initial = snapshot({ ...serverTool, favorite: false });
  const applied: WorkspaceSnapshot[] = [];
  const failing = api({ patchTool: async () => { throw new Error("offline"); } });

  await assert.rejects(
    () => createOptimisticToolPatch(initial, "custom-1", { pinned: false, favorite: true }, failing, (next) => applied.push(next)),
    /offline/,
  );
  assert.equal(applied[0].pinnedToolIds.includes("custom-1"), false);
  assert.equal(applied[0].tools[0].favorite, true);
  assert.deepEqual(applied.at(-1), initial);
});

test("a confirmed pin patch adopts the database update time for Quick Access ordering", async () => {
  const older = { ...customTool, updatedAt: "2026-08-10T00:00:00.000Z" };
  const persisted = { ...older, updatedAt: "2026-08-12T12:00:00.000Z" };
  let current: WorkspaceSnapshot = { ...snapshot(older), pinnedToolIds: [] };

  await createOptimisticToolPatch(
    current,
    older.id,
    { pinned: true },
    api({ patchTool: async () => persisted }),
    (next) => { current = next; },
    () => current,
  );

  assert.equal(current.tools[0].updatedAt, persisted.updatedAt);
  assert.deepEqual(current.pinnedToolIds, [older.id]);
});

test("setToolFavorite writes a confirmed server favorite to the cache", async () => {
  const storage = new MemoryStorage();
  const ap = TOOLS_RAW.find((tool) => tool.id === "ap");
  assert.ok(ap);
  await withBrowserWindow(storage, async () => {
    const tools = renderCustomTools(api({ patchTool: async () => ({ ...ap, favorite: true }) }));
    await tools.setToolFavorite("ap", false);
  });

  assert.equal(JSON.parse(storage.getItem(FAVORITES_STORAGE_KEY) ?? "{}").ap, true);
});

test("setToolFavorite restores the previous favorite in the cache after rejection", async () => {
  const storage = new MemoryStorage();
  await withBrowserWindow(storage, async () => {
    const tools = renderCustomTools(api({ patchTool: async () => { throw new Error("offline"); } }));
    await assert.rejects(() => tools.setToolFavorite("ap", false), /offline/);
  });

  assert.equal(JSON.parse(storage.getItem(FAVORITES_STORAGE_KEY) ?? "{}").ap, true);
});

test("workspace fetch adapter uses no-store and throws only a safe sync error", async () => {
  let cache: RequestCache | undefined;
  const result = await fetchWorkspaceSnapshot(async (_input, init) => {
    cache = init?.cache;
    return Response.json(snapshot());
  });
  assert.equal(cache, "no-store");
  assert.deepEqual(result, snapshot());

  await assert.rejects(
    () => fetchWorkspaceSnapshot(async () => new Response("secret https://project.supabase.co", { status: 502 })),
    (error: unknown) => error instanceof WorkspaceSyncError && error.message === "Workspace synchronization failed.",
  );
});

test("an older optimistic failure rolls back only its own field after a newer mutation succeeds", async () => {
  let current = snapshot({ ...serverTool, favorite: false });
  const pin = deferred<typeof serverTool>();
  const favorite = deferred<typeof serverTool>();
  const apply = (next: WorkspaceSnapshot) => { current = next; };
  const getCurrent = () => current;

  const pinRequest = createOptimisticToolPatch(
    current, customTool.id, { pinned: false }, api({ patchTool: async () => pin.promise }), apply, getCurrent,
  );
  const favoriteRequest = createOptimisticToolPatch(
    current, customTool.id, { favorite: true }, api({ patchTool: async () => favorite.promise }), apply, getCurrent,
  );
  favorite.resolve({ ...serverTool, favorite: true });
  await favoriteRequest;
  pin.reject(new Error("offline"));
  await assert.rejects(pinRequest, /offline/);

  assert.equal(current.tools[0].favorite, true);
  assert.equal(current.pinnedToolIds.includes(customTool.id), true);
});

test("reverse-order create completions merge into the latest workspace instead of replacing it", async () => {
  let current = snapshot();
  const first = deferred<typeof serverTool>();
  const second = deferred<typeof serverTool>();
  const firstTool = { ...serverTool, id: "created-first", name: "First" };
  const secondTool = { ...serverTool, id: "created-second", name: "Second" };
  const applyCreate = async (result: Promise<typeof serverTool>) => {
    const created = await result;
    current = mergeCreatedTool(current, created, false);
  };
  const firstRequest = applyCreate(first.promise);
  const secondRequest = applyCreate(second.promise);
  second.resolve(secondTool);
  await secondRequest;
  first.resolve(firstTool);
  await firstRequest;

  assert.deepEqual(current.tools.slice(-2).map((tool) => tool.id), [secondTool.id, firstTool.id]);
});

test("an older sync failure cannot overwrite a newer successful retry status or snapshot", async () => {
  const guard = createSyncGuard();
  const older = deferred<WorkspaceSnapshot>();
  const newer = deferred<WorkspaceSnapshot>();
  let revision = 0;
  let loading = false;
  let error: string | null = null;
  let current = snapshot(customTool);
  const handlers = {
    revision: () => revision,
    start: () => { loading = true; error = null; },
    success: (next: WorkspaceSnapshot) => { current = next; },
    failure: () => { error = "failed"; },
    finish: () => { loading = false; },
  };
  const olderRequest = runGuardedSync(guard, () => older.promise, handlers);
  const newerRequest = runGuardedSync(guard, () => newer.promise, handlers);
  newer.resolve(snapshot(serverTool));
  await newerRequest;
  older.reject(new Error("offline"));
  await olderRequest;

  assert.equal(current.tools[0].name, serverTool.name);
  assert.equal(error, null);
  assert.equal(loading, false);

  const stale = deferred<WorkspaceSnapshot>();
  const staleRequest = runGuardedSync(guard, () => stale.promise, handlers);
  revision += 1;
  current = mergeCreatedTool(current, { ...serverTool, id: "new-tool" }, false);
  stale.resolve(snapshot(customTool));
  await staleRequest;
  assert.equal(current.tools.some((tool) => tool.id === "new-tool"), true);
});

test("same-tab legacy refresh preserves authoritative mutable built-in fields for later mutations", () => {
  const storage = new MemoryStorage();
  const builtIn = TOOLS_RAW[0];
  const authoritativeBuiltIn = {
    ...builtIn,
    name: "Server-renamed built-in",
    description: "Server description",
    visible: false,
    aliases: ["server-alias"],
  };
  const authoritative: WorkspaceSnapshot = {
    tools: [authoritativeBuiltIn],
    categories: ["Server category"],
    pinnedToolIds: [],
    recentTools: [],
  };
  storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify({ [builtIn.id]: true }));

  const afterOwnEvent = readCachedWorkspace(storage, authoritative);
  const afterLaterCreate = mergeCreatedTool(afterOwnEvent, serverTool, false);
  const retained = afterLaterCreate.tools.find((tool) => tool.id === builtIn.id);

  assert.equal(retained?.name, authoritativeBuiltIn.name);
  assert.equal(retained?.description, authoritativeBuiltIn.description);
  assert.equal(retained?.visible, false);
  assert.deepEqual(retained?.aliases, ["server-alias"]);
  assert.equal(retained?.favorite, true);
});

test("startup refresh keeps cached favorites until the first successful sync", () => {
  const storage = new MemoryStorage();
  storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify({ ap: false }));
  assert.equal(readCachedWorkspace(storage).tools.find((tool) => tool.id === "ap")?.favorite, false);

  const source = readFileSync(new URL("./useCustomTools.ts", import.meta.url), "utf8");
  assert.match(source, /const hasAuthoritativeWorkspaceRef = useRef\(false\)/);
  const refreshBody = source.slice(source.indexOf("const refresh ="), source.indexOf("const initialRead ="));
  assert.match(
    refreshBody,
    /readCachedWorkspace\(\s*window\.localStorage,\s*hasAuthoritativeWorkspaceRef\.current \? workspaceRef\.current : undefined,\s*\)/,
  );
  const retrySyncStart = source.indexOf("const retrySync =");
  const retrySyncBody = source.slice(retrySyncStart, source.indexOf("useEffect(()", retrySyncStart));
  assert.match(retrySyncBody, /hasAuthoritativeWorkspaceRef\.current = true;\s*applyWorkspace\(snapshot\)/);
});

test("same-tab recent events refresh and clear recent state without a notification loop", () => {
  const storage = new MemoryStorage();
  const authoritative = snapshot();
  storage.setItem(RECENT_TOOLS_STORAGE_KEY, JSON.stringify([{ id: customTool.id, openedAt: 456 }]));
  assert.deepEqual(readCachedWorkspace(storage, authoritative).recentTools, [{ id: customTool.id, openedAt: 456 }]);
  storage.removeItem(RECENT_TOOLS_STORAGE_KEY);
  assert.deepEqual(readCachedWorkspace(storage, authoritative).recentTools, []);

  const source = readFileSync(new URL("./useCustomTools.ts", import.meta.url), "utf8");
  assert.match(source, /addEventListener\(RECENT_TOOLS_CHANGED_EVENT, refresh\)/);
  assert.match(source, /removeEventListener\(RECENT_TOOLS_CHANGED_EVENT, refresh\)/);
  const refreshBody = source.slice(source.indexOf("const refresh ="), source.indexOf("const initialRead ="));
  assert.doesNotMatch(refreshBody, /dispatchEvent/);
});

test("returning to the dashboard refetches the authoritative Supabase snapshot", () => {
  const source = readFileSync(new URL("./useCustomTools.ts", import.meta.url), "utf8");
  const effectStart = source.indexOf("useEffect(() =>", source.indexOf("const retrySync ="));
  const effectBody = source.slice(effectStart, source.indexOf("}, [retrySync]);", effectStart));

  assert.match(effectBody, /const refreshFromServer = \(\) => \{\s*void retrySync\(\);\s*\}/);
  assert.match(effectBody, /addEventListener\("focus", refreshFromServer\)/);
  assert.match(effectBody, /removeEventListener\("focus", refreshFromServer\)/);
});

test("concurrent hook startup shares one migration and snapshot request", async () => {
  const storage = new MemoryStorage();
  const migration = deferred<WorkspaceSnapshot>();
  let migrationCalls = 0;
  let fetchCalls = 0;
  const sharedApi = api({
    migrate: async () => {
      migrationCalls += 1;
      return migration.promise;
    },
    fetchSnapshot: async () => {
      fetchCalls += 1;
      return snapshot();
    },
  });

  const first = synchronizeWorkspaceOnce(storage, sharedApi);
  const second = synchronizeWorkspaceOnce(storage, sharedApi);
  assert.equal(migrationCalls, 1);
  migration.resolve(snapshot());

  const [firstSnapshot, secondSnapshot] = await Promise.all([first, second]);
  assert.equal(fetchCalls, 1);
  assert.equal(firstSnapshot, secondSnapshot);
});

test("a rejected shared startup is removed so a later retry can succeed", async () => {
  const storage = new MemoryStorage();
  let migrationCalls = 0;
  const sharedApi = api({
    migrate: async () => {
      migrationCalls += 1;
      if (migrationCalls === 1) throw new Error("temporary outage");
      return snapshot();
    },
  });

  const first = synchronizeWorkspaceOnce(storage, sharedApi);
  const second = synchronizeWorkspaceOnce(storage, sharedApi);
  await Promise.all([assert.rejects(first, /temporary outage/), assert.rejects(second, /temporary outage/)]);
  await synchronizeWorkspaceOnce(storage, sharedApi);

  assert.equal(migrationCalls, 2);
  assert.equal(storage.getItem(SUPABASE_MIGRATED_KEY), "true");
});

test("the same storage keeps distinct API clients isolated", async () => {
  const storage = new MemoryStorage();
  let firstCalls = 0;
  let secondCalls = 0;
  const firstApi = api({ migrate: async () => { firstCalls += 1; return snapshot(); } });
  const secondApi = api({ migrate: async () => { secondCalls += 1; return snapshot(); } });

  await Promise.all([
    synchronizeWorkspaceOnce(storage, firstApi),
    synchronizeWorkspaceOnce(storage, secondApi),
  ]);

  assert.equal(firstCalls, 1);
  assert.equal(secondCalls, 1);
});

test("the same API keeps distinct storage payloads and markers isolated", async () => {
  const firstStorage = new MemoryStorage();
  const secondStorage = new MemoryStorage();
  firstStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(["First only"]));
  secondStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(["Second only"]));
  const migratedCategories: string[][] = [];
  const sharedApi = api({
    migrate: async (payload) => {
      migratedCategories.push(payload.categories);
      return snapshot();
    },
  });

  await Promise.all([
    synchronizeWorkspaceOnce(firstStorage, sharedApi),
    synchronizeWorkspaceOnce(secondStorage, sharedApi),
  ]);

  assert.deepEqual(migratedCategories, [["First only"], ["Second only"]]);
  assert.equal(firstStorage.getItem(SUPABASE_MIGRATED_KEY), "true");
  assert.equal(secondStorage.getItem(SUPABASE_MIGRATED_KEY), "true");
});
