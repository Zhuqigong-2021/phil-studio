import { ExternalLinkIcon } from "../icons";
import type { DashboardState } from "@/hooks/useDashboardState";

export default function QuickAccessPanel({ state }: { state: DashboardState }) {
  const { qaTools } = state;
  return (
    <div
      className="glass-shine-card"
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: 18,
        padding: "16px 16px",
        boxSizing: "border-box",
        background: "linear-gradient(165deg, rgba(165,180,255,.055) 0%, rgba(99,102,241,.04) 40%, rgba(15,26,60,.16) 100%)",
        backdropFilter: "blur(2px) saturate(190%) brightness(1.3) contrast(1.08)",
        WebkitBackdropFilter: "blur(2px) saturate(190%) brightness(1.3) contrast(1.08)",
        border: "1px solid rgba(139,157,255,.26)",
        boxShadow: "inset 0 1.5px 0 rgba(210,220,255,.14), inset 0 0 28px rgba(99,102,241,.03), 0 14px 30px rgba(0,4,20,.28)",
        overflow: "hidden",
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 650 }}>Quick Access</div>
      <div style={{ fontSize: 11, color: "#A9B2C3", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        Pinned tools, ready when you need them.
      </div>
      <div className="noscroll" style={{ height: 160, flexShrink: 0, overflowY: "auto", overflowX: "hidden", marginTop: 10, display: "flex", flexDirection: "column", gap: 8, scrollSnapType: "y mandatory" }}>
        {qaTools.map((tool) => (
          <div key={tool.id} className="nested-card-hover" style={{ height: 48, flexShrink: 0, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 9, padding: "0 9px", borderRadius: 11, background: "linear-gradient(165deg, rgba(165,180,255,.05) 0%, rgba(99,102,241,.03) 45%, rgba(255,255,255,.02) 100%)", border: "1px solid rgba(255,255,255,.06)", scrollSnapAlign: "start" }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: tool.accentSoft, border: `1px solid ${tool.accentBorder}`, color: tool.color }}>
              {tool.mono}
            </div>
            <div style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.name}</div>
            <ExternalLinkIcon size={12} />
          </div>
        ))}
      </div>
    </div>
  );
}
