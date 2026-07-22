"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { DecoratedTool } from "@/lib/dashboard/types";
import { signOutFromApp } from "@/lib/auth/actions";

export interface ToolResult extends DecoratedTool {
  select: () => void;
}

export interface CommandResult {
  name: string;
  select: () => void;
}

export interface ShellState {
  collapsed: boolean;
  toggleSidebar: () => void;
  sidebarWidth: number;
  showLabels: boolean;
  mobileOpen: boolean;
  toggleMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  profileMenuOpen: boolean;
  toggleProfileMenu: () => void;
  closeProfileMenu: () => void;
  goLogout: () => void;
  paletteOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
  query: string;
  setQuery: (q: string) => void;
  paletteInputRef: React.RefObject<HTMLInputElement | null>;
  onPaletteKeyDown: (e: React.KeyboardEvent) => void;
  toolResults: ToolResult[];
  commandResults: CommandResult[];
  addToolOpen: boolean;
  openAddTool: () => void;
  closeAddTool: () => void;
}

export const NAV_COMMANDS: { name: string; href: string }[] = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "All", href: "/all" },
  { name: "Favs", href: "/favs" },
  { name: "Recent", href: "/recent" },
  { name: "Manage", href: "/manage" },
];

export function useShellState() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [addToolOpen, setAddToolOpen] = useState(false);
  const paletteInputRef = useRef<HTMLInputElement>(null);

  const openPalette = useCallback(() => {
    setPaletteOpen(true);
    setQuery("");
    setTimeout(() => paletteInputRef.current?.focus(), 30);
  }, []);
  const closePalette = useCallback(() => {
    setPaletteOpen(false);
    setQuery("");
  }, []);
  const onPaletteKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") closePalette();
    },
    [closePalette],
  );

  const toggleSidebar = useCallback(() => setCollapsed((c) => !c), []);
  const toggleMobileDrawer = useCallback(() => setMobileOpen((o) => !o), []);
  const closeMobileDrawer = useCallback(() => setMobileOpen(false), []);
  const toggleProfileMenu = useCallback(() => setProfileMenuOpen((o) => !o), []);
  const closeProfileMenu = useCallback(() => setProfileMenuOpen(false), []);
  const goLogout = useCallback(() => {
    void signOutFromApp();
  }, []);
  const openAddTool = useCallback(() => setAddToolOpen(true), []);
  const closeAddTool = useCallback(() => setAddToolOpen(false), []);

  const showLabels = !collapsed || mobileOpen;
  const sidebarWidth = collapsed ? 72 : 220;

  return {
    router,
    collapsed,
    toggleSidebar,
    sidebarWidth,
    showLabels,
    mobileOpen,
    toggleMobileDrawer,
    closeMobileDrawer,
    profileMenuOpen,
    toggleProfileMenu,
    closeProfileMenu,
    goLogout,
    paletteOpen,
    openPalette,
    closePalette,
    query,
    setQuery,
    paletteInputRef,
    onPaletteKeyDown,
    addToolOpen,
    openAddTool,
    closeAddTool,
  };
}

export function buildToolResults(
  tools: DecoratedTool[],
  q: string,
  onSelect: (tool: DecoratedTool) => void,
): ToolResult[] {
  return tools
    .filter(
      (t) =>
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)),
    )
    .slice(0, 6)
    .map((t) => ({ ...t, select: () => onSelect(t) }));
}

export function buildCommandResults(
  q: string,
  closePalette: () => void,
  router: ReturnType<typeof useRouter>,
  openAddTool: () => void,
  extra: { name: string; action: () => void }[] = [],
): CommandResult[] {
  const navResults = NAV_COMMANDS.filter((c) => !q || c.name.toLowerCase().includes(q)).map((c) => ({
    name: c.name,
    select: () => {
      closePalette();
      router.push(c.href);
    },
  }));
  const allExtra = [{ name: "Add Tool", action: openAddTool }, ...extra];
  const extraResults = allExtra
    .filter((c) => !q || c.name.toLowerCase().includes(q))
    .map((c) => ({
      name: c.name,
      select: () => {
        closePalette();
        c.action();
      },
    }));
  return [...navResults, ...extraResults];
}
