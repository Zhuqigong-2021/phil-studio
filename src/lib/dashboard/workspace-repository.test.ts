import assert from "node:assert/strict";
import test from "node:test";

import type { Tables, TablesInsert, TablesUpdate } from "../supabase/database.types.ts";
import {
  createWorkspaceCategory,
  createWorkspaceTool,
  deleteWorkspaceTool,
  getWorkspaceSnapshot,
  migrateLocalWorkspace,
  patchWorkspaceTool,
  type WorkspaceDatabasePort,
} from "./workspace-repository.ts";

type ToolRow = Tables<"tools">;
type CategoryRow = Tables<"categories">;
type RelationshipRow = Tables<"tool_categories">;

const OWNER = "owner@example.com";
const NOW = "2026-08-10T00:00:00.000Z";

function toolRow(overrides: Partial<ToolRow> = {}): ToolRow {
  return {
    aliases: [], check_color: "#7C8698", check_status: "Unknown", created_at: NOW,
    description: "", icon_color: "violet", icon_key: null, icon_type: "monogram",
    id: "ap", is_favorite: false, is_pinned: false, last_checked_at: null,
    last_used_at: null, mono: "AP", name: "Arts Portfolio", owner_email: OWNER,
    sort_order: 0, source_type: "internal", updated_at: NOW, url: "https://example.com/",
    use_count: 0, visible: true, ...overrides,
  };
}

class MemoryPort implements WorkspaceDatabasePort {
  tools: ToolRow[] = [];
  categories: CategoryRow[] = [];
  relationships: RelationshipRow[] = [];
  ownerQueries: Array<{ table: "tools" | "categories"; ownerEmail: string }> = [];
  toolUpserts: Array<{ rows: TablesInsert<"tools">[]; options: { onConflict: "id"; ignoreDuplicates: boolean } }> = [];
  failRelationships = false;
  failAtomicPatch = false;
  deletedToolIds: string[] = [];
  deleteOperations: string[] = [];
  atomicPatchCalls: Array<{ ownerEmail: string; id: string; patch: TablesUpdate<"tools">; incrementUse: boolean }> = [];

  async listTools(ownerEmail: string) {
    this.ownerQueries.push({ table: "tools", ownerEmail });
    return this.tools.filter((row) => row.owner_email === ownerEmail);
  }
  async listCategories(ownerEmail: string) {
    this.ownerQueries.push({ table: "categories", ownerEmail });
    return this.categories.filter((row) => row.owner_email === ownerEmail);
  }
  async listRelationships(toolIds: readonly string[], categoryIds: readonly string[]) {
    return this.relationships.filter((row) => toolIds.includes(row.tool_id) && categoryIds.includes(row.category_id));
  }
  async upsertTools(rows: TablesInsert<"tools">[], options: { onConflict: "id"; ignoreDuplicates: boolean }) {
    this.toolUpserts.push({ rows, options });
    for (const row of rows) {
      const index = this.tools.findIndex((item) => item.id === row.id);
      if (index >= 0 && options.ignoreDuplicates) continue;
      const next = toolRow({ ...row, created_at: row.created_at ?? NOW, updated_at: row.updated_at ?? NOW });
      if (index >= 0) this.tools[index] = next;
      else this.tools.push(next);
    }
  }
  async findCategory(ownerEmail: string, name: string) {
    this.ownerQueries.push({ table: "categories", ownerEmail });
    return this.categories.find((row) => row.owner_email === ownerEmail && row.name.toLowerCase() === name.toLowerCase()) ?? null;
  }
  async insertCategory(row: TablesInsert<"categories">) {
    this.ownerQueries.push({ table: "categories", ownerEmail: row.owner_email });
    const category: CategoryRow = {
      id: row.id ?? `category-${this.categories.length + 1}`,
      owner_email: row.owner_email,
      name: row.name,
      sort_order: row.sort_order ?? 0,
      created_at: row.created_at ?? NOW,
      updated_at: row.updated_at ?? NOW,
    };
    this.categories.push(category);
    return category;
  }
  async findTool(ownerEmail: string, id: string) {
    this.ownerQueries.push({ table: "tools", ownerEmail });
    return this.tools.find((row) => row.owner_email === ownerEmail && row.id === id) ?? null;
  }
  async insertTool(row: TablesInsert<"tools">) {
    this.ownerQueries.push({ table: "tools", ownerEmail: row.owner_email });
    const created = toolRow({ ...row, created_at: row.created_at ?? NOW, updated_at: row.updated_at ?? NOW });
    this.tools.push(created);
    return created;
  }
  async updateTool(ownerEmail: string, id: string, patch: TablesUpdate<"tools">) {
    this.ownerQueries.push({ table: "tools", ownerEmail });
    const index = this.tools.findIndex((row) => row.owner_email === ownerEmail && row.id === id);
    if (index < 0) return null;
    this.tools[index] = { ...this.tools[index], ...patch };
    return this.tools[index];
  }
  async deleteTool(ownerEmail: string, id: string) {
    this.ownerQueries.push({ table: "tools", ownerEmail });
    this.deletedToolIds.push(id);
    this.tools = this.tools.filter((row) => row.owner_email !== ownerEmail || row.id !== id);
  }
  async findOwnedTool(ownerEmail: string, id: string) {
    this.ownerQueries.push({ table: "tools", ownerEmail });
    return this.tools.find((row) => row.owner_email === ownerEmail && row.id === id) ?? null;
  }
  async deleteToolRelationships(toolId: string) {
    this.deleteOperations.push(`relationships:${toolId}`);
    this.relationships = this.relationships.filter((row) => row.tool_id !== toolId);
  }
  async deleteOwnedTool(ownerEmail: string, id: string) {
    this.ownerQueries.push({ table: "tools", ownerEmail });
    this.deleteOperations.push(`tool:${id}`);
    this.tools = this.tools.filter((row) => row.owner_email !== ownerEmail || row.id !== id);
  }
  async upsertRelationships(rows: Array<{ tool_id: string; category_id: string }>) {
    if (this.failRelationships) throw new Error("relationship failed");
    for (const row of rows) {
      if (!this.relationships.some((item) => item.tool_id === row.tool_id && item.category_id === row.category_id)) {
        this.relationships.push({ ...row, created_at: NOW });
      }
    }
  }
  async patchToolAtomic(
    ownerEmail: string,
    id: string,
    patch: TablesUpdate<"tools">,
    categoryIds: readonly string[] | null,
    incrementUse: boolean,
    usedAt: string | null,
  ) {
    this.atomicPatchCalls.push({ ownerEmail, id, patch, incrementUse });
    const index = this.tools.findIndex((row) => row.owner_email === ownerEmail && row.id === id);
    if (index < 0) return null;
    if (this.failAtomicPatch) throw new Error("atomic patch failed");
    if (categoryIds && categoryIds.some((categoryId) => !this.categories.some(
      (category) => category.owner_email === ownerEmail && category.id === categoryId,
    ))) throw new Error("category ownership failed");
    await Promise.resolve();
    this.tools[index] = {
      ...this.tools[index],
      ...patch,
      ...(incrementUse ? {
        use_count: this.tools[index].use_count + 1,
        last_used_at: usedAt,
      } : {}),
    };
    if (categoryIds) {
      this.relationships = this.relationships.filter((row) => row.tool_id !== id);
      this.relationships.push(...categoryIds.map((category_id) => ({ tool_id: id, category_id, created_at: NOW })));
    }
    return this.tools[index];
  }
}

test("owner-scopes every tool/category query and assembles a snapshot after all query groups succeed", async () => {
  const port = new MemoryPort();
  port.categories.push({ id: "category-work", owner_email: OWNER, name: "Work", sort_order: 0, created_at: NOW, updated_at: NOW });
  port.relationships.push({ tool_id: "ap", category_id: "category-work", created_at: NOW });

  const snapshot = await getWorkspaceSnapshot(OWNER, port);

  assert.ok(port.ownerQueries.length > 0);
  assert.equal(port.ownerQueries.every((query) => query.ownerEmail === OWNER), true);
  assert.equal(snapshot.tools.find((tool) => tool.id === "ap")?.tags.includes("Work"), true);
  assert.equal(snapshot.categories.includes("Work"), true);
});

test("deletes only the owner's tool after removing its relationships", async () => {
  const port = new MemoryPort();
  const otherOwner = "other@example.com";
  port.tools.push(toolRow({ id: "mindmap" }), toolRow({ id: "mindmap-other", owner_email: otherOwner }));
  port.relationships.push(
    { tool_id: "mindmap", category_id: "owner-category", created_at: NOW },
    { tool_id: "mindmap-other", category_id: "other-category", created_at: NOW },
  );

  await deleteWorkspaceTool(OWNER, "mindmap", port);

  assert.equal(port.tools.some((row) => row.id === "mindmap" && row.owner_email === OWNER), false);
  assert.equal(port.tools.some((row) => row.id === "mindmap-other" && row.owner_email === otherOwner), true);
  assert.deepEqual(port.relationships.map((row) => row.tool_id), ["mindmap-other"]);
  assert.deepEqual(port.deleteOperations, ["relationships:mindmap", "tool:mindmap"]);
});

test("built-in seeding uses duplicate-ignoring upsert and preserves mutable fields", async () => {
  const port = new MemoryPort();
  port.tools.push(toolRow({ id: "ap", is_favorite: true, is_pinned: true, use_count: 8 }));

  const snapshot = await getWorkspaceSnapshot(OWNER, port);

  assert.deepEqual(port.toolUpserts[0]?.options, { onConflict: "id", ignoreDuplicates: true });
  const preserved = snapshot.tools.find((tool) => tool.id === "ap");
  assert.equal(preserved?.favorite, true);
  assert.equal(snapshot.pinnedToolIds.includes("ap"), true);
  assert.equal(port.tools.find((row) => row.id === "ap")?.use_count, 8);
});

test("repeating a local migration is idempotent", async () => {
  const port = new MemoryPort();
  const payload = {
    tools: [{
      id: "custom-1", name: "Custom", url: "https://example.com/", description: "",
      mono: "CU", accent: "blue" as const, tags: ["Work"], aliases: ["Docs"],
      favorite: false, sourceType: "external" as const, iconKey: "globe", iconType: "matching" as const,
    }],
    categories: [],
    pinnedToolIds: ["custom-1"],
    favoriteOverrides: { "custom-1": true },
    recentTools: [{ id: "custom-1", openedAt: Date.parse("2026-08-10T03:00:00.000Z") }],
  };

  await migrateLocalWorkspace(OWNER, payload, port);
  await migrateLocalWorkspace(OWNER, payload, port);

  assert.equal(port.tools.filter((row) => row.id === "custom-1").length, 1);
  assert.equal(port.categories.filter((row) => row.name === "Work").length, 1);
  assert.equal(port.relationships.filter((row) => row.tool_id === "custom-1").length, 1);
});

test("migration removes stale relationships so the payload is authoritative", async () => {
  const port = new MemoryPort();
  const base = {
    tools: [{
      id: "custom-1", name: "Custom", url: "https://example.com/", description: "",
      mono: "CU", accent: "blue" as const, tags: ["Work", "AI"], aliases: [],
      favorite: false, sourceType: "external" as const, iconKey: "globe", iconType: "matching" as const,
    }],
    categories: [], pinnedToolIds: [], favoriteOverrides: {}, recentTools: [],
  };
  await migrateLocalWorkspace(OWNER, base, port);
  const changed = { ...base, tools: [{ ...base.tools[0], tags: ["Work"] }] };

  const snapshot = await migrateLocalWorkspace(OWNER, changed, port);

  assert.deepEqual(snapshot.tools.find((tool) => tool.id === "custom-1")?.tags, ["Work"]);
});

test("verifies relationship ownership and compensates when creating relationships fails", async () => {
  const port = new MemoryPort();
  port.categories.push({ id: "owned", owner_email: OWNER, name: "Work", sort_order: 0, created_at: NOW, updated_at: NOW });
  port.categories.push({ id: "foreign", owner_email: "other@example.com", name: "Secret", sort_order: 0, created_at: NOW, updated_at: NOW });
  port.failRelationships = true;

  await assert.rejects(
    () => createWorkspaceTool(OWNER, {
      name: "New Tool", url: "https://example.com", description: "", iconKey: "globe",
      accent: "blue", tags: ["Work"], aliases: [], sourceType: "external",
    }, false, port, "custom-new"),
    /relationship failed/,
  );

  assert.deepEqual(port.deletedToolIds, ["custom-new"]);
  assert.equal(port.ownerQueries.some((query) => query.table === "categories" && query.ownerEmail === OWNER), true);
  assert.equal(port.tools.some((row) => row.id === "custom-new"), false);
});

test("recording recent use increments use_count and updates the timestamp", async () => {
  const port = new MemoryPort();
  port.tools.push(toolRow({ id: "ap", use_count: 4 }));

  await patchWorkspaceTool(OWNER, "ap", { recordUse: true, usedAt: "2026-08-10T04:00:00.000Z" }, port);

  assert.equal(port.tools[0].use_count, 5);
  assert.equal(port.tools[0].last_used_at, "2026-08-10T04:00:00.000Z");
});

test("favorite patches send only RPC-allowlisted fields and leave updated_at to the database", async () => {
  const port = new MemoryPort();
  port.tools.push(toolRow({ id: "no", is_favorite: true }));

  await patchWorkspaceTool(OWNER, "no", { favorite: false }, port);

  assert.deepEqual(port.atomicPatchCalls[0]?.patch, { is_favorite: false });
});

test("creates and patches custom hexadecimal tool colors without changing named accents", async () => {
  const port = new MemoryPort();

  await createWorkspaceTool(OWNER, {
    name: "Custom", url: "https://example.com", description: "", iconKey: "globe",
    accent: "#22D3EE", tags: [], aliases: [], sourceType: "external",
  }, false, port, "custom-color");
  port.tools.push(toolRow({ id: "named-accent", icon_color: "teal" }));

  await patchWorkspaceTool(OWNER, "named-accent", { accent: "#22d3ee" }, port);

  assert.equal(port.tools.find((tool) => tool.id === "custom-color")?.icon_color, "#22D3EE");
  assert.deepEqual(port.atomicPatchCalls.at(-1)?.patch, { icon_color: "#22D3EE" });
});

test("concurrent recent-use updates delegate increments to the atomic database operation", async () => {
  const port = new MemoryPort();
  port.tools.push(toolRow({ id: "ap", use_count: 4 }));

  await Promise.all([
    patchWorkspaceTool(OWNER, "ap", { recordUse: true, usedAt: "2026-08-10T04:00:00.000Z" }, port),
    patchWorkspaceTool(OWNER, "ap", { recordUse: true, usedAt: "2026-08-10T05:00:00.000Z" }, port),
  ]);

  assert.equal(port.tools[0].use_count, 6);
  assert.equal(port.atomicPatchCalls.filter((call) => call.incrementUse).length, 2);
  assert.equal(port.atomicPatchCalls.every((call) => call.ownerEmail === OWNER), true);
});

test("failed tag replacement leaves both tool fields and relationships unchanged", async () => {
  const port = new MemoryPort();
  port.tools.push(toolRow({ id: "ap", name: "Before" }));
  port.categories.push(
    { id: "work", owner_email: OWNER, name: "Work", sort_order: 0, created_at: NOW, updated_at: NOW },
    { id: "ai", owner_email: OWNER, name: "AI", sort_order: 1, created_at: NOW, updated_at: NOW },
  );
  port.relationships.push({ tool_id: "ap", category_id: "work", created_at: NOW });
  port.failAtomicPatch = true;

  await assert.rejects(
    () => patchWorkspaceTool(OWNER, "ap", { name: "After", tags: ["AI"] }, port),
    /atomic patch failed/,
  );

  assert.equal(port.tools[0].name, "Before");
  assert.deepEqual(port.relationships.map((row) => row.category_id), ["work"]);
});

test("rejects owner category duplicates through a case-insensitive lookup", async () => {
  const port = new MemoryPort();
  port.categories.push({ id: "work", owner_email: OWNER, name: "Work", sort_order: 0, created_at: NOW, updated_at: NOW });

  await assert.rejects(() => createWorkspaceCategory(OWNER, " work ", port), /already exists/i);
  assert.equal(port.categories.length, 1);
});
