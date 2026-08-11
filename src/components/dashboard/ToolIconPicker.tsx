"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { ACCENTS, ACCENT_RGB } from "@/lib/dashboard/mock-data";
import {
  getToolIcon,
  ICON_CATEGORIES,
  searchToolIcons,
  type ToolIconCategory,
  type ToolIconKey,
} from "@/lib/dashboard/tool-icons";
import type { Accent } from "@/lib/dashboard/types";
import DynamicToolIcon from "./DynamicToolIcon";
import styles from "./ToolIconPicker.module.css";

interface ToolIconPickerProps {
  iconKey: string;
  accent: Accent;
  onIconChange: (iconKey: ToolIconKey) => void;
  onAccentChange: (accent: Accent) => void;
}

const ACCENT_LIST = Object.keys(ACCENTS) as Accent[];

export default function ToolIconPicker({
  iconKey,
  accent,
  onIconChange,
  onAccentChange,
}: ToolIconPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<ToolIconCategory>("Popular");

  const selected = getToolIcon(iconKey);
  const rgb = ACCENT_RGB[accent];
  const visibleIcons = useMemo(
    () => searchToolIcons(query, query.trim() ? "all" : activeCategory),
    [activeCategory, query],
  );

  return (
    <section className={styles.picker} aria-label="Tool icon and color">
      <div className={styles.selectionRow}>
        <button
          type="button"
          className={styles.previewButton}
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="tool-icon-library"
          style={{
            background: `rgba(${rgb},0.18)`,
            borderColor: `rgba(${rgb},0.42)`,
            color: ACCENTS[accent],
          }}
        >
          <DynamicToolIcon
            iconKey={selected.key}
            size={21}
            strokeWidth={1.9}
            aria-hidden="true"
          />
          <span>{selected.label}</span>
          {open ? (
            <ChevronUp size={15} aria-hidden="true" />
          ) : (
            <ChevronDown size={15} aria-hidden="true" />
          )}
        </button>

        <div className={styles.colors} aria-label="Icon color">
          {ACCENT_LIST.map((color) => (
            <button
              key={color}
              type="button"
              className={styles.colorButton}
              onClick={() => onAccentChange(color)}
              aria-label={`Use ${color} icon color`}
              aria-pressed={accent === color}
              style={{ background: ACCENTS[color] }}
            />
          ))}
        </div>
      </div>

      {open && (
        <div id="tool-icon-library" className={styles.library}>
          <label className={styles.searchBox}>
            <Search size={16} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search icons"
              placeholder="Search 500 icons..."
            />
          </label>

          <div className={styles.browser}>
            <nav className={styles.categories} aria-label="Icon categories">
              {ICON_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category);
                    setQuery("");
                  }}
                  aria-pressed={!query && activeCategory === category}
                  className={
                    !query && activeCategory === category ? styles.activeCategory : ""
                  }
                >
                  {category}
                </button>
              ))}
            </nav>

            <div className={styles.results} aria-live="polite">
              {visibleIcons.length ? (
                <div className={styles.iconGrid}>
                  {visibleIcons.map((definition) => {
                    const isSelected = definition.key === selected.key;
                    return (
                      <button
                        key={definition.key}
                        type="button"
                        className={isSelected ? styles.selectedIcon : ""}
                        onClick={() => onIconChange(definition.key as ToolIconKey)}
                        aria-label={`Use ${definition.label} icon`}
                        aria-pressed={isSelected}
                        title={definition.label}
                        style={isSelected ? { color: ACCENTS[accent] } : undefined}
                      >
                        <DynamicToolIcon
                          iconKey={definition.key}
                          size={20}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.emptyState}>No icons found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
