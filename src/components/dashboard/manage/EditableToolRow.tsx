"use client";

import { Check, LoaderCircle, Search, Star, Trash2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { isManagePopoverOpen } from "@/hooks/manage-page-state";
import { useExclusiveManagePopover } from "@/hooks/useExclusiveManagePopover";
import { ACCENTS } from "@/lib/dashboard/mock-data";
import type { ToolRowDraft } from "@/lib/dashboard/tool-library";
import { getToolIcon, searchToolIcons } from "@/lib/dashboard/tool-icons";
import type { Accent, DecoratedTool } from "@/lib/dashboard/types";
import DynamicToolIcon from "../DynamicToolIcon";
import CategoryCollector from "./CategoryCollector";
import ToolColorPicker from "./ToolColorPicker";

function InlineIconPicker({
  toolName,
  value,
  color,
  disabled,
  onChange,
}: {
  toolName: string;
  value: string;
  color: string;
  disabled: boolean;
  onChange: (iconKey: string) => void;
}) {
  const { open, toggle, close: closePopover } = useExclusiveManagePopover();
  const [query, setQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const matches = useMemo(() => searchToolIcons(query, "all").slice(0, 30), [query]);
  const selected = getToolIcon(value);
  const visibleOpen = isManagePopoverOpen(open, disabled);
  const close = () => {
    closePopover();
    setQuery("");
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <div className="inline-icon-picker" onKeyDown={(event) => {
      if (event.key === "Escape" && visibleOpen) {
        event.stopPropagation();
        close();
      }
    }}>
      <button
        ref={triggerRef}
        type="button"
        className="inline-icon-trigger"
        aria-label={`Choose icon for ${toolName}`}
        aria-haspopup="dialog"
        aria-expanded={visibleOpen}
        disabled={disabled}
        onClick={toggle}
        style={{ color }}
      >
        <DynamicToolIcon iconKey={selected.key} size={19} strokeWidth={1.8} aria-hidden="true" />
      </button>
      {visibleOpen && (
        <div className="inline-icon-popover" role="dialog" aria-label={`Icon picker for ${toolName}`}>
          <label className="inline-icon-search">
            <Search size={14} aria-hidden="true" />
            <span className="sr-only">Search icons for {toolName}</span>
            <input disabled={disabled} autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search icons" />
          </label>
          <div className="inline-icon-grid">
            {matches.map((icon) => (
              <button
                key={icon.key}
                type="button"
                title={icon.label}
                aria-label={`Use ${icon.label} for ${toolName}`}
                aria-pressed={icon.key === selected.key}
                disabled={disabled}
                onClick={() => {
                  onChange(icon.key);
                  close();
                }}
              >
                <DynamicToolIcon iconKey={icon.key} size={17} strokeWidth={1.8} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditableToolRow({
  tool,
  draft,
  aliasInput,
  categories,
  updating,
  onChange,
  onAliasInputChange,
  onSubmit,
  onDelete,
}: {
  tool: DecoratedTool;
  draft: ToolRowDraft;
  aliasInput: string;
  categories: readonly string[];
  updating: boolean;
  onChange: (partial: Partial<ToolRowDraft>) => void;
  onAliasInputChange: (value: string) => void;
  onSubmit: () => void;
  onDelete: () => void;
}) {
  const renderedColor = ACCENTS[draft.color as Accent] ?? draft.color;

  return (
      <tr className={updating ? "tool-library-row is-updating" : "tool-library-row"} aria-busy={updating}>
      <td>
        <InlineIconPicker
          key={updating ? "pending" : "ready"}
          toolName={tool.name}
          value={draft.iconKey}
          color={renderedColor}
          disabled={updating}
          onChange={(iconKey) => onChange({ iconKey })}
        />
      </td>
      <td>
        <ToolColorPicker
          key={updating ? "pending" : "ready"}
          toolName={tool.name}
          value={draft.color}
          disabled={updating}
          onChange={(color) => onChange({ color })}
        />
      </td>
      <td>
        <label className="tool-table-field">
          <span className="sr-only">Name for {tool.name}</span>
          <input disabled={updating} value={draft.name} onChange={(event) => onChange({ name: event.target.value })} />
        </label>
      </td>
      <td>
        <label className="tool-table-field">
          <span className="sr-only">Description for {tool.name}</span>
          <textarea disabled={updating} rows={1} value={draft.description} onChange={(event) => onChange({ description: event.target.value })} />
        </label>
      </td>
      <td>
        <CategoryCollector
          key={updating ? "pending" : "ready"}
          toolName={tool.name}
          categories={categories}
          selected={draft.tags}
          disabled={updating}
          onChange={(tags) => onChange({ tags })}
        />
      </td>
      <td>
        <label className="tool-table-field tool-link-field">
          <span className="sr-only">Link for {tool.name}</span>
          <input disabled={updating} type="url" inputMode="url" value={draft.url} onChange={(event) => onChange({ url: event.target.value })} />
        </label>
      </td>
      <td>
        <button
          type="button"
          role="switch"
          className="tool-pin-switch"
          aria-label={`Pin ${tool.name}`}
          aria-checked={draft.pinned}
          disabled={updating}
          onClick={() => onChange({ pinned: !draft.pinned })}
        >
          <span />
        </button>
      </td>
      <td>
        <button
          type="button"
          className="tool-favorite-button"
          aria-label={`${draft.favorite ? "Remove" : "Add"} ${tool.name} ${draft.favorite ? "from" : "to"} favorites`}
          aria-pressed={draft.favorite}
          disabled={updating}
          onClick={() => onChange({ favorite: !draft.favorite })}
        >
          <Star size={17} fill={draft.favorite ? "currentColor" : "none"} aria-hidden="true" />
        </button>
      </td>
      <td>
        <label className="tool-table-field">
          <span className="sr-only">Aliases for {tool.name}, separated by commas or Enter</span>
          <input
            disabled={updating}
            value={aliasInput}
            onChange={(event) => onAliasInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              const separated = aliasInput.trimEnd().endsWith(",") ? `${aliasInput} ` : `${aliasInput}, `;
              onAliasInputChange(separated);
            }}
          />
        </label>
      </td>
      <td>
        <div className="tool-row-actions">
          <button
            type="button"
            className="tool-update-button"
            aria-label={updating ? `Updating ${tool.name}` : `Update ${tool.name}`}
            disabled={updating}
            onClick={onSubmit}
          >
            {updating ? <LoaderCircle className="database-spinner" size={16} aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="tool-delete-button"
            aria-label={`Delete ${tool.name}`}
            title={`Delete ${tool.name}`}
            disabled={updating}
            onClick={onDelete}
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </td>
      </tr>
  );
}
