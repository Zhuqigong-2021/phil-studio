"use client";

import { ExternalLinkIcon } from "./icons";
import type { ShellState } from "@/hooks/useShellState";

export default function CommandPalette({ state }: { state: ShellState }) {
  const {
    paletteOpen,
    closePalette,
    query,
    setQuery,
    paletteInputRef,
    onPaletteKeyDown,
    toolResults,
    commandResults,
  } = state;

  if (!paletteOpen) return null;

  const hasToolResults = toolResults.length > 0;
  const hasCommandResults = commandResults.length > 0;
  const noResults = !hasToolResults && !hasCommandResults;

  return (
    <div
      onClick={closePalette}
      style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(2,6,23,.6)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "12vh" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(560px,90vw)",
          maxHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 18,
          background: "rgba(15,26,64,.92)",
          backdropFilter: "blur(20px) saturate(170%) brightness(1.2)",
          WebkitBackdropFilter: "blur(20px) saturate(170%) brightness(1.2)",
          border: "1px solid rgba(125,190,255,.24)",
          boxShadow: "0 24px 60px rgba(0,4,20,.35)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid rgba(125,190,255,.14)", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A9B2C3" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={paletteInputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onPaletteKeyDown}
            placeholder="Search tools or run a command…"
            style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: "#F2F6FF", fontSize: 14, fontFamily: "inherit" }}
          />
          <span style={{ fontSize: 11, color: "#7C8698", border: "1px solid rgba(186,230,253,0.2)", borderRadius: 6, padding: "2px 6px", fontFamily: "var(--font-geist-mono), monospace", flexShrink: 0 }}>Esc</span>
        </div>
        <div className="noscroll" style={{ flex: 1, overflowY: "auto", padding: "8px 8px 20px" }}>
          {hasToolResults && (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#7C8698", textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 10px 4px" }}>Tools</div>
              {toolResults.map((r) => (
                <div
                  key={r.id}
                  onClick={r.select}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 10, cursor: "pointer", background: "transparent" }}
                >
                  <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: r.accentSoft, border: `1px solid ${r.accentBorder}`, color: r.color }}>
                    {r.mono}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
                  <ExternalLinkIcon />
                </div>
              ))}
            </>
          )}
          {hasCommandResults && (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#7C8698", textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 10px 4px" }}>Commands</div>
              {commandResults.map((c) => (
                <div key={c.name} onClick={c.select} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 10, cursor: "pointer", background: "transparent" }}>
                  <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                </div>
              ))}
            </>
          )}
          {noResults && (
            <div style={{ padding: "24px 10px", textAlign: "center", fontSize: 13, color: "#7C8698" }}>No matches for &quot;{query}&quot;</div>
          )}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 28, background: "linear-gradient(to bottom, rgba(15,26,64,0), rgba(15,26,64,.92))", pointerEvents: "none", borderRadius: "0 0 18px 18px" }} />
      </div>
    </div>
  );
}
