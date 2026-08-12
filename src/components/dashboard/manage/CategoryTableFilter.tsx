"use client";

import { Check, ChevronDown, Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="category-table-filter">
      <button
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
      {open && (
        <div className="category-table-filter-popover" role="group" aria-label="Category filters">
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
        </div>
      )}
    </div>
  );
}
