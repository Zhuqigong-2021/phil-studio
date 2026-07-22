"use client";

import type { ManagePageState } from "@/hooks/useManagePageState";

export default function EditPanel({ state }: { state: ManagePageState }) {
  const { editingTool, closeEdit } = state;
  if (!editingTool) return null;

  return (
    <>
      <div className="edit-panel-backdrop" onClick={closeEdit} aria-hidden="true" />
      <div
        className="edit-panel"
        role="dialog"
        aria-label={`Edit ${editingTool.name}`}
        style={{
        width: 360,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: 20,
        padding: 22,
        boxSizing: "border-box",
        background: "rgba(15,26,60,.24)",
        backdropFilter: "blur(16px) saturate(170%) brightness(1.2)",
        WebkitBackdropFilter: "blur(16px) saturate(170%) brightness(1.2)",
        border: "1px solid rgba(125,190,255,.24)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.07), 0 18px 40px rgba(0,4,20,.28)",
        overflowY: "auto",
        }}
      >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ fontSize: 17, fontWeight: 650 }}>Edit Tool</div>
        <button onClick={closeEdit} aria-label="Close" style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(186,230,253,0.16)", color: "#A9B2C3", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A9B2C3" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, background: editingTool.accentSoft, border: `1px solid ${editingTool.accentBorder}`, color: editingTool.color }}>
          {editingTool.mono}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 650, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{editingTool.name}</div>
          <div style={{ fontSize: 11, color: "#7C8698" }}>{editingTool.sourceType === "external" ? "Third-party" : "Own tool"}</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#A9B2C3", marginBottom: 6 }}>Name</div>
          <div style={{ height: 40, borderRadius: 11, background: "rgba(255,255,255,.04)", border: "1px solid rgba(186,230,253,0.16)", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 13 }}>{editingTool.name}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#A9B2C3", marginBottom: 6 }}>URL</div>
          <div style={{ height: 40, borderRadius: 11, background: "rgba(255,255,255,.04)", border: "1px solid rgba(186,230,253,0.16)", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 13, color: "#A9B2C3" }}>{editingTool.url}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#A9B2C3", marginBottom: 6 }}>Tags</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {editingTool.tagChips.map((tc) => (
              <span key={tc} style={{ padding: "5px 10px", borderRadius: 9, fontSize: 11, fontWeight: 600, background: "rgba(103,232,249,.14)", color: "#67E8F9" }}>{tc}</span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 11, background: "rgba(255,255,255,.03)" }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Favorite</span>
          <button onClick={editingTool.toggleFav} aria-label="Toggle favorite" style={{ width: 32, height: 19, borderRadius: 10, background: editingTool.visBg, position: "relative", flexShrink: 0, border: "none", cursor: "pointer", padding: 0 }}>
            <div style={{ width: 15, height: 15, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: editingTool.favDotLeft, transition: "left .15s" }} />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 11, background: "rgba(255,255,255,.03)" }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Pin to Quick Access</span>
          <button onClick={editingTool.togglePin} aria-label="Toggle pin" style={{ width: 32, height: 19, borderRadius: 10, background: editingTool.pinBg, position: "relative", flexShrink: 0, border: "none", cursor: "pointer", padding: 0 }}>
            <div style={{ width: 15, height: 15, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: editingTool.pinDotLeft, transition: "left .15s" }} />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 11, background: "rgba(255,255,255,.03)" }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Visible</span>
          <button onClick={editingTool.toggleVisible} aria-label="Toggle visibility" style={{ width: 32, height: 19, borderRadius: 10, background: editingTool.visibleBg, position: "relative", flexShrink: 0, border: "none", cursor: "pointer", padding: 0 }}>
            <div style={{ width: 15, height: 15, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: editingTool.visibleDotLeft, transition: "left .15s" }} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button onClick={closeEdit} style={{ flex: 1, height: 40, borderRadius: 11, background: "rgba(255,255,255,.05)", border: "1px solid rgba(186,230,253,0.16)", color: "#F2F6FF", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
        <button onClick={closeEdit} style={{ flex: 1, height: 40, borderRadius: 11, background: "linear-gradient(120deg,#3B82F6,#8B5CF6)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save</button>
      </div>
      </div>
    </>
  );
}
