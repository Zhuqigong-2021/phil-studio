"use client";

import { ExternalLinkIcon } from "../icons";
import type { FavsPageState } from "@/hooks/useFavsPageState";
import { openTool, openToolFromKeyboard } from "@/lib/dashboard/open-tool";

export default function FavsContent({ state }: { state: FavsPageState }) {
  const { favTools, toggleFav, favCount, hasFavs } = state;

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
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginBottom: 6 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#67E8F9" stroke="#67E8F9" strokeWidth="1.75"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
        <div style={{ fontSize: 24, fontWeight: 650 }}>Favorites</div>
      </div>
      <div style={{ fontSize: 13, color: "#A9B2C3", marginBottom: 20, flexShrink: 0 }}>{favCount} tools you starred for quick access.</div>

      {hasFavs ? (
        <div className="all-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
          {favTools.map((tool) => (
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
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#67E8F9" stroke="#67E8F9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
                </button>
                <ExternalLinkIcon size={14} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "#7C8698" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C8698" strokeWidth="1.5"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
          <div style={{ fontSize: 13 }}>No favorites yet. Star a tool from All to see it here.</div>
        </div>
      )}
    </div>
  );
}
