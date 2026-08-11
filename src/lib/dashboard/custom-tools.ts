import type { Accent, SourceType, Tool } from "./types.ts";

export const CUSTOM_CATEGORIES_KEY = "phil-studio:custom-categories:v1";
export const CUSTOM_TOOLS_KEY = "phil-studio:custom-tools:v1";
export const PINNED_TOOLS_KEY = "phil-studio:pinned-tools:v1";
export const CUSTOM_TOOLS_CHANGED_EVENT = "phil-studio:custom-tools-changed";

const ACCENTS = new Set<Accent>([
  "violet",
  "blue",
  "pink",
  "orange",
  "cyan",
  "teal",
  "slate",
]);
const SOURCE_TYPES = new Set<SourceType>(["internal", "external"]);

export interface CustomToolDraft {
  name: string;
  url: string;
  description: string;
  iconKey: string;
  accent: Accent;
  tags: string[];
  aliases: string[];
  sourceType: SourceType;
}

export interface AddCategoryResult {
  categories: string[];
  category: string;
}

export function normalizeCategoryName(value: string): string {
  return value.trim();
}

export function mergeCategories(
  defaults: readonly string[],
  custom: readonly string[],
): string[] {
  const seen = new Set<string>();
  return [...defaults, ...custom].reduce<string[]>((result, value) => {
    const normalized = normalizeCategoryName(value);
    const key = normalized.toLocaleLowerCase();
    if (!normalized || seen.has(key)) return result;
    seen.add(key);
    result.push(normalized);
    return result;
  }, []);
}

export function addCategoryToList(
  categories: readonly string[],
  value: string,
): AddCategoryResult {
  const category = normalizeCategoryName(value);
  if (!category) throw new Error("Category name is required.");
  if (category.length > 24) throw new Error("Category names must be 24 characters or fewer.");
  if (categories.some((item) => item.toLocaleLowerCase() === category.toLocaleLowerCase())) {
    throw new Error("That category already exists.");
  }
  return { categories: [...categories, category], category };
}

function parseJsonArray(raw: string | null): unknown[] | null {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

export function parseStoredCategories(raw: string | null): string[] {
  const value = parseJsonArray(raw);
  if (!value || !value.every((item) => typeof item === "string")) return [];
  return mergeCategories([], value);
}

export function parseStoredToolIds(raw: string | null): string[] {
  const value = parseJsonArray(raw);
  if (!value || !value.every((item) => typeof item === "string")) return [];
  return [...new Set(value.filter(Boolean))];
}

function isStoredTool(value: unknown): value is Tool {
  if (!value || typeof value !== "object") return false;
  const tool = value as Partial<Tool>;
  return (
    typeof tool.id === "string" &&
    typeof tool.name === "string" &&
    typeof tool.mono === "string" &&
    typeof tool.accent === "string" &&
    ACCENTS.has(tool.accent as Accent) &&
    Array.isArray(tool.tags) &&
    tool.tags.every((tag) => typeof tag === "string") &&
    typeof tool.favorite === "boolean" &&
    (tool.url === undefined || typeof tool.url === "string") &&
    (tool.aliases === undefined ||
      (Array.isArray(tool.aliases) && tool.aliases.every((alias) => typeof alias === "string")))
  );
}

export function parseStoredTools(raw: string | null): Tool[] {
  const value = parseJsonArray(raw);
  if (!value || !value.every(isStoredTool)) return [];
  return value;
}

function normalizeAliases(aliases: readonly string[]): string[] {
  if (aliases.length > 10) throw new Error("A tool can have at most 10 aliases.");
  const result: string[] = [];
  const seen = new Set<string>();
  for (const input of aliases) {
    const alias = input.trim();
    if (!alias) continue;
    if (alias.length > 32) throw new Error("Aliases must be 32 characters or fewer.");
    const key = alias.toLocaleLowerCase();
    if (seen.has(key)) throw new Error("Duplicate alias names are not allowed.");
    seen.add(key);
    result.push(alias);
  }
  return result;
}

function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = new URL(candidate);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Tool URL must use HTTP or HTTPS.");
  }
  return url.toString();
}

function deriveMono(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toLocaleUpperCase();
  return name.slice(0, 2).toLocaleUpperCase();
}

export function createCustomTool(draft: CustomToolDraft, id: string): Tool {
  const name = draft.name.trim();
  if (!name) throw new Error("Tool name is required.");
  if (!SOURCE_TYPES.has(draft.sourceType)) throw new Error("Tool source is invalid.");
  return {
    id,
    name,
    url: normalizeUrl(draft.url),
    description: draft.description.trim(),
    mono: deriveMono(name),
    accent: draft.accent,
    tags: mergeCategories([], draft.tags),
    aliases: normalizeAliases(draft.aliases),
    favorite: false,
    sourceType: draft.sourceType,
    iconKey: draft.iconKey,
    iconType: "matching",
    checkStatus: "Unknown",
    checkColor: "#7C8698",
  };
}

export function appendCustomTool(tools: readonly Tool[], tool: Tool): Tool[] {
  return [...tools, tool];
}

export function addPinnedToolId(ids: readonly string[], id: string): string[] {
  return ids.includes(id) ? [...ids] : [...ids, id];
}

export function removePinnedToolId(ids: readonly string[], id: string): string[] {
  return ids.filter((value) => value !== id);
}

export function matchesToolQuery(tool: Tool, query: string): boolean {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return true;
  return [tool.name, ...(tool.aliases ?? []), ...tool.tags]
    .join(" ")
    .toLocaleLowerCase()
    .includes(normalized);
}

export function selectPinnedTools<T extends { id: string }>(
  tools: readonly T[],
  pinnedIds: readonly string[],
): T[] {
  const byId = new Map(tools.map((tool) => [tool.id, tool]));
  return [...new Set(pinnedIds)]
    .map((id) => byId.get(id))
    .filter((tool): tool is T => Boolean(tool));
}

export function buildCategoryStats(
  tools: readonly Tool[],
  categories: readonly string[],
): Array<{ tag: string; percent: number }> {
  const counts = new Map<string, number>();
  let total = 0;
  for (const tool of tools) {
    for (const tag of tool.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
      total += 1;
    }
  }
  return categories
    .map((tag) => ({
      tag,
      percent: total ? Math.round(((counts.get(tag) ?? 0) / total) * 100) : 0,
    }))
    .sort((a, b) => b.percent - a.percent);
}
