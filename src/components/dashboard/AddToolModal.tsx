"use client";

import { useState } from "react";
import { DEFAULT_TOOL_ICON_KEY } from "@/lib/dashboard/tool-icons";
import type { Accent } from "@/lib/dashboard/types";
import type { ShellState } from "@/hooks/useShellState";
import { useCustomTools } from "@/hooks/useCustomTools";
import CategorySelector from "./CategorySelector";
import ToolIconPicker from "./ToolIconPicker";

type Status = "idle" | "suggesting" | "ready" | "error";

function suggestNameFromUrl(url: string): string {
  try {
    const withScheme = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const host = new URL(withScheme).hostname.replace(/^www\./, "");
    const base = host.split(".")[0] || host;
    return base
      .split(/[-_]/)
      .filter(Boolean)
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");
  } catch {
    return "";
  }
}

const statusCopy: Record<Status, string> = {
  idle: "",
  suggesting: "Getting details…",
  ready: "Details ready",
  error: "Couldn’t get details. You can enter them manually.",
};

function emptyForm() {
  return {
    url: "",
    name: "",
    description: "",
    tags: new Set<string>(),
    aliasInput: "",
    aliases: [] as string[],
    source: "internal" as "internal" | "external",
    iconKey: DEFAULT_TOOL_ICON_KEY,
    accent: "blue" as Accent,
    pin: false,
  };
}

export default function AddToolModal({ state }: { state: ShellState }) {
  if (!state.addToolOpen) return null;
  return <AddToolForm closeAddTool={state.closeAddTool} />;
}

function AddToolForm({ closeAddTool }: { closeAddTool: () => void }) {
  const ADD_TOOL_SECONDARY_BACKGROUND = "rgba(99, 102, 241, 0.14)";
  const ADD_TOOL_SECONDARY_BORDER = "1px solid rgba(129, 140, 248, 0.34)";
  const ADD_TOOL_SECONDARY_TEXT = "#e0e7ff";
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<Status>("idle");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const { categories, addCategory, addTool } = useCustomTools();

  const getDetails = () => {
    if (!form.url.trim()) {
      setStatus("error");
      return;
    }
    setStatus("suggesting");
    setTimeout(() => {
      const suggested = suggestNameFromUrl(form.url);
      if (!suggested) {
        setStatus("error");
        return;
      }
      setForm((f) => ({ ...f, name: f.name || suggested }));
      setStatus("ready");
    }, 600);
  };

  const toggleTag = (tag: string) => {
    setForm((f) => {
      const next = new Set(f.tags);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return { ...f, tags: next };
    });
  };

  const addAlias = () => {
    const value = form.aliasInput.trim();
    if (!value) return;
    setForm((f) =>
      f.aliases.some((alias) => alias.toLocaleLowerCase() === value.toLocaleLowerCase())
        ? { ...f, aliasInput: "" }
        : { ...f, aliases: [...f.aliases, value], aliasInput: "" },
    );
  };

  const removeAlias = (alias: string) => {
    setForm((f) => ({ ...f, aliases: f.aliases.filter((a) => a !== alias) }));
  };

  const handleSave = () => {
    setSaving(true);
    setSaveError("");
    try {
      addTool(
        {
          name: form.name,
          url: form.url,
          description: form.description,
          iconKey: form.iconKey,
          accent: form.accent,
          tags: [...form.tags],
          aliases: form.aliases,
          sourceType: form.source,
        },
        form.pin,
      );
      setSaving(false);
      closeAddTool();
    } catch (reason) {
      setSaving(false);
      setSaveError(reason instanceof Error ? reason.message : "Could not save tool.");
    }
  };

  return (
    <div
      onClick={closeAddTool}
      style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(2,6,23,.6)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "8vh 16px" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(600px,100%)",
          maxHeight: "84vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 20,
          background: "rgba(15,26,64,.94)",
          backdropFilter: "blur(20px) saturate(170%) brightness(1.2)",
          WebkitBackdropFilter: "blur(20px) saturate(170%) brightness(1.2)",
          border: "1px solid rgba(125,190,255,.24)",
          boxShadow: "0 24px 60px rgba(0,4,20,.35)",
          overflow: "hidden",
          color: "#F2F6FF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(125,190,255,.14)", flexShrink: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 650 }}>Add Tool</div>
          <button onClick={closeAddTool} aria-label="Close" style={{ width: 28, height: 28, borderRadius: 8, background: ADD_TOOL_SECONDARY_BACKGROUND, border: ADD_TOOL_SECONDARY_BORDER, color: ADD_TOOL_SECONDARY_TEXT, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="noscroll" style={{ flex: 1, overflowY: "auto", padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Tool URL + Get details */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#A9B2C3", marginBottom: 6 }}>Tool URL</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://example.com"
                style={{ flex: 1, minWidth: 0, height: 40, borderRadius: 11, background: "rgba(255,255,255,.04)", border: "1px solid rgba(186,230,253,0.16)", padding: "0 12px", fontSize: 13, color: "#F2F6FF", outline: "none" }}
              />
              <button
                onClick={getDetails}
                disabled={status === "suggesting"}
                style={{ height: 40, padding: "0 16px", borderRadius: 11, background: ADD_TOOL_SECONDARY_BACKGROUND, border: ADD_TOOL_SECONDARY_BORDER, color: ADD_TOOL_SECONDARY_TEXT, fontSize: 13, fontWeight: 600, cursor: status === "suggesting" ? "default" : "pointer", flexShrink: 0, opacity: status === "suggesting" ? 0.6 : 1 }}
              >
                Get details
              </button>
            </div>
            {status !== "idle" && (
              <div style={{ fontSize: 12, marginTop: 6, color: status === "error" ? "#F59E0B" : status === "ready" ? "#4ADE80" : "#A9B2C3" }}>
                {statusCopy[status]}
              </div>
            )}
          </div>

          {/* Icon and accent picker */}
          <ToolIconPicker
            iconKey={form.iconKey}
            accent={form.accent}
            onIconChange={(iconKey) => setForm((f) => ({ ...f, iconKey }))}
            onAccentChange={(accent) => setForm((f) => ({ ...f, accent }))}
          />

          {/* Name */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#A9B2C3", marginBottom: 6 }}>Name</div>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value.slice(0, 60) }))}
              placeholder="Tool name"
              style={{ width: "100%", boxSizing: "border-box", height: 40, borderRadius: 11, background: "rgba(255,255,255,.04)", border: "1px solid rgba(186,230,253,0.16)", padding: "0 12px", fontSize: 13, color: "#F2F6FF", outline: "none" }}
            />
          </div>

          {/* Description */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#A9B2C3", marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
              <span>Description</span>
              <span style={{ color: "#7C8698", fontWeight: 500 }}>{form.description.length}/160</span>
            </div>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value.slice(0, 160) }))}
              placeholder="Short description (optional)"
              rows={2}
              style={{ width: "100%", boxSizing: "border-box", borderRadius: 11, background: "rgba(255,255,255,.04)", border: "1px solid rgba(186,230,253,0.16)", padding: "10px 12px", fontSize: 13, color: "#F2F6FF", outline: "none", resize: "none", fontFamily: "inherit" }}
            />
          </div>

          <CategorySelector
            categories={categories}
            selected={form.tags}
            onToggle={toggleTag}
            onCreate={(name) => addCategory(name).category}
          />

          {/* Aliases */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#A9B2C3", marginBottom: 6 }}>Aliases</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={form.aliasInput}
                onChange={(e) => setForm((f) => ({ ...f, aliasInput: e.target.value.slice(0, 32) }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addAlias();
                  }
                }}
                placeholder="Add an alias and press Enter"
                disabled={form.aliases.length >= 10}
                style={{ flex: 1, minWidth: 0, height: 36, borderRadius: 10, background: "rgba(255,255,255,.04)", border: "1px solid rgba(186,230,253,0.16)", padding: "0 12px", fontSize: 12, color: "#F2F6FF", outline: "none" }}
              />
              <button onClick={addAlias} style={{ height: 36, padding: "0 12px", borderRadius: 10, background: ADD_TOOL_SECONDARY_BACKGROUND, border: ADD_TOOL_SECONDARY_BORDER, color: ADD_TOOL_SECONDARY_TEXT, fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
                Add
              </button>
            </div>
            {form.aliases.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                {form.aliases.map((alias) => (
                  <span key={alias} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 6px 4px 10px", borderRadius: 9, fontSize: 11, fontWeight: 600, background: "rgba(103,232,249,.14)", color: "#67E8F9" }}>
                    {alias}
                    <button onClick={() => removeAlias(alias)} aria-label={`Remove alias ${alias}`} style={{ width: 16, height: 16, border: "none", background: "rgba(255,255,255,.1)", borderRadius: "50%", color: "#67E8F9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, fontSize: 10, lineHeight: 1 }}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Source */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#A9B2C3", marginBottom: 6 }}>Source</div>
            <div style={{ display: "flex", background: ADD_TOOL_SECONDARY_BACKGROUND, borderRadius: 10, padding: 2, gap: 2, width: "fit-content" }}>
              <div onClick={() => setForm((f) => ({ ...f, source: "internal" }))} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", background: form.source === "internal" ? "rgba(99, 102, 241, 0.34)" : "transparent", color: ADD_TOOL_SECONDARY_TEXT }}>
                Owned
              </div>
              <div onClick={() => setForm((f) => ({ ...f, source: "external" }))} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", background: form.source === "external" ? "rgba(99, 102, 241, 0.34)" : "transparent", color: ADD_TOOL_SECONDARY_TEXT }}>
                Third-party
              </div>
            </div>
          </div>

          {/* Pin to Quick Access */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 11, background: "rgba(255,255,255,.03)" }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Pin to Quick Access</span>
            <button
              onClick={() => setForm((f) => ({ ...f, pin: !f.pin }))}
              aria-label="Toggle pin to Quick Access"
              style={{ width: 32, height: 19, borderRadius: 10, background: form.pin ? "rgba(59,130,246,.5)" : "rgba(255,255,255,.12)", position: "relative", flexShrink: 0, border: "none", cursor: "pointer", padding: 0 }}
            >
              <div style={{ width: 15, height: 15, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: form.pin ? "15px" : "2px", transition: "left .15s" }} />
            </button>
          </div>
          {saveError ? <div role="alert" style={{ color: "#FDA4AF", fontSize: 12 }}>{saveError}</div> : null}
        </div>

        <div style={{ display: "flex", gap: 10, padding: "16px 22px", borderTop: "1px solid rgba(125,190,255,.14)", flexShrink: 0 }}>
          <button onClick={closeAddTool} style={{ flex: 1, height: 42, borderRadius: 11, background: ADD_TOOL_SECONDARY_BACKGROUND, border: ADD_TOOL_SECONDARY_BORDER, color: ADD_TOOL_SECONDARY_TEXT, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, height: 42, borderRadius: 11, background: "linear-gradient(120deg,#3B82F6,#8B5CF6)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving…" : "Save tool"}
          </button>
        </div>
      </div>
    </div>
  );
}
