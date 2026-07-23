"use client";

import Link from "next/link";
import { ExternalLinkIcon, StarIcon } from "./icons";
import GooeyTagNav from "./GooeyTagNav";
import type { DashboardState } from "@/hooks/useDashboardState";
import { openTool, openToolFromKeyboard } from "@/lib/dashboard/open-tool";

export default function ToolsColumn({ state }: { state: DashboardState }) {
  const { tagsList, favTools, allTools, toggleFav, view, setView } = state;

  return (
    <div className="col-tools" style={{ minHeight: 0, flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ flexShrink: 0 }}>
        <GooeyTagNav tags={tagsList} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 650, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#67E8F9" stroke="#67E8F9" strokeWidth="1.75"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
            Favorites <span style={{ color: "#A9B2C3", fontSize: 12, fontWeight: 600 }}>({favTools.length})</span>
          </div>
          <Link href="/favs" style={{ fontSize: 13, color: "#A9B2C3", cursor: "pointer", textDecoration: "none" }}>View all</Link>
        </div>
        <div className="noscroll" style={{ display: "flex", gap: 12, overflowX: "auto", overflowY: "hidden", paddingBottom: 2, scrollSnapType: "x mandatory" }}>
          {favTools.map((tool) => (
            <div
              key={tool.id}
              className="glass-shine-card nested-card-hover"
              role={tool.url ? "link" : undefined}
              tabIndex={tool.url ? 0 : undefined}
              onClick={() => openTool(tool.id, tool.url)}
              onKeyDown={(event) => openToolFromKeyboard(event, tool.id, tool.url)}
              style={{
                width: 184,
                height: 74,
                flexShrink: 0,
                borderRadius: 14,
                padding: 12,
                boxSizing: "border-box",
                background: tool.favBg,
                border: "1px solid rgba(125,190,255,.16)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,.07), 0 10px 24px rgba(0,5,24,.25)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                scrollSnapAlign: "start",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: tool.accentSoft, border: `1px solid ${tool.accentBorder}`, color: tool.color }}>
                  {tool.mono}
                </div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.name}</div>
                <ExternalLinkIcon size={13} />
              </div>
              <div style={{ fontSize: 11, color: "#A9B2C3", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.tagStr}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="glass-shine-card all-tools-panel"
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          borderRadius: 20,
          padding: "14px 16px",
          boxSizing: "border-box",
          background: "linear-gradient(165deg, rgba(165,180,255,.055) 0%, rgba(99,102,241,.04) 40%, rgba(15,26,60,.16) 100%)",
          backdropFilter: "blur(2px) saturate(190%) brightness(1.3) contrast(1.08)",
          WebkitBackdropFilter: "blur(2px) saturate(190%) brightness(1.3) contrast(1.08)",
          border: "1px solid rgba(139,157,255,.30)",
          boxShadow: "inset 0 1.5px 0 rgba(210,220,255,.18), inset 0 0 32px rgba(99,102,241,.04), 0 18px 40px rgba(0,4,20,.26)",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, marginBottom: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 650 }}>All <span style={{ color: "#A9B2C3", fontSize: 12, fontWeight: 600 }}>({allTools.length})</span></div>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 2, gap: 2 }}>
            <div onClick={() => setView("list")} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", background: view === "list" ? "rgba(103,232,249,.18)" : "transparent", color: view === "list" ? "#F5F7FF" : "#A9B2C3" }}>List</div>
            <div onClick={() => setView("grid")} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", background: view === "grid" ? "rgba(103,232,249,.18)" : "transparent", color: view === "grid" ? "#F5F7FF" : "#A9B2C3" }}>Grid</div>
          </div>
        </div>

        {view === "list" ? (
          <div className="noscroll all-tools-list" style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gridAutoRows: 50, gap: 6, scrollSnapType: "y mandatory" }}>
            {allTools.map((tool) => (
              <div
                key={tool.id}
                className="nested-card-hover"
                role={tool.url ? "link" : undefined}
                tabIndex={tool.url ? 0 : undefined}
                onClick={() => openTool(tool.id, tool.url)}
                onKeyDown={(event) => openToolFromKeyboard(event, tool.id, tool.url)}
                style={{
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0 11px",
                  borderRadius: 12,
                  background: "linear-gradient(165deg, rgba(165,180,255,.045) 0%, rgba(99,102,241,.03) 40%, rgba(15,26,60,.10) 100%)",
                  backdropFilter: "blur(1px) saturate(108%) contrast(1.03)",
                  WebkitBackdropFilter: "blur(1px) saturate(108%) contrast(1.03)",
                  border: "1px solid rgba(139,157,255,.16)",
                  boxShadow: "inset 0 1px 0 rgba(210,220,255,.10)",
                  boxSizing: "border-box",
                  scrollSnapAlign: "start",
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: tool.accentSoft, border: `1px solid ${tool.accentBorder}`, color: tool.color }}>
                  {tool.mono}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.name}</div>
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
          <div className="noscroll" style={{ flex: 1, minHeight: 0, display: "grid", gridAutoFlow: "column", gridTemplateRows: "repeat(2,minmax(120px,148px))", gridAutoColumns: 168, gap: 12, overflowX: "auto", overflowY: "hidden", scrollSnapType: "x mandatory" }}>
            {allTools.map((tool) => (
              <div
                key={tool.id}
                className="nested-card-hover"
                role={tool.url ? "link" : undefined}
                tabIndex={tool.url ? 0 : undefined}
                onClick={() => openTool(tool.id, tool.url)}
                onKeyDown={(event) => openToolFromKeyboard(event, tool.id, tool.url)}
                style={{
                  width: 168,
                  borderRadius: 16,
                  padding: 12,
                  boxSizing: "border-box",
                  background: "linear-gradient(165deg, rgba(165,180,255,.045) 0%, rgba(99,102,241,.03) 40%, rgba(15,26,60,.10) 100%)",
                  backdropFilter: "blur(1px) saturate(108%) contrast(1.03)",
                  WebkitBackdropFilter: "blur(1px) saturate(108%) contrast(1.03)",
                  border: "1px solid rgba(139,157,255,.16)",
                  boxShadow: "inset 0 1px 0 rgba(210,220,255,.10)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  scrollSnapAlign: "start",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: tool.accentSoft, border: `1px solid ${tool.accentBorder}`, color: tool.color }}>
                    {tool.mono}
                  </div>
                  <button onClick={(event) => { event.stopPropagation(); toggleFav(tool.id); }} aria-label="Toggle favorite" style={{ width: 22, height: 22, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                    <StarIcon filled={tool.favorite} size={14} />
                  </button>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.name}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                  <div style={{ fontSize: 11, color: "#A9B2C3", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.tagStr}</div>
                  <ExternalLinkIcon />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
