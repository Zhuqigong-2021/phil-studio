"use client";

import * as React from "react";

import { useCustomTools } from "@/hooks/useCustomTools";
import type { Tool } from "@/lib/dashboard/types";

type Workspace = ReturnType<typeof useCustomTools>;
type DashboardPendingState = Pick<Workspace, "favoritePendingIds" | "loading" | "syncError">;
type DashboardWorkspaceActions = Pick<
  Workspace,
  "addCategory" | "addTool" | "deleteTool" | "refreshTools" | "retrySync" | "setToolFavorite" | "setToolPinned" | "updateTool"
>;

const ToolsContext = React.createContext<Tool[] | null>(null);
const CategoriesContext = React.createContext<string[] | null>(null);
const PinnedToolIdsContext = React.createContext<string[] | null>(null);
const FavoritesContext = React.createContext<Tool[] | null>(null);
const PendingContext = React.createContext<DashboardPendingState | null>(null);
const ActionsContext = React.createContext<DashboardWorkspaceActions | null>(null);
const WorkspaceContext = React.createContext<Workspace | null>(null);

function useRequiredContext<T>(context: React.Context<T | null>, label: string): T {
  const value = React.useContext(context);
  if (value === null) throw new Error(`${label} is unavailable.`);
  return value;
}

export function useDashboardTools() {
  return useRequiredContext(ToolsContext, "Dashboard tools");
}

export function useDashboardCategories() {
  return useRequiredContext(CategoriesContext, "Dashboard categories");
}

export function useDashboardPinnedToolIds() {
  return useRequiredContext(PinnedToolIdsContext, "Dashboard pinned tools");
}

export function useDashboardFavorites() {
  return useRequiredContext(FavoritesContext, "Dashboard favorites");
}

export function useDashboardPendingState() {
  return useRequiredContext(PendingContext, "Dashboard pending state");
}

export function useDashboardWorkspaceActions() {
  return useRequiredContext(ActionsContext, "Dashboard workspace actions");
}

export function useDashboardWorkspace() {
  return useRequiredContext(WorkspaceContext, "Dashboard workspace");
}

export function useDashboardAddToolWorkspace() {
  const categories = useDashboardCategories();
  const { addCategory, addTool } = useDashboardWorkspaceActions();
  return React.useMemo(() => ({ categories, addCategory, addTool }), [addCategory, addTool, categories]);
}

export function DashboardWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const workspace = useCustomTools();
  const favorites = React.useMemo(
    () => workspace.tools.filter((tool) => tool.favorite),
    [workspace.tools],
  );
  const pending = React.useMemo<DashboardPendingState>(() => ({
    favoritePendingIds: workspace.favoritePendingIds,
    loading: workspace.loading,
    syncError: workspace.syncError,
  }), [workspace.favoritePendingIds, workspace.loading, workspace.syncError]);
  const actions = React.useMemo<DashboardWorkspaceActions>(() => ({
    addCategory: workspace.addCategory,
    addTool: workspace.addTool,
    deleteTool: workspace.deleteTool,
    refreshTools: workspace.refreshTools,
    retrySync: workspace.retrySync,
    setToolFavorite: workspace.setToolFavorite,
    setToolPinned: workspace.setToolPinned,
    updateTool: workspace.updateTool,
  }), [
    workspace.addCategory,
    workspace.addTool,
    workspace.deleteTool,
    workspace.refreshTools,
    workspace.retrySync,
    workspace.setToolFavorite,
    workspace.setToolPinned,
    workspace.updateTool,
  ]);

  return (
    <WorkspaceContext.Provider value={workspace}>
    <ActionsContext.Provider value={actions}>
      <PendingContext.Provider value={pending}>
        <FavoritesContext.Provider value={favorites}>
          <PinnedToolIdsContext.Provider value={workspace.pinnedToolIds}>
            <CategoriesContext.Provider value={workspace.categories}>
              <ToolsContext.Provider value={workspace.tools}>
                {children}
              </ToolsContext.Provider>
            </CategoriesContext.Provider>
          </PinnedToolIdsContext.Provider>
        </FavoritesContext.Provider>
      </PendingContext.Provider>
    </ActionsContext.Provider>
    </WorkspaceContext.Provider>
  );
}
