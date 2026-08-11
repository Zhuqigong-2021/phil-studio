import {
  paginateTools,
  toolToRowDraft,
  type ToolRowDraft,
} from "../lib/dashboard/tool-library.ts";
import type { Tool } from "../lib/dashboard/types.ts";
import {
  databaseErrorMessage,
  databaseSuccessMessage,
  type DatabaseToastTone,
} from "../lib/dashboard/tool-mutations.ts";

export type ManagePageSize = 10 | 20 | 50;

export interface ManageTableState {
  drafts: Record<string, ToolRowDraft>;
  updatingIds: string[];
  deleteTargetId: string | null;
  deleting: boolean;
  page: number;
  pageSize: ManagePageSize;
}

export type ManageTableAction =
  | { type: "draft/change"; id: string; partial: Partial<ToolRowDraft> }
  | { type: "tools/sync"; tools: Tool[]; pinnedToolIds: string[]; resetDraftIds: string[] }
  | { type: "update/start"; id: string }
  | { type: "update/failed"; id: string }
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

export function createManageTableState(
  tools: readonly Tool[],
  pinnedToolIds: readonly string[],
): ManageTableState {
  return {
    drafts: sourceDrafts(tools, pinnedToolIds),
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
    };
  }

  if (action.type === "tools/sync") {
    const freshDrafts = sourceDrafts(action.tools, action.pinnedToolIds);
    const resetIds = new Set(action.resetDraftIds);
    const drafts = Object.fromEntries(action.tools.map((tool) => [
      tool.id,
      resetIds.has(tool.id) || !state.drafts[tool.id]
        ? freshDrafts[tool.id]
        : state.drafts[tool.id],
    ]));
    return {
      ...state,
      drafts,
      updatingIds: state.updatingIds.filter((id) => !resetIds.has(id)),
      page: paginateTools(action.tools, state.page, state.pageSize).page,
    };
  }

  if (action.type === "update/start") {
    if (state.updatingIds.includes(action.id)) return state;
    return { ...state, updatingIds: [...state.updatingIds, action.id] };
  }

  if (action.type === "update/failed") {
    return { ...state, updatingIds: state.updatingIds.filter((id) => id !== action.id) };
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

interface ManageMutationOptions {
  action: "updated" | "deleted";
  toolName: string;
  mutate(): Promise<void>;
  publish(toast: { tone: DatabaseToastTone; message: string }): void;
}

export async function runManageMutation({
  action,
  toolName,
  mutate,
  publish,
}: ManageMutationOptions): Promise<boolean> {
  try {
    await mutate();
    publish({ tone: "success", message: databaseSuccessMessage(action, toolName) });
    return true;
  } catch (error) {
    publish({
      tone: "error",
      message: databaseErrorMessage(error, action === "updated" ? "update" : "delete", toolName),
    });
    return false;
  }
}
