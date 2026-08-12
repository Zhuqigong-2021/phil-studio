"use client";

import { Check, ChevronDown, Filter } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface FilterPosition { top: number; left: number }

export default function CategoryTableFilter({
  categories,
  selected,
  onToggle,
  onClear,
}: {
  categories: readonly string[];
  selected: readonly string[];
  onToggle: (category: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<FilterPosition>({ top: 0, left: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = 218;
    setPosition({
      top: rect.bottom + 8,
      left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !popoverRef.current?.contains(target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  return (
    <div ref={rootRef} className="category-table-filter">
      <button
        ref={triggerRef}
        type="button"
        className="category-table-filter-trigger"
        aria-label="Filter tools by category"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>Category</span>
        <Filter size={12} aria-hidden="true" />
        {selected.length > 0 && <span className="category-table-filter-count">{selected.length}</span>}
        <ChevronDown size={12} aria-hidden="true" />
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div
          ref={popoverRef}
          className="category-table-filter-popover"
          role="group"
          aria-label="Category filters"
          style={{ position: "fixed", top: position.top, left: position.left }}
        >
          <button type="button" className="category-table-filter-all" aria-pressed={!selected.length} onClick={onClear}>
            <span>All categories</span>
            {!selected.length && <Check size={14} aria-hidden="true" />}
          </button>
          <div className="category-table-filter-options">
            {categories.map((category) => {
              const checked = selected.includes(category);
              return (
                <label key={category} className="category-table-filter-option">
                  <input type="checkbox" checked={checked} onChange={() => onToggle(category)} />
                  <span className="category-checkbox">{checked && <Check size={11} aria-hidden="true" />}</span>
                  <span>{category}</span>
                </label>
              );
            })}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
