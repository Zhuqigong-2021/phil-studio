"use client";

import { Check, ChevronDown, Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { isManagePopoverOpen } from "@/hooks/manage-page-state";
import { useExclusiveManagePopover } from "@/hooks/useExclusiveManagePopover";

export default function CategoryCollector({
  toolName,
  categories,
  selected,
  disabled,
  onChange,
}: {
  toolName: string;
  categories: readonly string[];
  selected: readonly string[];
  disabled: boolean;
  onChange: (categories: string[]) => void;
}) {
  const { open, toggle, close: closePopover } = useExclusiveManagePopover();
  const [query, setQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return categories.filter((category) => category.toLocaleLowerCase().includes(normalized));
  }, [categories, query]);
  const visibleOpen = isManagePopoverOpen(open, disabled);

  const close = () => {
    closePopover();
    setQuery("");
    requestAnimationFrame(() => triggerRef.current?.focus());
  };
  const toggleCategory = (category: string) => {
    onChange(selected.includes(category)
      ? selected.filter((value) => value !== category)
      : [...selected, category]);
  };

  return (
    <div className="category-collector" onKeyDown={(event) => {
      if (event.key === "Escape" && visibleOpen) {
        event.stopPropagation();
        close();
      }
    }}>
      <button
        ref={triggerRef}
        type="button"
        className="category-collector-trigger"
        aria-label={`Choose categories for ${toolName}`}
        aria-haspopup="dialog"
        aria-expanded={visibleOpen}
        disabled={disabled}
        onClick={toggle}
      >
        <span className="category-chip-list">
          {selected.length
            ? selected.map((category) => <span className="category-chip" key={category}>{category}</span>)
            : <span className="category-placeholder">Choose…</span>}
        </span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {visibleOpen && (
        <div className="category-collector-popover" role="dialog" aria-label={`Choose categories for ${toolName}`}>
          <label className="category-search">
            <Search size={14} aria-hidden="true" />
            <span className="sr-only">Search categories for {toolName}</span>
            <input
              autoFocus
              disabled={disabled}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search categories"
            />
            {query && (
              <button type="button" disabled={disabled} aria-label="Clear category search" onClick={() => setQuery("")}>
                <X size={13} aria-hidden="true" />
              </button>
            )}
          </label>
          <div className="category-options" role="group" aria-label={`Categories for ${toolName}`}>
            {filtered.map((category) => {
              const checked = selected.includes(category);
              return (
                <label key={category} className="category-option">
                  <input
                    type="checkbox"
                    disabled={disabled}
                    checked={checked}
                    onChange={() => toggleCategory(category)}
                  />
                  <span className="category-checkbox" aria-hidden="true">{checked && <Check size={12} />}</span>
                  <span>{category}</span>
                </label>
              );
            })}
            {!filtered.length && <div className="category-empty">No matching categories</div>}
          </div>
        </div>
      )}
    </div>
  );
}
