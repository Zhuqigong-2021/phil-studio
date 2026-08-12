import type { Tables, TablesInsert, TablesUpdate } from "../supabase/database.types.ts";
import { addCategoryToList, createCustomTool, type CustomToolDraft } from "./custom-tools.ts";
import { isBuiltInToolId, TAGS, TOOLS_RAW } from "./mock-data.ts";
import {
  buildMigrationPayload,
  toolRowToTool,
  validateToolPatch,
  type CategoryRecord,
  type LocalMigrationPayload,
  type ToolPatch,
  type WorkspaceSnapshot,
} from "./workspace-data.ts";
import type { Tool } from "./types.ts";

type ToolRow = Tables<"tools">;
type CategoryRow = Tables<"categories">;
type RelationshipRow = Tables<"tool_categories">;

interface UpsertOptions {
  onConflict: "id";
  ignoreDuplicates: boolean;
}

export interface WorkspaceDatabasePort {
  listTools(ownerEmail: string): Promise<ToolRow[]>;
  listCategories(ownerEmail: string): Promise<CategoryRow[]>;
  listRelationships(toolIds: readonly string[], categoryIds: readonly string[]): Promise<RelationshipRow[]>;
  upsertTools(rows: TablesInsert<"tools">[], options: UpsertOptions): Promise<void>;
  findCategory(ownerEmail: string, name: string): Promise<CategoryRow | null>;
  insertCategory(row: TablesInsert<"categories">): Promise<CategoryRow>;
  findTool(ownerEmail: string, id: string): Promise<ToolRow | null>;
  insertTool(row: TablesInsert<"tools">): Promise<ToolRow>;
  updateTool(ownerEmail: string, id: string, patch: TablesUpdate<"tools">): Promise<ToolRow | null>;
  deleteTool(ownerEmail: string, id: string): Promise<boolean>;
  upsertRelationships(rows: Array<{ tool_id: string; category_id: string }>): Promise<void>;
  patchToolAtomic(
    ownerEmail: string,
    id: string,
    patch: TablesUpdate<"tools">,
    categoryIds: readonly string[] | null,
    incrementUse: boolean,
    usedAt: string | null,
  ): Promise<ToolRow | null>;
}

function throwOnError(error: { message: string } | null): void {
  if (error) throw new Error("Workspace database operation failed.", { cause: error });
}

async function createSupabasePort(): Promise<WorkspaceDatabasePort> {
  const { getSupabaseServerClient } = await import("../supabase/server.ts");
  const client = getSupabaseServerClient();
  return {
    async listTools(ownerEmail) {
      const { data, error } = await client.from("tools").select("*").eq("owner_email", ownerEmail).order("sort_order");
      throwOnError(error);
      return data ?? [];
    },
    async listCategories(ownerEmail) {
      const { data, error } = await client.from("categories").select("*").eq("owner_email", ownerEmail).order("sort_order");
      throwOnError(error);
      return data ?? [];
    },
    async listRelationships(toolIds, categoryIds) {
      if (!toolIds.length || !categoryIds.length) return [];
      const { data, error } = await client.from("tool_categories").select("*").in("tool_id", [...toolIds]).in("category_id", [...categoryIds]);
      throwOnError(error);
      return data ?? [];
    },
    async upsertTools(rows, options) {
      const { error } = await client.from("tools").upsert(rows, options);
      throwOnError(error);
    },
    async findCategory(ownerEmail, name) {
      const { data, error } = await client.from("categories").select("*").eq("owner_email", ownerEmail).ilike("name", name).maybeSingle();
      throwOnError(error);
      return data;
    },
    async insertCategory(row) {
      const { data, error } = await client.from("categories").insert(row).select("*").single();
      throwOnError(error);
      if (!data) throw new Error("Workspace database operation failed.");
      return data;
    },
    async findTool(ownerEmail, id) {
      const { data, error } = await client.from("tools").select("*").eq("owner_email", ownerEmail).eq("id", id).maybeSingle();
      throwOnError(error);
      return data;
    },
    async insertTool(row) {
      const { data, error } = await client.from("tools").insert(row).select("*").single();
      throwOnError(error);
      if (!data) throw new Error("Workspace database operation failed.");
      return data;
    },
    async updateTool(ownerEmail, id, patch) {
      const { data, error } = await client.from("tools").update(patch).eq("owner_email", ownerEmail).eq("id", id).select("*").maybeSingle();
      throwOnError(error);
      return data;
    },
    async deleteTool(ownerEmail, id) {
      const { data, error } = await client.from("tools").delete()
        .eq("owner_email", ownerEmail)
        .eq("id", id)
        .select("id")
        .maybeSingle();
      throwOnError(error);
      return Boolean(data);
    },
    async upsertRelationships(rows) {
      if (!rows.length) return;
      const { error } = await client.from("tool_categories").upsert(rows, { onConflict: "tool_id,category_id", ignoreDuplicates: true });
      throwOnError(error);
    },
    async patchToolAtomic(ownerEmail, id, patch, categoryIds, incrementUse, usedAt) {
      type AtomicPatchRpc = {
        rpc(
          name: "patch_workspace_tool",
          args: {
            p_owner_email: string;
            p_tool_id: string;
            p_patch: TablesUpdate<"tools">;
            p_category_ids: readonly string[] | null;
            p_increment_use: boolean;
            p_used_at: string | null;
          },
        ): PromiseLike<{ data: ToolRow | null; error: { message: string } | null }>;
      };
      const { data, error } = await (client as unknown as AtomicPatchRpc).rpc("patch_workspace_tool", {
        p_owner_email: ownerEmail,
        p_tool_id: id,
        p_patch: patch,
        p_category_ids: categoryIds,
        p_increment_use: incrementUse,
        p_used_at: usedAt,
      });
      throwOnError(error);
      return data;
    },
  };
}

async function resolvePort(port?: WorkspaceDatabasePort): Promise<WorkspaceDatabasePort> {
  return port ?? createSupabasePort();
}

export class WorkspaceToolNotFoundError extends Error {
  constructor(id: string) {
    super(`Tool was not found: ${id}.`);
    this.name = "WorkspaceToolNotFoundError";
  }
}

export class WorkspaceToolProtectedError extends Error {
  constructor(id: string) {
    super(`Built-in tools cannot be deleted: ${id}.`);
    this.name = "WorkspaceToolProtectedError";
  }
}

function toolInsert(ownerEmail: string, tool: Tool, mutable: Partial<TablesInsert<"tools">> = {}): TablesInsert<"tools"> {
  return {
    id: tool.id,
    owner_email: ownerEmail,
    name: tool.name,
    url: tool.url ?? null,
    description: tool.description ?? "",
    mono: tool.mono,
    icon_key: tool.iconKey ?? null,
    icon_type: tool.iconType ?? (tool.iconKey ? "matching" : "monogram"),
    icon_color: tool.accent,
    aliases: tool.aliases ?? [],
    source_type: tool.sourceType ?? "internal",
    is_favorite: tool.favorite,
    check_status: tool.checkStatus ?? "Unknown",
    check_color: tool.checkColor ?? "#7C8698",
    last_checked_at: tool.lastCheckedAt ?? null,
    visible: tool.visible ?? true,
    sort_order: tool.sortOrder ?? 0,
    ...mutable,
  };
}

async function findOrCreateCategory(database: WorkspaceDatabasePort, ownerEmail: string, name: string, sortOrder = 0): Promise<CategoryRow> {
  const existing = await database.findCategory(ownerEmail, name);
  if (existing) return existing;
  return database.insertCategory({ owner_email: ownerEmail, name, sort_order: sortOrder });
}

async function verifyOwnedRelationships(database: WorkspaceDatabasePort, ownerEmail: string, toolId: string, categoryNames: readonly string[]): Promise<CategoryRow[]> {
  const tool = await database.findTool(ownerEmail, toolId);
  if (!tool) throw new Error("Tool was not found for this owner.");
  const categories: CategoryRow[] = [];
  for (const name of categoryNames) {
    const category = await database.findCategory(ownerEmail, name);
    if (!category) throw new Error(`Category was not found: ${name}.`);
    categories.push(category);
  }
  return categories;
}

async function seedBuiltIns(ownerEmail: string, database: WorkspaceDatabasePort): Promise<void> {
  await database.upsertTools(
    TOOLS_RAW.map((tool, sortOrder) => toolInsert(ownerEmail, tool, { sort_order: sortOrder })),
    { onConflict: "id", ignoreDuplicates: true },
  );
  const categories = new Map<string, CategoryRow>();
  for (const [sortOrder, name] of TAGS.entries()) {
    const category = await findOrCreateCategory(database, ownerEmail, name, sortOrder);
    categories.set(category.name.toLocaleLowerCase(), category);
  }
  const relationships = TOOLS_RAW.flatMap((tool) => tool.tags.map((name) => ({
    tool_id: tool.id,
    category_id: categories.get(name.toLocaleLowerCase())!.id,
  })));
  await database.upsertRelationships(relationships);
}

function snapshotFromRows(tools: ToolRow[], categories: CategoryRow[], relationships: RelationshipRow[]): WorkspaceSnapshot {
  const categoryById = new Map(categories.map((category) => [category.id, category.name]));
  const tagsByTool = new Map<string, string[]>();
  for (const relationship of relationships) {
    const name = categoryById.get(relationship.category_id);
    if (!name) continue;
    tagsByTool.set(relationship.tool_id, [...(tagsByTool.get(relationship.tool_id) ?? []), name]);
  }
  return {
    tools: tools.map((row) => toolRowToTool(row, tagsByTool.get(row.id) ?? [])),
    categories: categories.map((category) => category.name),
    pinnedToolIds: tools.filter((row) => row.is_pinned).map((row) => row.id),
    recentTools: tools
      .filter((row) => row.last_used_at)
      .sort((a, b) => Date.parse(b.last_used_at!) - Date.parse(a.last_used_at!))
      .map((row) => ({ id: row.id, openedAt: Date.parse(row.last_used_at!) })),
  };
}

export async function getWorkspaceSnapshot(ownerEmail: string, port?: WorkspaceDatabasePort): Promise<WorkspaceSnapshot> {
  const database = await resolvePort(port);
  await seedBuiltIns(ownerEmail, database);
  const [tools, categories] = await Promise.all([
    database.listTools(ownerEmail),
    database.listCategories(ownerEmail),
  ]);
  const relationships = await database.listRelationships(tools.map((tool) => tool.id), categories.map((category) => category.id));
  return snapshotFromRows(tools, categories, relationships);
}

export async function migrateLocalWorkspace(ownerEmail: string, input: LocalMigrationPayload, port?: WorkspaceDatabasePort): Promise<WorkspaceSnapshot> {
  const database = await resolvePort(port);
  const payload = buildMigrationPayload(input);
  await seedBuiltIns(ownerEmail, database);
  for (const [sortOrder, name] of payload.categories.entries()) {
    await findOrCreateCategory(database, ownerEmail, name, sortOrder);
  }
  const recentById = new Map(payload.recentTools.map((entry) => [entry.id, entry.openedAt]));
  const rows = payload.tools.map((tool) => toolInsert(ownerEmail, tool, {
    is_favorite: payload.favoriteOverrides[tool.id] ?? tool.favorite,
    is_pinned: payload.pinnedToolIds.includes(tool.id),
    last_used_at: recentById.has(tool.id) ? new Date(recentById.get(tool.id)!).toISOString() : null,
    use_count: recentById.has(tool.id) ? 1 : 0,
  }));
  await database.upsertTools(rows, { onConflict: "id", ignoreDuplicates: false });
  for (const tool of payload.tools) {
    const ownedCategories = await verifyOwnedRelationships(database, ownerEmail, tool.id, tool.tags);
    await database.patchToolAtomic(
      ownerEmail,
      tool.id,
      {},
      ownedCategories.map((category) => category.id),
      false,
      null,
    );
  }
  return getWorkspaceSnapshot(ownerEmail, database);
}

export async function createWorkspaceTool(
  ownerEmail: string,
  draft: CustomToolDraft,
  pin: boolean,
  port?: WorkspaceDatabasePort,
  id = crypto.randomUUID(),
): Promise<Tool> {
  const database = await resolvePort(port);
  const tool = createCustomTool(draft, id);
  await database.insertTool(toolInsert(ownerEmail, tool, { is_pinned: pin }));
  try {
    const categories = await verifyOwnedRelationships(database, ownerEmail, id, tool.tags);
    await database.upsertRelationships(categories.map((category) => ({ tool_id: id, category_id: category.id })));
    return toolRowToTool((await database.findTool(ownerEmail, id))!, categories.map((category) => category.name));
  } catch (error) {
    await database.deleteTool(ownerEmail, id);
    throw error;
  }
}

export async function deleteWorkspaceTool(
  ownerEmail: string,
  id: string,
  port?: WorkspaceDatabasePort,
): Promise<void> {
  if (isBuiltInToolId(id)) throw new WorkspaceToolProtectedError(id);
  const database = await resolvePort(port);
  const deleted = await database.deleteTool(ownerEmail, id);
  if (!deleted) throw new WorkspaceToolNotFoundError(id);
}

export async function patchWorkspaceTool(ownerEmail: string, id: string, input: ToolPatch, port?: WorkspaceDatabasePort): Promise<Tool> {
  const database = await resolvePort(port);
  const patch = validateToolPatch(input);
  const update: TablesUpdate<"tools"> = {};
  if (patch.name !== undefined) update.name = patch.name.trim();
  if (patch.url !== undefined) update.url = patch.url;
  if (patch.description !== undefined) update.description = patch.description.trim();
  if (patch.iconKey !== undefined) update.icon_key = patch.iconKey;
  if (patch.accent !== undefined) update.icon_color = patch.accent;
  if (patch.aliases !== undefined) update.aliases = patch.aliases;
  if (patch.sourceType !== undefined) update.source_type = patch.sourceType;
  if (patch.favorite !== undefined) update.is_favorite = patch.favorite;
  if (patch.pinned !== undefined) update.is_pinned = patch.pinned;
  if (patch.visible !== undefined) update.visible = patch.visible;
  let categories: CategoryRow[] | null = null;
  if (patch.tags !== undefined) {
    categories = await verifyOwnedRelationships(database, ownerEmail, id, patch.tags);
  }
  const usedAt = patch.recordUse ? (patch.usedAt ?? new Date().toISOString()) : null;
  const updated = await database.patchToolAtomic(
    ownerEmail,
    id,
    update,
    categories?.map((category) => category.id) ?? null,
    patch.recordUse === true,
    usedAt,
  );
  if (!updated) throw new Error("Tool was not found for this owner.");
  let categoryNames: string[] = [];
  if (categories) {
    categoryNames = categories.map((category) => category.name);
  } else {
    const categories = await database.listCategories(ownerEmail);
    const relationships = await database.listRelationships([id], categories.map((category) => category.id));
    const byId = new Map(categories.map((category) => [category.id, category.name]));
    categoryNames = relationships.flatMap((relationship) => byId.get(relationship.category_id) ?? []);
  }
  return toolRowToTool(updated, categoryNames);
}

export async function createWorkspaceCategory(ownerEmail: string, name: string, port?: WorkspaceDatabasePort): Promise<CategoryRecord> {
  const database = await resolvePort(port);
  const normalized = addCategoryToList([], name).category;
  if (await database.findCategory(ownerEmail, normalized)) throw new Error("That category already exists.");
  const row = await database.insertCategory({ owner_email: ownerEmail, name: normalized });
  return { id: row.id, name: row.name, sortOrder: row.sort_order };
}
