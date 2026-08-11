"use client";

import { useRef, useState } from "react";
import { isManagePopoverOpen } from "@/hooks/manage-page-state";
import { ACCENTS } from "@/lib/dashboard/mock-data";
import { normalizeToolColor } from "@/lib/dashboard/tool-library";
import type { Accent, ToolColor } from "@/lib/dashboard/types";

const PALETTE = Object.keys(ACCENTS) as Accent[];

function renderedColor(color: ToolColor) {
  return ACCENTS[color as Accent] ?? color;
}

export default function ToolColorPicker({
  toolName,
  value,
  disabled,
  onChange,
}: {
  toolName: string;
  value: ToolColor;
  disabled: boolean;
  onChange: (color: ToolColor) => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const customValue = value.startsWith("#") ? value : renderedColor(value);
  const visibleOpen = isManagePopoverOpen(open, disabled);

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <div className="tool-color-picker" onKeyDown={(event) => {
      if (event.key === "Escape" && visibleOpen) {
        event.stopPropagation();
        close();
      }
    }}>
      <button
        ref={triggerRef}
        type="button"
        className="tool-color-trigger"
        aria-label={`Choose color for ${toolName}`}
        aria-haspopup="dialog"
        aria-expanded={visibleOpen}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="tool-color-swatch" style={{ background: renderedColor(value) }} />
      </button>
      {visibleOpen && (
        <div className="tool-color-popover" role="dialog" aria-label={`Color palette for ${toolName}`}>
          <div className="tool-color-palette">
            {PALETTE.map((color) => (
              <button
                key={color}
                type="button"
                className="tool-color-option"
                aria-label={`Use ${color} for ${toolName}`}
                aria-pressed={value === color}
                disabled={disabled}
                style={{ background: ACCENTS[color] }}
                onClick={() => {
                  onChange(color);
                  close();
                }}
              />
            ))}
          </div>
          <label className="tool-custom-color">
            <span>Custom</span>
            <input
              type="color"
              disabled={disabled}
              value={customValue}
              aria-label={`Custom color for ${toolName}`}
              onChange={(event) => onChange(normalizeToolColor(event.target.value))}
            />
          </label>
        </div>
      )}
    </div>
  );
}
