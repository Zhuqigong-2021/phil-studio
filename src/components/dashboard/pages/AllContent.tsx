"use client";

import { ExternalLinkIcon, StarIcon } from "../icons";
import type { AllPageState } from "@/hooks/useAllPageState";
import { openTool, openToolFromKeyboard } from "@/lib/dashboard/open-tool";

export default function AllContent({ state }: { state: AllPageState }) {
  const { tagsList, allTools, toggleFav, view, setView, toolCount } = state;

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
        <div style={{ fontSize: 24, fontWeight: 650 }}>All Tools</div>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 2, gap: 2 }}>
          <div onClick={() => setView("list")} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", background: view === "list" ? "rgba(103,232,249,.18)" : "transparent", color: view === "list" ? "#F5F7FF" : "#A9B2C3" }}>List</div>
          <div onClick={() => setView("grid")} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", background: view === "grid" ? "rgba(103,232,249,.18)" : "transparent", color: view === "grid" ? "#F5F7FF" : "#A9B2C3" }}>Grid</div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: "#A9B2C3", marginBottom: 16, flexShrink: 0 }}>{toolCount} tools across all categories.</div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, flexShrink: 0 }}>
        {tagsList.map((tag) => (
          <div
            key={tag.name}
            onClick={tag.onClick}
            style={{ padding: "7px 13px", borderRadius: 11, fontSize: 12, fontWeight: 500, background: tag.active ? "linear-gradient(120deg, rgba(59,130,246,.45), rgba(103,232,249,.30))" : "rgba(255,255,255,.06)", color: tag.active ? "#F5F7FF" : "#A9B2C3", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            {tag.name}
          </div>
        ))}
      </div>

      {view === "list" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gridAutoRows: 64, gap: 10 }}>
          {allTools.map((tool) => (
            <div key={tool.id} className="nested-card-hover" role={tool.url ? "link" : undefined} tabIndex={tool.url ? 0 : undefined} onClick={() => openTool(tool.id, tool.url)} onKeyDown={(event) => openToolFromKeyboard(event, tool.id, tool.url)} style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", borderRadius: 14, background: "rgba(15,26,60,.10)", backdropFilter: "blur(1px) saturate(175%) brightness(1.25) contrast(1.06)", WebkitBackdropFilter: "blur(1px) saturate(175%) brightness(1.25) contrast(1.06)", border: "1px solid rgba(125,190,255,.10)", boxSizing: "border-box" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, background: tool.accentSoft, border: `1px solid ${tool.accentBorder}`, color: tool.color }}>
                {tool.mono}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.name}</div>
                <div style={{ fontSize: 11, color: "#A9B2C3", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.tagStr}</div>
              </div>
              <button onClick={(event) => { event.stopPropagation(); toggleFav(tool.id); }} aria-label="Toggle favorite" style={{ width: 36, height: 36, flexShrink: 0, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                <StarIcon filled={tool.favorite} />
              </button>
              <ExternalLinkIcon size={15} />
            </div>
          ))}
        </div>
      ) : (
        <div className="all-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
          {allTools.map((tool) => (
            <div key={tool.id} className="nested-card-hover" role={tool.url ? "link" : undefined} tabIndex={tool.url ? 0 : undefined} onClick={() => openTool(tool.id, tool.url)} onKeyDown={(event) => openToolFromKeyboard(event, tool.id, tool.url)} style={{ minHeight: 168, borderRadius: 16, padding: 16, boxSizing: "border-box", background: "rgba(15,26,60,.10)", backdropFilter: "blur(1px) saturate(175%) brightness(1.25) contrast(1.06)", WebkitBackdropFilter: "blur(1px) saturate(175%) brightness(1.25) contrast(1.06)", border: "1px solid rgba(125,190,255,.10)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, background: tool.accentSoft, border: `1px solid ${tool.accentBorder}`, color: tool.color }}>
                {tool.mono}
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.name}</div>
                <div style={{ fontSize: 11, color: "#A9B2C3", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.tagStr}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                <button onClick={(event) => { event.stopPropagation(); toggleFav(tool.id); }} aria-label="Toggle favorite" style={{ width: 24, height: 24, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                  <StarIcon filled={tool.favorite} size={15} />
                </button>
                <ExternalLinkIcon size={14} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
