import {
  paginateTools,
  rowDraftToPatch,
  toolToRowDraft,
  type ToolRowDraft,
} from "../lib/dashboard/tool-library.ts";
import type { Tool } from "../lib/dashboard/types.ts";
import { validateToolPatch, type ToolPatch } from "../lib/dashboard/workspace-data.ts";
import {
  databaseErrorMessage,
  databaseRefreshWarningMessage,
  databaseSuccessMessage,
  type DatabaseToastTone,
} from "../lib/dashboard/tool-mutations.ts";
import type { WorkspaceMutationOutcome } from "./useCustomTools.ts";

export type ManagePageSize = 10 | 20 | 50;

export interface ManageTableState {
  drafts: Record<string, ToolRowDraft>;
  aliasInputs: Record<string, string>;
  dirtyIds: string[];
  rowErrors: Record<string, string>;
  updatingIds: string[];
  deleteTargetId: string | null;
  deleting: boolean;
  page: number;
  pageSize: ManagePageSize;
}

export type ManageTableAction =
  | { type: "draft/change"; id: string; partial: Partial<ToolRowDraft> }
  | { type: "alias/change"; id: string; value: string }
  | { type: "tools/sync"; tools: Tool[]; pinnedToolIds: string[]; resetDraftIds: string[] }
  | { type: "update/start"; id: string }
  | { type: "update/succeeded"; id: string }
  | { type: "update/failed"; id: string }
  | { type: "validation/failed"; id: string; message: string }
  | { type: "delete/request"; id: string }
  | { type: "delete/cancel" }
  | { type: "delete/start" }
  | { type: "delete/failed" }
  | { type: "delete/succeeded" }
  | { type: "page/set"; page: number }
  | { type: "page-size/set"; pageSize: ManagePageSize };

function sourceDrafts(tools: readonly Tool[], pinnedToolIds: readonly string[]) {
  const pinned = new Set(pinnedToolIds);
  return Object.fromEntries(tools.map((tool) => [tool.id, toolToRowDraft(tool, pinned.has(tool.id))]));
}

function sourceAliasInputs(tools: readonly Tool[]) {
  return Object.fromEntries(tools.map((tool) => [tool.id, (tool.aliases ?? []).join(", ")]));
}

function addId(ids: readonly string[], id: string) {
  return ids.includes(id) ? [...ids] : [...ids, id];
}

function clearRowError(errors: Record<string, string>, id: string) {
  if (!(id in errors)) return errors;
  const next = { ...errors };
  delete next[id];
  return next;
}

export function createManageTableState(
  tools: readonly Tool[],
  pinnedToolIds: readonly string[],
): ManageTableState {
  return {
    drafts: sourceDrafts(tools, pinnedToolIds),
    aliasInputs: sourceAliasInputs(tools),
    dirtyIds: [],
    rowErrors: {},
    updatingIds: [],
    deleteTargetId: null,
    deleting: false,
    page: 1,
    pageSize: 10,
  };
}

export function manageTableReducer(
  state: ManageTableState,
  action: ManageTableAction,
): ManageTableState {
  if (action.type === "draft/change") {
    const draft = state.drafts[action.id];
    if (!draft) return state;
    return {
      ...state,
      drafts: {
        ...state.drafts,
        [action.id]: { ...draft, ...action.partial },
      },
      dirtyIds: addId(state.dirtyIds, action.id),
      rowErrors: clearRowError(state.rowErrors, action.id),
    };
  }

  if (action.type === "alias/change") {
    const draft = state.drafts[action.id];
    if (!draft) return state;
    return {
      ...state,
      drafts: {
        ...state.drafts,
        [action.id]: { ...draft, aliases: parseManageAliasInput(action.value) },
      },
      aliasInputs: { ...state.aliasInputs, [action.id]: action.value },
      dirtyIds: addId(state.dirtyIds, action.id),
      rowErrors: clearRowError(state.rowErrors, action.id),
    };
  }

  if (action.type === "tools/sync") {
    const freshDrafts = sourceDrafts(action.tools, action.pinnedToolIds);
    const freshAliasInputs = sourceAliasInputs(action.tools);
    const resetIds = new Set(action.resetDraftIds);
    const dirtyIds = new Set(state.dirtyIds);
    const drafts = Object.fromEntries(action.tools.map((tool) => [
      tool.id,
      !dirtyIds.has(tool.id) || resetIds.has(tool.id) || !state.drafts[tool.id]
        ? freshDrafts[tool.id]
        : state.drafts[tool.id],
    ]));
    const aliasInputs = Object.fromEntries(action.tools.map((tool) => [
      tool.id,
      !dirtyIds.has(tool.id) || resetIds.has(tool.id) || !(tool.id in state.aliasInputs)
        ? freshAliasInputs[tool.id]
        : state.aliasInputs[tool.id],
    ]));
    const toolIds = new Set(action.tools.map((tool) => tool.id));
    return {
      ...state,
      drafts,
      aliasInputs,
      dirtyIds: state.dirtyIds.filter((id) => toolIds.has(id) && !resetIds.has(id)),
      rowErrors: Object.fromEntries(Object.entries(state.rowErrors).filter(([id]) => toolIds.has(id) && !resetIds.has(id))),
      updatingIds: state.updatingIds.filter((id) => !resetIds.has(id)),
      page: paginateTools(action.tools, state.page, state.pageSize).page,
    };
  }

  if (action.type === "update/start") {
    if (state.updatingIds.includes(action.id)) return state;
    return { ...state, updatingIds: [...state.updatingIds, action.id] };
  }

  if (action.type === "update/succeeded") {
    return {
      ...state,
      dirtyIds: state.dirtyIds.filter((id) => id !== action.id),
      updatingIds: state.updatingIds.filter((id) => id !== action.id),
      rowErrors: clearRowError(state.rowErrors, action.id),
    };
  }

  if (action.type === "update/failed") {
    return { ...state, updatingIds: state.updatingIds.filter((id) => id !== action.id) };
  }

  if (action.type === "validation/failed") {
    return { ...state, rowErrors: { ...state.rowErrors, [action.id]: action.message } };
  }

  if (action.type === "delete/request") {
    return state.deleting ? state : { ...state, deleteTargetId: action.id };
  }

  if (action.type === "delete/cancel") {
    return state.deleting ? state : { ...state, deleteTargetId: null };
  }

  if (action.type === "delete/start") {
    return state.deleteTargetId ? { ...state, deleting: true } : state;
  }

  if (action.type === "delete/failed") {
    return { ...state, deleting: false };
  }

  if (action.type === "delete/succeeded") {
    return { ...state, deleteTargetId: null, deleting: false };
  }

  if (action.type === "page/set") {
    return { ...state, page: Math.max(1, Math.floor(action.page) || 1) };
  }

  return { ...state, page: 1, pageSize: action.pageSize };
}

export function parseManageAliasInput(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((alias) => alias.trim())
    .filter(Boolean);
}

export function validateManageDraft(
  draft: ToolRowDraft,
  aliasInput: string,
  availableCategories: readonly string[],
): ToolPatch {
  const categoryNames = new Map(availableCategories.map((category) => [category.toLocaleLowerCase(), category]));
  const categories = draft.tags.map((category) => {
    const canonical = categoryNames.get(category.toLocaleLowerCase());
    if (!canonical) throw new Error(`Category "${category}" must be selected from the Tool Library.`);
    return canonical;
  });
  const aliases = parseManageAliasInput(aliasInput);
  const seen = new Set<string>();
  for (const alias of aliases) {
    const key = alias.toLocaleLowerCase();
    if (seen.has(key)) throw new Error(`Duplicate alias "${alias}" is not allowed.`);
    seen.add(key);
  }

  try {
    return validateToolPatch(rowDraftToPatch({ ...draft, tags: categories, aliases }));
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    if (/url|invalid url/i.test(error.message)) throw new Error(`Link: ${error.message}`);
    throw error;
  }
}

export function isManagePopoverOpen(open: boolean, disabled: boolean): boolean {
  return open && !disabled;
}

interface ManageMutationOptions {
  action: "updated" | "deleted";
  toolName: string;
  mutate(): Promise<WorkspaceMutationOutcome>;
  publish(toast: { tone: DatabaseToastTone; message: string }): void;
}

export async function runManageMutation({
  action,
  toolName,
  mutate,
  publish,
}: ManageMutationOptions): Promise<{ succeeded: boolean; workspaceRefreshFailed: boolean }> {
  try {
    const result = await mutate();
    publish(result.workspaceRefreshFailed
      ? { tone: "info", message: databaseRefreshWarningMessage(action, toolName) }
      : { tone: "success", message: databaseSuccessMessage(action, toolName) });
    return { succeeded: true, workspaceRefreshFailed: result.workspaceRefreshFailed };
  } catch (error) {
    publish({
      tone: "error",
      message: databaseErrorMessage(error, action === "updated" ? "update" : "delete", toolName),
    });
    return { succeeded: false, workspaceRefreshFailed: false };
  }
}
