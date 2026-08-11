import type { ToolPatch } from "./workspace-data.ts";
import type { Accent, Tool, ToolColor } from "./types.ts";

const ACCENTS = new Set<Accent>(["violet", "blue", "pink", "orange", "cyan", "teal", "slate"]);
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export interface ToolRowDraft {
  iconKey: string;
  color: ToolColor;
  name: string;
  description: string;
  tags: string[];
  url: string;
  pinned: boolean;
  favorite: boolean;
  aliases: string[];
}

export function normalizeToolColor(value: string): ToolColor {
  const color = value.trim();
  if (ACCENTS.has(color as Accent)) return color as Accent;
  if (HEX_COLOR.test(color)) return color.toUpperCase() as ToolColor;
  throw new Error("Tool accent color is invalid.");
}

export function parseAliasInput(value: string): string[] {
  const aliases: string[] = [];
  const seen = new Set<string>();
  for (const input of value.split(/[\n,]/)) {
    const alias = input.trim();
    const key = alias.toLocaleLowerCase();
    if (alias && !seen.has(key)) {
      seen.add(key);
      aliases.push(alias);
    }
  }
  return aliases;
}

export function toolToRowDraft(tool: Tool, pinned: boolean): ToolRowDraft {
  return {
    iconKey: tool.iconKey ?? "",
    color: tool.accent,
    name: tool.name,
    description: tool.description ?? "",
    tags: [...tool.tags],
    url: tool.url ?? "",
    pinned,
    favorite: tool.favorite,
    aliases: [...(tool.aliases ?? [])],
  };
}

export function rowDraftToPatch(draft: ToolRowDraft): ToolPatch {
  return {
    iconKey: draft.iconKey,
    accent: normalizeToolColor(draft.color),
    name: draft.name,
    description: draft.description,
    tags: [...draft.tags],
    url: draft.url,
    pinned: draft.pinned,
    favorite: draft.favorite,
    aliases: [...draft.aliases],
  };
}

export function paginateTools<T>(tools: readonly T[], page: number, pageSize: number) {
  const size = Math.max(1, Math.floor(pageSize) || 1);
  const pageCount = Math.max(1, Math.ceil(tools.length / size));
  const currentPage = Math.min(pageCount, Math.max(1, Math.floor(page) || 1));
  const offset = (currentPage - 1) * size;
  const items = tools.slice(offset, offset + size);
  const start = tools.length ? offset + 1 : 0;

  return {
    items,
    page: currentPage,
    pageCount,
    start,
    end: offset + items.length,
    total: tools.length,
  };
}
