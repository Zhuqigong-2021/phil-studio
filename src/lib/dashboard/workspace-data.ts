import type { Tables } from "../supabase/database.types.ts";
import {
  addCategoryToList,
  createCustomTool,
  type CustomToolDraft,
} from "./custom-tools.ts";
import { normalizeToolColor } from "./tool-library.ts";
import type { IconType, SourceType, Tool, ToolColor } from "./types.ts";

export type ToolRow = Tables<"tools">;

export interface CategoryRecord {
  id: string;
  name: string;
  sortOrder: number;
}

export interface RecentWorkspaceTool {
  id: string;
  openedAt: number;
}

export interface WorkspaceSnapshot {
  tools: Tool[];
  categories: string[];
  pinnedToolIds: string[];
  recentTools: RecentWorkspaceTool[];
}

export interface LocalMigrationPayload {
  tools: Tool[];
  categories: string[];
  pinnedToolIds: string[];
  favoriteOverrides: Record<string, boolean>;
  recentTools: RecentWorkspaceTool[];
}

export interface ToolPatch {
  name?: string;
  url?: string;
  description?: string;
  iconKey?: string;
  accent?: ToolColor;
  tags?: string[];
  aliases?: string[];
  sourceType?: SourceType;
  favorite?: boolean;
  pinned?: boolean;
  visible?: boolean;
  recordUse?: boolean;
  usedAt?: string;
}

const ICON_TYPES = new Set<IconType>(["official", "matching", "monogram"]);
const SOURCE_TYPES = new Set<SourceType>(["internal", "external"]);
const PATCH_KEYS = new Set<keyof ToolPatch>([
  "name", "url", "description", "iconKey", "accent", "tags", "aliases", "sourceType",
  "favorite", "pinned", "visible", "recordUse", "usedAt",
]);

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string") throw new Error(`${label} must be a string.`);
  return value;
}

function stringArray(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    throw new Error(`${label} must be an array of strings.`);
  }
  return value;
}

function normalizedCategories(value: unknown): string[] {
  const inputs = stringArray(value, "Categories");
  let categories: string[] = [];
  for (const input of inputs) {
    categories = addCategoryToList(categories, input).categories;
  }
  return categories;
}

function normalizedTool(value: unknown): Tool {
  const input = requireRecord(value, "Tool");
  const id = requireString(input.id, "Tool id").trim();
  if (!id) throw new Error("Tool id is required.");
  if (!Array.isArray(input.aliases)) throw new Error("Tool aliases must be an array of strings.");

  const accent = normalizeToolColor(requireString(input.accent, "Tool accent"));
  const sourceType = requireString(input.sourceType, "Tool source") as SourceType;
  const iconType = (input.iconType ?? "matching") as IconType;
  if (!ICON_TYPES.has(iconType)) throw new Error("Tool icon type is invalid.");
  const name = requireString(input.name, "Tool name");
  if (name.trim().length > 60) throw new Error("Tool names must be 60 characters or fewer.");
  const description = requireString(input.description ?? "", "Tool description");
  if (description.trim().length > 160) throw new Error("Tool descriptions must be 160 characters or fewer.");

  const draft: CustomToolDraft = {
    name,
    url: requireString(input.url, "Tool URL"),
    description,
    iconKey: requireString(input.iconKey ?? "", "Tool icon key"),
    accent,
    tags: normalizedCategories(input.tags ?? []),
    aliases: stringArray(input.aliases, "Tool aliases"),
    sourceType,
  };
  const tool = createCustomTool(draft, id);
  return {
    ...tool,
    mono: typeof input.mono === "string" && input.mono ? input.mono : tool.mono,
    favorite: typeof input.favorite === "boolean" ? input.favorite : false,
    iconType,
    visible: typeof input.visible === "boolean" ? input.visible : true,
    sortOrder: typeof input.sortOrder === "number" ? input.sortOrder : 0,
  };
}

export function toolRowToTool(row: ToolRow, categoryNames: readonly string[]): Tool {
  const accent = normalizeToolColor(row.icon_color);
  if (!ICON_TYPES.has(row.icon_type as IconType)) throw new Error("Stored tool icon type is invalid.");
  return {
    id: row.id,
    name: row.name,
    ...(row.url ? { url: row.url } : {}),
    description: row.description,
    mono: row.mono,
    accent,
    tags: [...categoryNames],
    favorite: row.is_favorite,
    sourceType: row.source_type as SourceType,
    ...(row.icon_key ? { iconKey: row.icon_key } : {}),
    iconType: row.icon_type as IconType,
    aliases: [...row.aliases],
    checkStatus: row.check_status,
    checkColor: row.check_color,
    ...(row.last_checked_at ? { lastCheckedAt: row.last_checked_at } : {}),
    visible: row.visible,
    sortOrder: row.sort_order,
  };
}

export function buildMigrationPayload(value: unknown): LocalMigrationPayload {
  const input = requireRecord(value, "Migration payload");
  if (!Array.isArray(input.tools)) throw new Error("Tools must be an array.");
  const tools = input.tools.map(normalizedTool);
  const categories = normalizedCategories(input.categories ?? []);
  const pinnedToolIds = [...new Set(stringArray(input.pinnedToolIds ?? [], "Pinned tool ids").filter(Boolean))];
  const favoriteInput = requireRecord(input.favoriteOverrides ?? {}, "Favorite overrides");
  const favoriteOverrides: Record<string, boolean> = {};
  for (const [id, favorite] of Object.entries(favoriteInput)) {
    if (typeof favorite !== "boolean") throw new Error("Favorite overrides must be boolean values.");
    favoriteOverrides[id] = favorite;
  }
  if (!Array.isArray(input.recentTools)) throw new Error("Recent tools must be an array.");
  const recentTools = input.recentTools.map((entry) => {
    const record = requireRecord(entry, "Recent tool");
    const id = requireString(record.id, "Recent tool id");
    if (typeof record.openedAt !== "number" || !Number.isFinite(record.openedAt)) {
      throw new Error("Recent tool openedAt must be a finite number.");
    }
    return { id, openedAt: record.openedAt };
  });
  return { tools, categories, pinnedToolIds, favoriteOverrides, recentTools };
}

export function validateToolPatch(value: unknown): ToolPatch {
  const input = requireRecord(value, "Tool patch");
  for (const key of Object.keys(input)) {
    if (!PATCH_KEYS.has(key as keyof ToolPatch)) throw new Error(`Unknown tool patch key: ${key}.`);
  }
  const patch = { ...input } as ToolPatch;
  if (patch.name !== undefined) {
    if (typeof patch.name !== "string") throw new Error("Tool name must be a string.");
    patch.name = patch.name.trim();
    if (!patch.name) throw new Error("Tool name is required.");
    if (patch.name.length > 60) throw new Error("Tool names must be 60 characters or fewer.");
  }
  if (patch.description !== undefined) {
    if (typeof patch.description !== "string") throw new Error("Tool description must be a string.");
    patch.description = patch.description.trim();
    if (patch.description.length > 160) throw new Error("Tool descriptions must be 160 characters or fewer.");
  }
  if (patch.iconKey !== undefined && typeof patch.iconKey !== "string") {
    throw new Error("Tool icon key must be a string.");
  }
  if (patch.accent !== undefined) {
    if (typeof patch.accent !== "string") throw new Error("Tool accent is invalid.");
    patch.accent = normalizeToolColor(patch.accent);
  }
  if (patch.sourceType !== undefined && (typeof patch.sourceType !== "string" || !SOURCE_TYPES.has(patch.sourceType))) {
    throw new Error("Tool source is invalid.");
  }
  if (patch.aliases !== undefined) {
    if (!Array.isArray(patch.aliases)) throw new Error("Tool aliases must be an array of strings.");
    const sample = normalizedTool({
      id: "validation", name: "Validation", url: "https://example.com", description: "",
      mono: "VA", accent: "blue", tags: patch.tags ?? [], aliases: patch.aliases,
      favorite: false, sourceType: patch.sourceType ?? "external", iconKey: "", iconType: "matching",
    });
    patch.aliases = sample.aliases;
  }
  if (patch.url !== undefined) {
    if (typeof patch.url !== "string") throw new Error("Tool URL must be a string.");
    const sample = normalizedTool({
      id: "validation", name: patch.name ?? "Validation", url: patch.url,
      description: patch.description ?? "", mono: "VA", accent: patch.accent ?? "blue",
      tags: patch.tags ?? [], aliases: patch.aliases ?? [], favorite: false,
      sourceType: patch.sourceType ?? "external", iconKey: patch.iconKey ?? "", iconType: "matching",
    });
    patch.url = sample.url;
  }
  if (patch.tags !== undefined) patch.tags = normalizedCategories(patch.tags);
  for (const key of ["favorite", "pinned", "visible", "recordUse"] as const) {
    if (patch[key] !== undefined && typeof patch[key] !== "boolean") throw new Error(`${key} must be boolean.`);
  }
  if (patch.usedAt !== undefined) {
    if (typeof patch.usedAt !== "string") throw new Error("usedAt must be a string.");
    if (Number.isNaN(Date.parse(patch.usedAt))) throw new Error("usedAt must be a valid date.");
  }
  return patch;
}

export class WorkspaceSyncError extends Error {
  constructor(message = "Workspace synchronization failed.") {
    super(message);
    this.name = "WorkspaceSyncError";
  }
}

async function requestWorkspace<T>(
  input: string,
  init: RequestInit,
  fetcher: typeof fetch,
): Promise<T> {
  let response: Response;
  try {
    response = await fetcher(input, { ...init, cache: "no-store" });
  } catch {
    throw new WorkspaceSyncError();
  }
  if (!response.ok) {
    try {
      const body = await response.json() as { error?: unknown };
      if (typeof body.error === "string" && body.error) throw new WorkspaceSyncError(body.error);
    } catch (error) {
      if (error instanceof WorkspaceSyncError) throw error;
    }
    throw new WorkspaceSyncError();
  }
  if (response.status === 204) return undefined as T;
  try {
    return await response.json() as T;
  } catch {
    throw new WorkspaceSyncError();
  }
}

export function fetchWorkspaceSnapshot(fetcher: typeof fetch = fetch): Promise<WorkspaceSnapshot> {
  return requestWorkspace<WorkspaceSnapshot>("/api/workspace-data", { method: "GET" }, fetcher);
}

export function migrateWorkspaceSnapshot(payload: LocalMigrationPayload, fetcher: typeof fetch = fetch): Promise<WorkspaceSnapshot> {
  return requestWorkspace<WorkspaceSnapshot>("/api/workspace-data/migrate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, fetcher);
}

export async function postWorkspaceTool(draft: CustomToolDraft, pin: boolean, fetcher: typeof fetch = fetch): Promise<Tool> {
  const result = await requestWorkspace<{ tool: Tool }>("/api/tools", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ draft, pin }),
  }, fetcher);
  return result.tool;
}

export async function postWorkspaceCategory(name: string, fetcher: typeof fetch = fetch): Promise<CategoryRecord> {
  const result = await requestWorkspace<{ category: CategoryRecord }>("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  }, fetcher);
  return result.category;
}

export async function patchWorkspaceTool(id: string, patch: ToolPatch, fetcher: typeof fetch = fetch): Promise<Tool> {
  const result = await requestWorkspace<{ tool: Tool }>(`/api/tools/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  }, fetcher);
  return result.tool;
}

export async function deleteWorkspaceToolRequest(id: string, fetcher: typeof fetch = fetch): Promise<void> {
  await requestWorkspace<void>(`/api/tools/${encodeURIComponent(id)}`, { method: "DELETE" }, fetcher);
}
