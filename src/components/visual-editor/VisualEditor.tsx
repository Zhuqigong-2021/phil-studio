"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import savedOverrides from "@/app/visual-editor.generated.json";

type StyleMap = Record<string, string>;
type Override = { styles: StyleMap; text?: string };
type OverrideFile = { version: 1; overrides: Record<string, Override> };

const editableProperties = [
  ["width", "Width"],
  ["height", "Height"],
  ["padding", "Padding"],
  ["margin", "Margin"],
  ["gap", "Gap"],
  ["color", "Text color"],
  ["backgroundColor", "Background"],
  ["fontSize", "Font size"],
  ["fontWeight", "Font weight"],
  ["borderRadius", "Radius"],
  ["backgroundPosition", "Background position"],
  ["objectPosition", "Image position"],
] as const;

function escapeSelector(value: string) {
  return CSS.escape(value);
}

function selectorFor(element: HTMLElement): string {
  if (element.id) return `#${escapeSelector(element.id)}`;
  const dataId = element.dataset.veId;
  if (dataId) return `[data-ve-id="${CSS.escape(dataId)}"]`;

  const parts: string[] = [];
  let node: HTMLElement | null = element;
  while (node && node !== document.body) {
    const parent: HTMLElement | null = node.parentElement;
    const tag = node.tagName.toLowerCase();
    if (!parent) {
      parts.unshift(tag);
      break;
    }
    const siblings = Array.from(parent.children).filter(
      (child) => child.tagName === node?.tagName,
    );
    const index = siblings.indexOf(node) + 1;
    parts.unshift(`${tag}:nth-of-type(${index})`);
    node = parent;
  }
  return `body > ${parts.join(" > ")}`;
}

function applyOverrides(file: OverrideFile) {
  for (const [selector, override] of Object.entries(file.overrides)) {
    let elements: NodeListOf<HTMLElement>;
    try {
      elements = document.querySelectorAll<HTMLElement>(selector);
    } catch {
      continue;
    }
    for (const element of elements) {
      if (override.text !== undefined) element.textContent = override.text;
    }
  }
}

export default function VisualEditor({ enabled }: { enabled: boolean }) {
  const initial = savedOverrides as OverrideFile;
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState<HTMLElement | null>(null);
  const [selector, setSelector] = useState("");
  const [styles, setStyles] = useState<StyleMap>({});
  const [dirtyStyles, setDirtyStyles] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [textDirty, setTextDirty] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [dragImage, setDragImage] = useState(false);
  const overridesRef = useRef<OverrideFile>(
    JSON.parse(JSON.stringify(initial)) as OverrideFile,
  );

  useEffect(() => {
    applyOverrides(initial);
  }, [initial]);

  useEffect(() => {
    if (!enabled || !active) return;
    const choose = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || target.closest("[data-ve-ui]")) return;
      event.preventDefault();
      event.stopPropagation();
      const nextSelector = selectorFor(target);
      const computed = getComputedStyle(target);
      const nextStyles: StyleMap = {};
      for (const [property] of editableProperties) {
        nextStyles[property] = computed[property as keyof CSSStyleDeclaration]?.toString() ?? "";
      }
      setSelected(target);
      setSelector(nextSelector);
      setStyles(nextStyles);
      setDirtyStyles([]);
      setText(target.childElementCount === 0 ? target.textContent ?? "" : "");
      setTextDirty(false);
      setStatus("Element selected");
    };
    document.addEventListener("click", choose, true);
    return () => document.removeEventListener("click", choose, true);
  }, [active, enabled]);

  useEffect(() => {
    if (!selected) return;
    selected.dataset.veSelected = "true";
    return () => {
      delete selected.dataset.veSelected;
    };
  }, [selected]);

  useEffect(() => {
    if (!dragImage || !selected) return;
    let originX = 0;
    let originY = 0;
    let startX = 50;
    let startY = 50;

    const down = (event: PointerEvent) => {
      if (event.target !== selected && !selected.contains(event.target as Node)) return;
      event.preventDefault();
      originX = event.clientX;
      originY = event.clientY;
      const value =
        selected.tagName === "IMG"
          ? getComputedStyle(selected).objectPosition
          : getComputedStyle(selected).backgroundPosition;
      const numbers = value.match(/-?\d+(?:\.\d+)?/g)?.map(Number);
      startX = numbers?.[0] ?? 50;
      startY = numbers?.[1] ?? 50;
      selected.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!selected.hasPointerCapture(event.pointerId)) return;
      const rect = selected.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, startX + ((event.clientX - originX) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, startY + ((event.clientY - originY) / rect.height) * 100));
      const property = selected.tagName === "IMG" ? "objectPosition" : "backgroundPosition";
      updateStyle(property, `${x.toFixed(1)}% ${y.toFixed(1)}%`);
    };
    selected.addEventListener("pointerdown", down);
    selected.addEventListener("pointermove", move);
    return () => {
      selected.removeEventListener("pointerdown", down);
      selected.removeEventListener("pointermove", move);
    };
  });

  const canEditText = useMemo(
    () => Boolean(selected && selected.childElementCount === 0),
    [selected],
  );

  function updateStyle(property: string, value: string) {
    setStyles((current) => ({ ...current, [property]: value }));
    setDirtyStyles((current) =>
      current.includes(property) ? current : [...current, property],
    );
    if (selected) selected.style.setProperty(
      property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
      value,
    );
  }

  function updateText(value: string) {
    setText(value);
    setTextDirty(true);
    if (selected && selected.childElementCount === 0) selected.textContent = value;
  }

  async function save() {
    if (!selected || !selector) return;
    const existing = overridesRef.current.overrides[selector] ?? { styles: {} };
    const changed = Object.fromEntries(
      dirtyStyles
        .map((property) => [property, styles[property]] as const)
        .filter(([, value]) => value.trim() !== ""),
    );
    overridesRef.current.overrides[selector] = {
      styles: { ...existing.styles, ...changed },
      ...(canEditText && textDirty ? { text } : existing.text !== undefined ? { text: existing.text } : {}),
    };
    setStatus("Saving...");
    const response = await fetch("/api/visual-editor", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(overridesRef.current),
    });
    const result = (await response.json()) as { ok?: boolean; error?: string };
    setStatus(result.ok ? "Saved to source files" : result.error ?? "Save failed");
  }

  async function resetSelected() {
    if (!selected || !selector) return;
    const existing = overridesRef.current.overrides[selector];
    delete overridesRef.current.overrides[selector];
    for (const property of Object.keys(existing?.styles ?? {})) {
      selected.style.removeProperty(
        property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
      );
    }
    setStyles({});
    setDirtyStyles([]);
    setStatus("Removing saved override...");
    const response = await fetch("/api/visual-editor", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(overridesRef.current),
    });
    setStatus(response.ok ? "Override removed; refresh to restore content" : "Reset failed");
  }

  if (!enabled) return null;

  return (
    <>
      <style>{`
        [data-ve-selected="true"] { outline: 2px solid #7c3aed !important; outline-offset: 2px !important; }
        [data-ve-drag="true"] { cursor: move !important; }
      `}</style>
      <button
        data-ve-ui
        type="button"
        onClick={() => setActive((value) => !value)}
        style={{
          position: "fixed", right: 16, bottom: 16, zIndex: 2147483647,
          border: 0, borderRadius: 999, padding: "10px 16px", color: "white",
          background: active ? "#7c3aed" : "#111827", boxShadow: "0 10px 30px #0006",
          font: "600 13px system-ui", cursor: "pointer",
        }}
      >
        {active ? "Editing ON" : "Visual Edit"}
      </button>

      {active && (
        <aside
          data-ve-ui
          style={{
            position: "fixed", top: 16, right: 16, zIndex: 2147483647,
            width: 300, maxHeight: "calc(100vh - 88px)", overflow: "auto",
            padding: 16, borderRadius: 16, color: "#e5e7eb", background: "#111827f2",
            border: "1px solid #ffffff24", boxShadow: "0 20px 60px #0008",
            font: "13px system-ui", backdropFilter: "blur(16px)",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Visual UI Editor</div>
          <div style={{ color: "#9ca3af", wordBreak: "break-all", marginBottom: 12 }}>
            {selector || "Click any page element"}
          </div>

          {selected && (
            <>
              {canEditText && (
                <label style={{ display: "grid", gap: 5, marginBottom: 10 }}>
                  <span>Text</span>
                  <textarea
                    value={text}
                    onChange={(event) => updateText(event.target.value)}
                    rows={3}
                    style={inputStyle}
                  />
                </label>
              )}

              {editableProperties.map(([property, label]) => (
                <label
                  key={property}
                  style={{ display: "grid", gridTemplateColumns: "112px 1fr", gap: 8, alignItems: "center", marginBottom: 7 }}
                >
                  <span>{label}</span>
                  <input
                    value={styles[property] ?? ""}
                    onChange={(event) => updateStyle(property, event.target.value)}
                    style={inputStyle}
                  />
                </label>
              ))}

              <button
                type="button"
                onClick={() => {
                  setDragImage((value) => !value);
                  selected.dataset.veDrag = (!dragImage).toString();
                }}
                style={buttonStyle}
              >
                {dragImage ? "Stop image drag" : "Drag background / image"}
              </button>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                <button type="button" onClick={save} style={{ ...buttonStyle, background: "#7c3aed" }}>Save</button>
                <button type="button" onClick={resetSelected} style={buttonStyle}>Reset</button>
              </div>
            </>
          )}
          <div style={{ color: "#a7f3d0", marginTop: 10 }}>{status}</div>
        </aside>
      )}
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #ffffff26",
  borderRadius: 7,
  padding: "7px 8px",
  color: "#f9fafb",
  background: "#030712",
  font: "12px ui-monospace, monospace",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #ffffff26",
  borderRadius: 8,
  padding: "8px 10px",
  color: "white",
  background: "#374151",
  cursor: "pointer",
  fontWeight: 600,
};
