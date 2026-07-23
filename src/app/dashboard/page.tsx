"use client";

import "./dashboard.css";
import { useDashboardState } from "@/hooks/useDashboardState";
import SkillBackground5 from "@/components/dashboard/SkillBackground5";
import WorkspaceSplashCursor from "@/components/dashboard/WorkspaceSplashCursor";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileDrawer from "@/components/dashboard/MobileDrawer";
import Topbar from "@/components/dashboard/Topbar";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import ToolsColumn from "@/components/dashboard/ToolsColumn";
import DashboardRightRail from "@/components/dashboard/panels/DashboardRightRail";
import CommandPalette from "@/components/dashboard/CommandPalette";
import AddToolModal from "@/components/dashboard/AddToolModal";

export default function DashboardPage() {
  const state = useDashboardState();
  const { mobileOpen, openAddTool } = state;

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

      {mobileOpen && <MobileDrawer state={state} active="dashboard" />}

      <Sidebar state={state} variant="desktop" active="dashboard" />

      <div className="dashboard-layout noscroll">
        <main className="dashboard-main-column">
          <Topbar state={state} />
          <WelcomeCard onAddTool={openAddTool} />
          <ToolsColumn state={state} />
        </main>
        <DashboardRightRail state={state} />
      </div>

      <CommandPalette state={state} />
      <AddToolModal state={state} />
    </div>
  );
}
