"use client";

import { ExternalLinkIcon } from "../icons";
import type { RecentPageState } from "@/hooks/useRecentPageState";

export default function RecentContent({ state }: { state: RecentPageState }) {
  const { recentTools, hasRecent, noRecent, clearRecent } = state;

  return (
    <div
      className="noscroll"
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: 20,
        padding: "22px 26px",
        boxSizing: "border-box",
        background: "rgba(15,26,60,.16)",
        backdropFilter: "blur(2px) saturate(190%) brightness(1.3) contrast(1.08)",
        WebkitBackdropFilter: "blur(2px) saturate(190%) brightness(1.3) contrast(1.08)",
        border: "1px solid rgba(125,190,255,.26)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.06), 0 18px 40px rgba(0,4,20,.26)",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, marginBottom: 6 }}>
        <div style={{ fontSize: 24, fontWeight: 650 }}>Recent</div>
        <span onClick={clearRecent} style={{ fontSize: 13, color: "#A9B2C3", cursor: "pointer" }}>Clear</span>
      </div>
      <div style={{ fontSize: 13, color: "#A9B2C3", marginBottom: 20, flexShrink: 0 }}>Tools you opened recently, most recent first.</div>

      {hasRecent && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recentTools.map((tool) => (
            <div key={tool.id} className="nested-card-hover" style={{ height: 64, flexShrink: 0, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", borderRadius: 14, background: "rgba(15,26,60,.10)", backdropFilter: "blur(1px) saturate(175%) brightness(1.25) contrast(1.06)", WebkitBackdropFilter: "blur(1px) saturate(175%) brightness(1.25) contrast(1.06)", border: "1px solid rgba(125,190,255,.10)", boxSizing: "border-box" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, background: tool.accentSoft, border: `1px solid ${tool.accentBorder}`, color: tool.color }}>
                {tool.mono}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.name}</div>
                <div style={{ fontSize: 11, color: "#7C8698" }}>{tool.time}</div>
              </div>
              <ExternalLinkIcon size={15} />
            </div>
          ))}
        </div>
      )}
      {noRecent && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "#7C8698" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C8698" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
          <div style={{ fontSize: 13 }}>Nothing opened yet. Recently launched tools will show up here.</div>
        </div>
      )}
    </div>
  );
}
