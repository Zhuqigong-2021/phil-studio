"use client";

import { useState, type FormEvent } from "react";
import type { DashboardState } from "@/hooks/useDashboardState";

export default function TodoWidget({ state }: { state: DashboardState }) {
  const { todoTasks: tasks, addTask } = state;
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const completedCount = tasks.filter((task) => task.done).length;
  const progress = tasks.length ? (completedCount / tasks.length) * 100 : 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!addTask(title)) return;
    setTitle("");
    setIsAdding(false);
  };

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
        <div style={{ fontSize: 16, fontWeight: 650 }}>To-Do <span style={{ color: "#A9B2C3", fontSize: 11, fontWeight: 600 }}>({completedCount}/{tasks.length})</span></div>
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          style={{ height: 28, padding: "0 10px", borderRadius: 10, background: "rgba(255,255,255,.08)", border: "1px solid rgba(125,190,255,.22)", color: "#F2F6FF", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F2F6FF" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          Add Task
        </button>
      </div>
      <div style={{ height: 3, flexShrink: 0, borderRadius: 999, background: "rgba(255,255,255,.05)", marginTop: 10, overflow: "hidden" }}>
        <div style={{ width: `${progress}%`, height: "100%", borderRadius: "inherit", background: "#6366F1", transition: "width 180ms ease" }} />
      </div>
      {isAdding && (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 6, flexShrink: 0, marginTop: 10 }}>
          <input
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setTitle("");
                setIsAdding(false);
              }
            }}
            aria-label="Task title"
            placeholder="What needs to be done?"
            maxLength={120}
            style={{ minWidth: 0, flex: 1, height: 32, padding: "0 10px", borderRadius: 9, border: "1px solid rgba(125,190,255,.24)", outline: "none", background: "rgba(6,12,35,.48)", color: "#F2F6FF", fontSize: 11 }}
          />
          <button
            type="submit"
            disabled={!title.trim()}
            style={{ height: 32, padding: "0 10px", borderRadius: 9, border: "1px solid rgba(99,102,241,.42)", background: "#4F46E5", color: "#FFFFFF", fontSize: 11, fontWeight: 600, cursor: title.trim() ? "pointer" : "default", opacity: title.trim() ? 1 : 0.5 }}
          >
            Add
          </button>
        </form>
      )}
      <div className="noscroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", marginTop: 10, display: "flex", flexDirection: "column", gap: 6, scrollSnapType: "y mandatory" }}>
        {tasks.length === 0 && (
          <div style={{ flex: 1, minHeight: 90, display: "flex", alignItems: "center", justifyContent: "center", color: "#7C8698", fontSize: 11, textAlign: "center" }}>
            No tasks yet. Add one for today.
          </div>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="nested-card-hover"
            role="checkbox"
            aria-checked={task.done}
            tabIndex={0}
            onClick={task.toggle}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                task.toggle();
              }
            }}
            style={{ minHeight: 48, flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "0 10px", borderRadius: 10, background: "rgba(255,255,255,.03)", cursor: "pointer", scrollSnapAlign: "start" }}
          >
            <div aria-hidden="true" style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, border: `1px solid ${task.done ? "#6366F1" : "rgba(255,255,255,.35)"}`, background: task.done ? "#6366F1" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {task.done && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textDecoration: task.done ? "line-through" : "none", color: task.done ? "#7C8698" : "#F2F6FF" }}>{task.title}</div>
            </div>
            <div style={{ fontSize: 10, color: "#7C8698", flexShrink: 0 }}>{task.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
