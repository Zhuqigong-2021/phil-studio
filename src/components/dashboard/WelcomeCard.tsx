export default function WelcomeCard({ onAddTool }: { onAddTool: () => void }) {
  return (
    <div
      className="welcome-card glass-shine-card"
      style={{
        gridColumn: "1 / 3",
        gridRow: 1,
        alignSelf: "start",
        borderRadius: 20,
        padding: "22px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        flexWrap: "wrap",
        rowGap: 12,
        minHeight: 110,
        height: 110,
        boxSizing: "border-box",
        background: "linear-gradient(165deg, rgba(165,180,255,.07) 0%, rgba(99,102,241,.05) 45%, rgba(15,26,64,.32) 100%)",
        backdropFilter: "blur(16px) saturate(160%) brightness(1.15)",
        WebkitBackdropFilter: "blur(16px) saturate(160%) brightness(1.15)",
        border: "1px solid rgba(139,157,255,.28)",
        boxShadow: "inset 0 1.5px 0 rgba(210,220,255,.22), inset 0 0 40px rgba(99,102,241,.05), 0 18px 42px rgba(0,4,20,.26)",
        overflow: "hidden",
      }}
    >
      <div style={{ minWidth: 0, minHeight: 56 }}>
        <div style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 400, lineHeight: 1.2 }}>Good afternoon, Phil</div>
        <div style={{ fontSize: 14, color: "#CBD5E8", marginTop: 6, whiteSpace: "nowrap" }}>
          <span className="welcome-subtitle-long">Everything you need to create, automate, and stay productive—all in one place.</span>
          <span className="welcome-subtitle-short">Your tools, one place.</span>
        </div>
      </div>
      <button
        onClick={onAddTool}
        className="primary-action-button"
        style={{
          height: 40,
          padding: "0 18px",
          borderRadius: 12,
          background: "linear-gradient(120deg,#2563EB 0%,#4F46E5 62%,#6366F1 100%)",
          color: "#fff",
          fontSize: 14,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid rgba(191,219,254,.46)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.24), 0 10px 24px rgba(37,99,235,.34)",
          cursor: "pointer",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        Add Tool
      </button>
    </div>
  );
}
