"use client";

import { useState } from "react";
import type { DashboardState } from "@/hooks/useDashboardState";
import { openTool, openToolFromKeyboard } from "@/lib/dashboard/open-tool";
import { ExternalLinkIcon } from "../icons";

export default function QuickRecentPanel({ state }: { state: DashboardState }) {
  const [activeTab, setActiveTab] = useState<"quick" | "recent">("quick");
  const tools = activeTab === "quick"
    ? state.qaTools.map((tool) => ({ ...tool, time: undefined }))
    : state.recentTools;

  return (
    <div className="glass-shine-card quick-recent-panel">
      <div className="quick-recent-tabs" role="tablist" aria-label="Tool shortcuts">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "quick"}
          className={activeTab === "quick" ? "is-active" : ""}
          onClick={() => setActiveTab("quick")}
        >
          Quick Access <span>{state.qaTools.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "recent"}
          className={activeTab === "recent" ? "is-active" : ""}
          onClick={() => setActiveTab("recent")}
        >
          Recent <span>{state.recentTools.length}</span>
        </button>
      </div>

      <div className="noscroll quick-recent-list" role="tabpanel">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="nested-card-hover quick-recent-row"
            role={tool.url ? "link" : undefined}
            tabIndex={tool.url ? 0 : undefined}
            onClick={() => openTool(tool.id, tool.url)}
            onKeyDown={(event) => openToolFromKeyboard(event, tool.id, tool.url)}
          >
            <div style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: tool.accentSoft, border: `1px solid ${tool.accentBorder}`, color: tool.color }}>
              {tool.mono}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.name}</div>
              {activeTab === "recent" && tool.time && <div style={{ fontSize: 10, color: "#7C8698" }}>{tool.time}</div>}
            </div>
            <ExternalLinkIcon size={12} />
          </div>
        ))}
      </div>
    </div>
  );
}
