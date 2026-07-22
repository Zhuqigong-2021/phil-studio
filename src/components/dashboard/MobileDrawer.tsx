"use client";

import Sidebar, { type PageKey } from "./Sidebar";
import type { ShellState } from "@/hooks/useShellState";

export default function MobileDrawer({ state, active, solid }: { state: ShellState; active: PageKey; solid?: boolean }) {
  const { mobileOpen, closeMobileDrawer } = state;
  if (!mobileOpen) return null;

  return (
    <>
      <div onClick={closeMobileDrawer} className="mobile-backdrop" />
      <Sidebar state={state} variant="mobile" active={active} solid={solid} />
    </>
  );
}
