"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { decorate, isBuiltInToolId } from "@/lib/dashboard/mock-data";
import { openTool } from "@/lib/dashboard/open-tool";
import {
  paginateTools,
  toolToRowDraft,
  type ToolRowDraft,
} from "@/lib/dashboard/tool-library";
import { publishDatabaseToast } from "@/lib/dashboard/tool-mutations";
import type { Tool } from "@/lib/dashboard/types";
import { buildCommandResults, buildToolResults, useShellState } from "./useShellState";
import { useCustomTools } from "./useCustomTools";
import {
  createManageTableState,
  manageTableReducer,
  runManageMutation,
  validateManageDraft,
  type ManagePageSize,
} from "./manage-page-state";

export function useManagePageState() {
  const shell = useShellState();
  const { router, closePalette, query, openAddTool } = shell;
  const {
    tools: rawTools,
    categories,
    pinnedToolIds,
    updateTool,
    deleteTool,
    loading,
    syncError,
  } = useCustomTools();
  const [tableState, dispatch] = useReducer(
    manageTableReducer,
    undefined,
    () => createManageTableState(rawTools, pinnedToolIds),
  );
  const mutationRefreshes = useRef(new Map<string, { phase: "pending" | "succeeded"; original: Tool }>());
  const deletePendingRef = useRef(false);
  const rawToolsRef = useRef(rawTools);
  const pinnedToolIdsRef = useRef(pinnedToolIds);

  useEffect(() => {
    rawToolsRef.current = rawTools;
    pinnedToolIdsRef.current = pinnedToolIds;
    const resetDraftIds = [...mutationRefreshes.current.entries()]
      .filter(([id, mutation]) => mutation.phase === "succeeded"
        && rawTools.find((tool) => tool.id === id) !== mutation.original)
      .map(([id]) => id);
    dispatch({ type: "tools/sync", tools: rawTools, pinnedToolIds, resetDraftIds });
    resetDraftIds.forEach((id) => mutationRefreshes.current.delete(id));
  }, [rawTools, pinnedToolIds]);

  const decoratedTools = useMemo(() => rawTools.map(decorate), [rawTools]);
  const pagination = useMemo(
    () => paginateTools(rawTools, tableState.page, tableState.pageSize),
    [rawTools, tableState.page, tableState.pageSize],
  );
  const pageRows = useMemo(() => {
    const pinned = new Set(pinnedToolIds);
    return pagination.items.map((tool) => ({
      tool: decorate(tool),
      draft: tableState.drafts[tool.id] ?? toolToRowDraft(tool, pinned.has(tool.id)),
      aliasInput: tableState.aliasInputs[tool.id] ?? (tool.aliases ?? []).join(", "),
      error: tableState.rowErrors[tool.id] ?? null,
    }));
  }, [pagination.items, pinnedToolIds, tableState.aliasInputs, tableState.drafts, tableState.rowErrors]);

  const updateDraft = useCallback((id: string, partial: Partial<ToolRowDraft>) => {
    dispatch({ type: "draft/change", id, partial });
  }, []);
  const updateAliasInput = useCallback((id: string, value: string) => {
    dispatch({ type: "alias/change", id, value });
  }, []);

  const submitRow = useCallback(async (id: string) => {
    if (tableState.updatingIds.includes(id) || mutationRefreshes.current.has(id)) return;
    const draft = tableState.drafts[id];
    const tool = rawTools.find((item) => item.id === id);
    if (!draft || !tool) return;
    let patch: ReturnType<typeof validateManageDraft>;
    try {
      patch = validateManageDraft(draft, tableState.aliasInputs[id] ?? "", categories);
    } catch (error) {
      dispatch({
        type: "validation/failed",
        id,
        message: error instanceof Error ? error.message : "Please check this row and try again.",
      });
      return;
    }

    dispatch({ type: "update/start", id });
    mutationRefreshes.current.set(id, { phase: "pending", original: tool });
    const result = await runManageMutation({
      action: "updated",
      toolName: tool.name,
      mutate: () => updateTool(id, patch),
      publish: publishDatabaseToast,
    });
    if (result.succeeded) {
      const mutation = mutationRefreshes.current.get(id);
      if (!mutation) return;
      mutation.phase = "succeeded";
      if (rawToolsRef.current.find((item) => item.id === id) !== mutation.original) {
        dispatch({
          type: "tools/sync",
          tools: rawToolsRef.current,
          pinnedToolIds: pinnedToolIdsRef.current,
          resetDraftIds: [id],
        });
        mutationRefreshes.current.delete(id);
      }
    } else {
      mutationRefreshes.current.delete(id);
      dispatch({ type: "update/failed", id });
    }
  }, [categories, rawTools, tableState.aliasInputs, tableState.drafts, tableState.updatingIds, updateTool]);

  const requestDelete = useCallback((id: string) => {
    if (isBuiltInToolId(id)) return;
    dispatch({ type: "delete/request", id });
  }, []);
  const cancelDelete = useCallback(() => {
    dispatch({ type: "delete/cancel" });
  }, []);
  const confirmDelete = useCallback(async () => {
    const id = tableState.deleteTargetId;
    const tool = id ? rawTools.find((item) => item.id === id) : undefined;
    if (!id || !tool || tableState.deleting || deletePendingRef.current) return;

    deletePendingRef.current = true;
    dispatch({ type: "delete/start" });
    const result = await runManageMutation({
      action: "deleted",
      toolName: tool.name,
      mutate: () => deleteTool(id),
      publish: publishDatabaseToast,
    });
    deletePendingRef.current = false;
    dispatch({ type: result.succeeded ? "delete/succeeded" : "delete/failed" });
  }, [deleteTool, rawTools, tableState.deleteTargetId, tableState.deleting]);

  const setPage = useCallback((page: number) => {
    dispatch({ type: "page/set", page });
  }, []);
  const setPageSize = useCallback((pageSize: ManagePageSize) => {
    dispatch({ type: "page-size/set", pageSize });
  }, []);

  const q = query.trim().toLowerCase();
  const toolResults = useMemo(
    () => buildToolResults(decoratedTools, q, (tool) => {
      openTool(tool.id, tool.url);
      closePalette();
    }),
    [decoratedTools, q, closePalette],
  );
  const commandResults = useMemo(
    () => buildCommandResults(q, closePalette, router, openAddTool),
    [q, closePalette, router, openAddTool],
  );
  const deleteTarget = tableState.deleteTargetId
    ? rawTools.find((tool) => tool.id === tableState.deleteTargetId) ?? null
    : null;

  return {
    ...shell,
    toolResults,
    commandResults,
    categories,
    pageRows,
    pagination,
    pageSize: tableState.pageSize,
    updatingIds: tableState.updatingIds,
    deleteTarget,
    deleting: tableState.deleting,
    loading,
    syncError,
    updateDraft,
    updateAliasInput,
    submitRow,
    requestDelete,
    cancelDelete,
    confirmDelete,
    setPage,
    setPageSize,
  };
}

export type ManagePageState = ReturnType<typeof useManagePageState>;
