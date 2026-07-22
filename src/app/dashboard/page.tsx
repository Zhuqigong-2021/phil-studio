"use client";

import "./dashboard.css";
import { useDashboardState } from "@/hooks/useDashboardState";
import SkillBackground3 from "@/components/dashboard/SkillBackground3";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileDrawer from "@/components/dashboard/MobileDrawer";
import Topbar from "@/components/dashboard/Topbar";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import ToolsColumn from "@/components/dashboard/ToolsColumn";
import PanelSlotColumn from "@/components/dashboard/panels/PanelSlotColumn";
import CommandPalette from "@/components/dashboard/CommandPalette";
import AddToolModal from "@/components/dashboard/AddToolModal";

export default function DashboardPage() {
  const state = useDashboardState();
  const { mobileOpen, slotAPanels, slotBPanels, slotAEmpty, slotBEmpty, gridCols, openAddTool } = state;

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
      <SkillBackground3 />

      {mobileOpen && <MobileDrawer state={state} active="dashboard" />}

      <Sidebar state={state} variant="desktop" active="dashboard" />

      <div style={{ position: "relative", zIndex: 1, flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 20, overflow: "visible", minHeight: 0 }}>
        <Topbar state={state} />

        <div
          className="dash-grid noscroll"
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "visible",
            display: "grid",
            gridTemplateColumns: gridCols,
            gridTemplateRows: "auto minmax(0,1fr)",
            gap: 20,
            transition: "grid-template-columns .18s ease",
          }}
        >
          <WelcomeCard onAddTool={openAddTool} />
          <ToolsColumn state={state} />
          <PanelSlotColumn
            slotKey="A"
            className="col-access"
            gridColumn="2"
            gridRow="2"
            panels={slotAPanels}
            empty={slotAEmpty}
            state={state}
          />
          <PanelSlotColumn
            slotKey="B"
            className="col-widgets"
            gridColumn="3"
            gridRow="1 / 3"
            panels={slotBPanels}
            empty={slotBEmpty}
            state={state}
          />
        </div>
      </div>

      <CommandPalette state={state} />
      <AddToolModal state={state} />
    </div>
  );
}
