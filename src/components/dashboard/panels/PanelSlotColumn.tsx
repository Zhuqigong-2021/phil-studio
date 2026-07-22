import type { CSSProperties } from "react";
import type { DashboardState, PanelData } from "@/hooks/useDashboardState";
import type { PanelId } from "@/lib/dashboard/types";
import QuickAccessPanel from "./QuickAccessPanel";
import RecentPanel from "./RecentPanel";
import CalendarWidget from "./CalendarWidget";
import TodoWidget from "./TodoWidget";

function renderPanel(id: PanelId, state: DashboardState) {
  switch (id) {
    case "qa":
      return <QuickAccessPanel state={state} />;
    case "recent":
      return <RecentPanel state={state} />;
    case "calendar":
      return <CalendarWidget state={state} />;
    case "todo":
      return <TodoWidget state={state} />;
  }
}

function sizeStyle(id: PanelId): CSSProperties {
  return id === "recent" || id === "todo" ? { flex: 1, minHeight: 0 } : { flexShrink: 0 };
}

interface PanelSlotColumnProps {
  slotKey: "A" | "B";
  className: string;
  gridColumn: string;
  gridRow: string;
  panels: PanelData[];
  empty: boolean;
  state: DashboardState;
}

export default function PanelSlotColumn({ slotKey, className, gridColumn, gridRow, panels, empty, state }: PanelSlotColumnProps) {
  const { dragOverAllow, handleSlotDrop, makeGripDragStart } = state;

  return (
    <div
      className={className}
      onDragOver={dragOverAllow}
      onDrop={(e) => handleSlotDrop(slotKey, e)}
      style={{ gridColumn, gridRow, minHeight: 0, display: "flex", flexDirection: "column", gap: 10 }}
    >
      <div
        draggable
        onDragStart={makeGripDragStart(slotKey)}
        className="col-grip"
        title="Drag to swap columns"
        style={{ width: "100%", height: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "grab", opacity: 0.5 }}
      >
        <svg width="16" height="6" viewBox="0 0 16 6">
          <circle cx="2" cy="3" r="1.4" fill="#A9B2C3" /><circle cx="8" cy="3" r="1.4" fill="#A9B2C3" /><circle cx="14" cy="3" r="1.4" fill="#A9B2C3" />
        </svg>
      </div>

      {panels.map((p) => (
        <div
          key={p.id}
          draggable
          onDragStart={p.dragStart}
          onDragOver={p.dragOver}
          onDrop={p.drop}
          className="col-panel"
          style={{ ...sizeStyle(p.id), display: "flex", flexDirection: "column", cursor: "grab" }}
        >
          {renderPanel(p.id, state)}
        </div>
      ))}

      {empty && (
        <div style={{ flex: 1, minHeight: 120, borderRadius: 16, border: "1.5px dashed rgba(125,190,255,.28)", display: "flex", alignItems: "center", justifyContent: "center", writingMode: "vertical-rl", textOrientation: "mixed", fontSize: 11, color: "#7C8698" }}>
          Drop here
        </div>
      )}
    </div>
  );
}
