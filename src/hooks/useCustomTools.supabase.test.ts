import assert from "node:assert/strict";
import test from "node:test";

import { CUSTOM_CATEGORIES_KEY, CUSTOM_TOOLS_KEY, PINNED_TOOLS_KEY } from "../lib/dashboard/custom-tools.ts";
import { FAVORITES_STORAGE_KEY } from "../lib/dashboard/favorites.ts";
import { RECENT_TOOLS_STORAGE_KEY } from "../lib/dashboard/recent-tools.ts";
import {
  WorkspaceSyncError,
  fetchWorkspaceSnapshot,
  type LocalMigrationPayload,
  type WorkspaceSnapshot,
} from "../lib/dashboard/workspace-data.ts";
import {
  SUPABASE_MIGRATED_KEY,
  createOptimisticToolPatch,
  readCachedWorkspace,
  synchronizeWorkspace,
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

function snapshot(tool = serverTool): WorkspaceSnapshot {
  return { tools: [tool], categories: ["Research"], pinnedToolIds: [tool.id], recentTools: [] };
}

function api(overrides: Partial<WorkspaceApi> = {}): WorkspaceApi {
  return {
    fetchSnapshot: async () => snapshot(),
    migrate: async () => snapshot(),
    postTool: async () => serverTool,
    postCategory: async (name) => ({ id: "category-1", name, sortOrder: 0 }),
    patchTool: async () => serverTool,
    ...overrides,
  };
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
