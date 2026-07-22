import type { DashboardState } from "@/hooks/useDashboardState";

export default function TodoWidget({ state }: { state: DashboardState }) {
  const { todoGroups } = state;
  return (
    <div
      className="glass-shine-card"
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: 20,
        padding: "18px 18px 26px",
        boxSizing: "border-box",
        background: "linear-gradient(165deg, rgba(165,180,255,.055) 0%, rgba(99,102,241,.04) 40%, rgba(15,26,60,.16) 100%)",
        backdropFilter: "blur(2px) saturate(190%) brightness(1.3) contrast(1.08)",
        WebkitBackdropFilter: "blur(2px) saturate(190%) brightness(1.3) contrast(1.08)",
        border: "1px solid rgba(139,157,255,.26)",
        boxShadow: "inset 0 1.5px 0 rgba(210,220,255,.14), inset 0 0 28px rgba(99,102,241,.03), 0 18px 40px rgba(0,4,20,.26)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 650 }}>To-Do</div>
        <button style={{ height: 28, padding: "0 10px", borderRadius: 10, background: "rgba(255,255,255,.08)", border: "1px solid rgba(125,190,255,.22)", color: "#F2F6FF", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F2F6FF" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          Add Task
        </button>
      </div>
      <div className="noscroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", marginTop: 10, display: "flex", flexDirection: "column", gap: 12, scrollSnapType: "y mandatory" }}>
        {todoGroups.map((group) => (
          <div key={group.label} style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: group.labelColor, marginBottom: 6 }}>
              {group.label} <span style={{ color: "#7C8698", fontWeight: 600 }}>{group.count}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {group.tasks.map((task) => (
                <div key={task.key} className="nested-card-hover" onClick={task.toggle} style={{ height: 38, flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "0 10px", borderRadius: 10, background: "rgba(255,255,255,.03)", cursor: "pointer", scrollSnapAlign: "start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, border: `2px solid ${task.checkBorder}`, background: task.checkBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {task.done && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#020B24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, fontSize: 10, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textDecoration: task.strike, color: task.textColor }}>{task.title}</div>
                  <div style={{ fontSize: 10, color: "#7C8698", flexShrink: 0 }}>{task.time}</div>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: task.dot, flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ flexShrink: 0, marginTop: 18, fontSize: 12, fontWeight: 600, color: "#93C5FD", cursor: "pointer" }}>View all tasks →</div>
    </div>
  );
}
