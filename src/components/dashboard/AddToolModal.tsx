"use client";

import "@/app/dashboard/dashboard.css";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LoaderCircle, X } from "lucide-react";
import { useRef, useState, type CSSProperties } from "react";
import type { useCustomTools } from "@/hooks/useCustomTools";
import {
  createAddToolSubmissionGuard,
  runAddToolSubmission,
} from "@/lib/dashboard/add-tool-submission";
import { getListItemMotion, getOverlayMotion, getPopoverMotion } from "@/lib/dashboard/motion-system";
import { publishDatabaseToast } from "@/lib/dashboard/tool-mutations";
import { DEFAULT_TOOL_ICON_KEY } from "@/lib/dashboard/tool-icons";
import type { Accent } from "@/lib/dashboard/types";
import CategorySelector from "./CategorySelector";
import ToolIconPicker from "./ToolIconPicker";

type AddToolStatus = "idle" | "suggesting" | "ready" | "error";

export type AddToolWorkspace = Pick<
  ReturnType<typeof useCustomTools>,
  "categories" | "addCategory" | "addTool"
>;

const addToolStatusCopy: Record<AddToolStatus, string> = {
  idle: "",
  suggesting: "Getting details…",
  ready: "Details ready",
  error: "Couldn't get details. You can enter them manually.",
};

function suggestNameFromUrl(url: string): string {
  try {
    const withScheme = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const host = new URL(withScheme).hostname.replace(/^www\./, "");
    const base = host.split(".")[0] || host;
    return base
      .split(/[-_]/)
      .filter(Boolean)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  } catch {
    return "";
  }
}

function emptyAddToolForm() {
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

export default function AddToolModal({
  open,
  onClose,
  workspace,
}: {
  open: boolean;
  onClose: () => void;
  workspace: AddToolWorkspace;
}) {
  return (
    <AnimatePresence>
      {open && <AddToolForm closeAddTool={onClose} workspace={workspace} />}
    </AnimatePresence>
  );
}

function AddToolForm({
  closeAddTool,
  workspace,
}: {
  closeAddTool: () => void;
  workspace: AddToolWorkspace;
}) {
  const ADD_TOOL_SECONDARY_BACKGROUND = "rgba(99, 102, 241, 0.14)";
  const ADD_TOOL_SECONDARY_BORDER = "1px solid rgba(129, 140, 248, 0.34)";
  const ADD_TOOL_SECONDARY_TEXT = "#e0e7ff";
  const reduceMotion = Boolean(useReducedMotion());
  const overlayMotion = getOverlayMotion(reduceMotion);
  const popoverMotion = getPopoverMotion(reduceMotion);
  const listItemMotion = getListItemMotion(reduceMotion);
  const [form, setForm] = useState(emptyAddToolForm);
  const [status, setStatus] = useState<AddToolStatus>("idle");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const submissionGuard = useRef(createAddToolSubmissionGuard());
  const { categories, addCategory, addTool } = workspace;

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
      setForm((current) => ({ ...current, name: current.name || suggested }));
      setStatus("ready");
    }, 600);
  };

  const toggleTag = (tag: string) => {
    setForm((current) => {
      const next = new Set(current.tags);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return { ...current, tags: next };
    });
  };

  const addAlias = () => {
    const value = form.aliasInput.trim();
    if (!value) return;
    setForm((current) =>
      current.aliases.some((alias) => alias.toLocaleLowerCase() === value.toLocaleLowerCase())
        ? { ...current, aliasInput: "" }
        : { ...current, aliases: [...current.aliases, value], aliasInput: "" },
    );
  };

  const removeAlias = (alias: string) => {
    setForm((current) => ({
      ...current,
      aliases: current.aliases.filter((item) => item !== alias),
    }));
  };

  const handleSave = async () => {
    await runAddToolSubmission({
      guard: submissionGuard.current,
      toolName: form.name,
      save: async () => {
        await addTool(
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
      },
      setPending: setSaving,
      setError: setSaveError,
      close: closeAddTool,
      publish: publishDatabaseToast,
    });
  };

  const fieldClass =
    "w-full box-border h-[40px] rounded-[11px] px-3 text-[13px] text-[#f2f4fa] outline-none bg-[rgba(255,255,255,0.05)]";
  const fieldStyle: CSSProperties = {
    border: "1px solid rgba(160,110,255,0.2)",
  };

  return (
    <motion.div
      {...overlayMotion.backdrop}
      onClick={closeAddTool}
      className="dashboard-motion-root dashboard-overlay-backdrop fixed inset-0 z-[90] flex items-start justify-center"
      style={{ background: "rgba(2,6,23,0.6)", padding: "8vh 16px" }}
    >
      <motion.div
        {...overlayMotion.surface}
        onClick={(event) => event.stopPropagation()}
        className="glass-shine-card rounded-2xl overflow-hidden flex flex-col"
        style={{
          width: "min(600px,100%)",
          maxHeight: "84vh",
          background: "rgba(20,16,48,0.94)",
          backdropFilter: "blur(20px) saturate(170%) brightness(1.2)",
          border: "1px solid rgba(160,110,255,0.24)",
          boxShadow: "0 24px 60px rgba(0,4,20,0.4)",
        }}
      >
        <div
          className="flex items-center justify-between px-[22px] py-[18px] flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(160,110,255,0.14)" }}
        >
          <div className="text-[#f2f4fa] text-[17px] font-semibold">Add Tool</div>
          <button
            type="button"
            onClick={closeAddTool}
            aria-label="Close"
            className="flex items-center justify-center rounded-[8px]"
            style={{
              width: 28,
              height: 28,
              background: ADD_TOOL_SECONDARY_BACKGROUND,
              border: ADD_TOOL_SECONDARY_BORDER,
              color: ADD_TOOL_SECONDARY_TEXT,
            }}
          >
            <X style={{ width: 14, height: 14 }} strokeWidth={2} />
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto p-[22px] flex flex-col gap-4 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          <div>
            <div className="text-[11px] font-semibold text-[#9aa3be] mb-[6px]">Tool URL</div>
            <div className="flex gap-2">
              <input
                value={form.url}
                onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
                placeholder="https://example.com"
                className={fieldClass}
                style={fieldStyle}
              />
              <button
                type="button"
                onClick={getDetails}
                disabled={status === "suggesting"}
                className="h-[40px] px-4 rounded-[11px] text-[13px] font-semibold flex-shrink-0"
                style={{
                  background: ADD_TOOL_SECONDARY_BACKGROUND,
                  border: ADD_TOOL_SECONDARY_BORDER,
                  color: ADD_TOOL_SECONDARY_TEXT,
                  opacity: status === "suggesting" ? 0.6 : 1,
                  cursor: status === "suggesting" ? "default" : "pointer",
                }}
              >
                Get details
              </button>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              {status !== "idle" && (
                <motion.div
                  key={status}
                  {...popoverMotion}
                  className="text-[12px] mt-[6px]"
                  style={{
                    color:
                      status === "error"
                        ? "#f0b429"
                        : status === "ready"
                          ? "#4ade80"
                          : "#9aa3be",
                  }}
                >
                  {addToolStatusCopy[status]}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ToolIconPicker
            iconKey={form.iconKey}
            accent={form.accent}
            onIconChange={(iconKey) => setForm((current) => ({ ...current, iconKey }))}
            onAccentChange={(accent) => setForm((current) => ({ ...current, accent }))}
          />

          <div>
            <div className="text-[11px] font-semibold text-[#9aa3be] mb-[6px]">Name</div>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({
                ...current,
                name: event.target.value.slice(0, 60),
              }))}
              placeholder="Tool name"
              className={fieldClass}
              style={fieldStyle}
            />
          </div>

          <div>
            <div className="text-[11px] font-semibold text-[#9aa3be] mb-[6px] flex justify-between">
              <span>Description</span>
              <span className="text-[#7c8698] font-medium">{form.description.length}/160</span>
            </div>
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({
                ...current,
                description: event.target.value.slice(0, 160),
              }))}
              placeholder="Short description (optional)"
              rows={2}
              className="w-full box-border rounded-[11px] px-3 py-[10px] text-[13px] text-[#f2f4fa] outline-none resize-none bg-[rgba(255,255,255,0.05)]"
              style={{
                border: "1px solid rgba(160,110,255,0.2)",
                fontFamily: "inherit",
              }}
            />
          </div>

          <CategorySelector
            categories={categories}
            selected={form.tags}
            onToggle={toggleTag}
            onCreate={async (name) => (await addCategory(name)).category}
          />

          <div>
            <div className="text-[11px] font-semibold text-[#9aa3be] mb-[6px]">Aliases</div>
            <div className="flex gap-2">
              <input
                value={form.aliasInput}
                onChange={(event) => setForm((current) => ({
                  ...current,
                  aliasInput: event.target.value.slice(0, 32),
                }))}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault();
                    addAlias();
                  }
                }}
                placeholder="Add an alias and press Enter"
                disabled={form.aliases.length >= 10}
                className="flex-1 min-w-0 h-[36px] rounded-[10px] px-3 text-[12px] text-[#f2f4fa] outline-none bg-[rgba(255,255,255,0.05)]"
                style={{ border: "1px solid rgba(160,110,255,0.2)" }}
              />
              <button
                type="button"
                onClick={addAlias}
                className="h-[36px] px-3 rounded-[10px] text-[12px] font-semibold flex-shrink-0"
                style={{
                  background: ADD_TOOL_SECONDARY_BACKGROUND,
                  border: ADD_TOOL_SECONDARY_BORDER,
                  color: ADD_TOOL_SECONDARY_TEXT,
                }}
              >
                Add
              </button>
            </div>
            {form.aliases.length > 0 && (
              <div className="flex gap-[6px] flex-wrap mt-2">
                <AnimatePresence initial={false}>
                  {form.aliases.map((alias) => (
                    <motion.span
                      key={alias}
                      layout={!reduceMotion}
                      {...listItemMotion}
                      className="flex items-center gap-[6px] rounded-[9px] pl-[10px] pr-[4px] py-[4px] text-[11px] font-semibold"
                      style={{ background: "rgba(103,232,249,0.14)", color: "#67e8f9" }}
                    >
                      {alias}
                      <button
                        type="button"
                        onClick={() => removeAlias(alias)}
                        aria-label={`Remove alias ${alias}`}
                        className="flex items-center justify-center rounded-full"
                        style={{
                          width: 16,
                          height: 16,
                          border: "none",
                          background: "rgba(255,255,255,0.1)",
                          color: "#67e8f9",
                          fontSize: 10,
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div>
            <div className="text-[11px] font-semibold text-[#9aa3be] mb-[6px]">Source</div>
            <div
              className="flex rounded-[10px] p-[2px] gap-[2px] w-fit"
              style={{ background: ADD_TOOL_SECONDARY_BACKGROUND }}
            >
              <div
                onClick={() => setForm((current) => ({ ...current, source: "internal" }))}
                className="ui-choice rounded-[8px] px-[14px] py-[6px] text-[12px] font-semibold cursor-pointer"
                style={{
                  background: form.source === "internal" ? "rgba(99, 102, 241, 0.34)" : "transparent",
                  color: ADD_TOOL_SECONDARY_TEXT,
                }}
              >
                Owned
              </div>
              <div
                onClick={() => setForm((current) => ({ ...current, source: "external" }))}
                className="ui-choice rounded-[8px] px-[14px] py-[6px] text-[12px] font-semibold cursor-pointer"
                style={{
                  background: form.source === "external" ? "rgba(99, 102, 241, 0.34)" : "transparent",
                  color: ADD_TOOL_SECONDARY_TEXT,
                }}
              >
                Third-party
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-between rounded-[11px] px-3 py-[10px]"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <span className="text-[12px] font-semibold text-[#f2f4fa]">Pin to Quick Access</span>
            <button
              type="button"
              onClick={() => setForm((current) => ({ ...current, pin: !current.pin }))}
              aria-label="Toggle pin to Quick Access"
              className="relative flex-shrink-0 rounded-[10px]"
              style={{
                width: 32,
                height: 19,
                background: form.pin ? "rgba(160,110,255,0.55)" : "rgba(255,255,255,0.12)",
                border: "none",
              }}
            >
              <div
                className="absolute rounded-full bg-white"
                style={{
                  width: 15,
                  height: 15,
                  top: 2,
                  left: form.pin ? 15 : 2,
                  transition: "left 0.15s",
                }}
              />
            </button>
          </div>
          {saveError ? <div role="alert" className="text-[12px] text-[#fda4af]">{saveError}</div> : null}
        </div>

        <div
          className="flex gap-[10px] px-[22px] py-4 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(160,110,255,0.14)" }}
        >
          <button
            type="button"
            onClick={closeAddTool}
            className="flex-1 h-[42px] rounded-[11px] text-[13px] font-semibold"
            style={{
              background: ADD_TOOL_SECONDARY_BACKGROUND,
              border: ADD_TOOL_SECONDARY_BORDER,
              color: ADD_TOOL_SECONDARY_TEXT,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            aria-busy={saving}
            className="flex-1 h-[42px] rounded-[11px] text-white text-[13px] font-semibold flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(120deg, #7255db, #a86cff)",
              border: "none",
              opacity: saving ? 0.7 : 1,
              cursor: saving ? "default" : "pointer",
            }}
          >
            {saving ? (
              <span role="status" className="flex items-center justify-center gap-2">
                <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                Saving…
              </span>
            ) : "Save tool"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
