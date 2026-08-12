"use client";

import type { ReactNode } from "react";
import { AnimatePresence } from "motion/react";
import type { ShellState } from "@/hooks/useShellState";
import { useCustomTools } from "@/hooks/useCustomTools";
import type { PageKey } from "./Sidebar";
import SkillBackground5 from "./SkillBackground5";
import WorkspaceSplashCursor from "./WorkspaceSplashCursor";
import Sidebar from "./Sidebar";
import MobileDrawer from "./MobileDrawer";
import Topbar from "./Topbar";
import CommandPalette from "./CommandPalette";
import AddToolModal from "./AddToolModal";
import DatabaseToastViewport from "./DatabaseToastViewport";

function SecondaryAddToolModal({ state }: { state: ShellState }) {
  const workspace = useCustomTools();
  return (
    <AddToolModal
      open
      onClose={state.closeAddTool}
      workspace={workspace}
    />
  );
}

export default function SecondaryPageShell({
  state,
  active,
  children,
}: {
  state: ShellState;
  active: PageKey;
  children: ReactNode;
}) {
  return (
    <div
      className="dash-root noscroll"
      style={{
        width: "100vw",
        height: "100dvh",
        minHeight: 640,
        boxSizing: "border-box",
        display: "flex",
        gap: 20,
        padding: 16,
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
        fontFamily: "var(--font-geist-sans), var(--font-inter), system-ui, sans-serif",
        color: "#F2F6FF",
        background: "#03120E",
      }}
    >
      <SkillBackground5 />
      <WorkspaceSplashCursor />

      {state.mobileOpen && <MobileDrawer state={state} active={active} solid />}

      <Sidebar state={state} variant="desktop" active={active} solid />

      <div style={{ position: "relative", zIndex: 1, flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 20, overflow: "visible", minHeight: 0 }}>
        <Topbar state={state} />
        <div className={active === "manage" ? undefined : "secondary-page-flow-border"} style={{ flex: 1, minHeight: 0, display: "flex" }}>
          {children}
        </div>
      </div>

      <CommandPalette state={state} />
      <AnimatePresence>
        {state.addToolOpen && <SecondaryAddToolModal state={state} />}
      </AnimatePresence>
      <DatabaseToastViewport />
    </div>
  );
}
