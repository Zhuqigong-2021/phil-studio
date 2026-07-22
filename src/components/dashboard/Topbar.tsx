"use client";

import type { CSSProperties } from "react";
import type { ShellState } from "@/hooks/useShellState";

// Box-shadow lives on an outer, non-blurred wrapper and backdrop-filter lives
// on the inner surface. Putting both on the same element (with border-radius)
// hits a Chromium/Edge compositing bug where the blur isn't clipped to the
// rounded corner, letting a rectangular smudge peek out past the radius.
const glassSurfaceStyle: CSSProperties = {
  backdropFilter: "blur(14px) saturate(160%) brightness(1.15)",
  WebkitBackdropFilter: "blur(14px) saturate(160%) brightness(1.15)",
  background: "rgba(20,32,72,.28)",
  border: "1px solid rgba(125,190,255,.16)",
  color: "#F5F7FF",
  cursor: "pointer",
  width: "100%",
  height: "100%",
  boxSizing: "border-box",
};

const glassShadow = "0 10px 26px rgba(2,6,23,.32), 0 2px 6px rgba(2,6,23,.22)";

export default function Topbar({ state }: { state: ShellState }) {
  const { toggleMobileDrawer, openPalette } = state;

  return (
    <div className="topbar-shell" style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, gap: 16 }}>
      <div className="mobile-menu-btn" style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 12, boxShadow: glassShadow }}>
        <button
          onClick={toggleMobileDrawer}
          aria-label="Open menu"
          style={{ borderRadius: 12, alignItems: "center", justifyContent: "center", display: "flex", ...glassSurfaceStyle }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5F7FF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      </div>

      <div className="topbar-search" style={{ borderRadius: 14, boxShadow: "0 12px 30px rgba(0,4,20,.28)", width: "min(500px,45%)", minWidth: 0 }}>
        <div
          className="topbar-search-trigger"
          onClick={openPalette}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openPalette()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            height: 44,
            padding: "0 14px",
            borderRadius: 14,
            backdropFilter: "blur(14px) saturate(160%) brightness(1.15)",
            WebkitBackdropFilter: "blur(14px) saturate(160%) brightness(1.15)",
            background: "rgba(20,32,72,.28)",
            border: "1px solid rgba(125,190,255,.16)",
            minWidth: 0,
            boxSizing: "border-box",
            cursor: "pointer",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E0E7FF" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, filter: "drop-shadow(0 0 5px rgba(165,180,252,.38))" }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <span className="topbar-search-label" style={{ fontSize: 14, color: "#E0E7FF", textShadow: "0 1px 6px rgba(15,23,42,.5)", flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Search tools or run a command…
          </span>
          <span className="topbar-search-shortcut" style={{ fontSize: 11, color: "#C7D2FE", border: "1px solid rgba(199,210,254,.42)", background: "rgba(30,27,75,.16)", textShadow: "0 1px 5px rgba(15,23,42,.45)", borderRadius: 6, padding: "2px 6px", fontFamily: "var(--font-geist-mono), monospace", flexShrink: 0 }}>
            Ctrl K
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <div style={{ height: 40, borderRadius: 12, boxShadow: glassShadow }}>
          <button style={{ height: "100%", padding: "0 12px", borderRadius: 12, display: "flex", alignItems: "center", gap: 8, ...glassSurfaceStyle }} aria-label="Switch to Light theme">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5F7FF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Light</span>
            <div style={{ width: 32, height: 19, borderRadius: 10, background: "oklch(58.5% 0.233 277.117)", position: "relative", flexShrink: 0 }}>
              <div style={{ width: 15, height: 15, borderRadius: "50%", background: "oklch(78.5% 0.115 274.713)", position: "absolute", top: 2, left: 2 }} />
            </div>
          </button>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 12, boxShadow: glassShadow }}>
          <button style={{ borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", ...glassSurfaceStyle }} aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5F7FF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" strokeDasharray="2 3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
