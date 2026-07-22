"use client";

import type { ManagePageState } from "@/hooks/useManagePageState";

const manageGridColumns = "minmax(240px,2fr) minmax(180px,1.4fr) 70px 80px 120px 40px";

export default function ManageContent({ state }: { state: ManagePageState }) {
  const { manageTools, openAddTool } = state;

  return (
    <div
      className="noscroll secondary-page-flow-border"
      style={{
        flex: 1,
        minWidth: 0,
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
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, marginBottom: 6 }}>
        <div style={{ fontSize: 24, fontWeight: 650 }}>Manage</div>
        <button onClick={openAddTool} style={{ height: 38, padding: "0 16px", borderRadius: 11, background: "linear-gradient(120deg,#3B82F6,#8B5CF6)", color: "#fff", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 7, border: "none", boxShadow: "0 10px 22px rgba(59,130,246,.32)", cursor: "pointer" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          Add Tool
        </button>
      </div>
      <div style={{ fontSize: 13, color: "#A9B2C3", marginBottom: 18, flexShrink: 0 }}>Select a row to edit; the external-link arrow opens the tool.</div>

      <div className="manage-table-scroll" style={{ flex: 1, minHeight: 0, overflow: "auto", overscrollBehavior: "contain" }}>
        <div style={{ width: "100%", minWidth: 800, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "grid", gridTemplateColumns: manageGridColumns, gap: 8, padding: "0 14px 8px", fontSize: 11, fontWeight: 600, color: "#7C8698", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            <span>Tool</span><span>Tags</span><span>Fav</span><span>Visible</span><span>Last checked</span><span></span>
          </div>
          {manageTools.map((tool) => (
            <div
              key={tool.id}
              className="nested-card-hover"
              onClick={tool.openEdit}
              style={{ display: "grid", gridTemplateColumns: manageGridColumns, gap: 8, alignItems: "center", height: 60, padding: "0 14px", borderRadius: 14, background: tool.rowBg, border: "1px solid rgba(125,190,255,.10)", cursor: "pointer", boxSizing: "border-box" }}
            >
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: tool.accentSoft, border: `1px solid ${tool.accentBorder}`, color: tool.color }}>
                {tool.mono}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.name}</div>
                <div style={{ fontSize: 10, color: "#7C8698", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.sourceType === "external" ? "Third-party" : "Own tool"}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#A9B2C3", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.tagStr}</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                tool.toggleFav();
              }}
              aria-label="Toggle favorite"
              style={{ width: 28, height: 28, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill={tool.starFill} stroke="#67E8F9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                tool.toggleVisible();
              }}
              aria-label="Toggle visibility"
              style={{ width: 32, height: 19, borderRadius: 10, background: tool.visBg, position: "relative", flexShrink: 0, border: "none", cursor: "pointer", padding: 0 }}
            >
              <div style={{ width: 15, height: 15, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: tool.visDotLeft, transition: "left .15s" }} />
            </button>
            <span style={{ fontSize: 11, color: tool.checkColor, fontWeight: 600 }}>{tool.checkStatus}</span>
            <a
              href="#"
              onClick={(e) => e.stopPropagation()}
              aria-label="Open tool"
              style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#67E8F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
            </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
