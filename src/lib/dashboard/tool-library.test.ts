import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeToolColor,
  paginateTools,
  parseAliasInput,
  rowDraftToPatch,
  toolToRowDraft,
} from "./tool-library.ts";
import { decorate } from "./mock-data.ts";

test("clamps pagination to the last page and reports its visible range", () => {
  assert.deepEqual(paginateTools(Array.from({ length: 24 }, (_, id) => ({ id })), 3, 10), {
    items: [{ id: 20 }, { id: 21 }, { id: 22 }, { id: 23 }],
    page: 3,
    pageCount: 3,
    start: 21,
    end: 24,
    total: 24,
  });
  assert.deepEqual(paginateTools([{ id: 1 }], 0, 0), {
    items: [{ id: 1 }], page: 1, pageCount: 1, start: 1, end: 1, total: 1,
  });
});

test("trims aliases and removes case-insensitive duplicates", () => {
  assert.deepEqual(parseAliasInput(" Docs, knowledge\n docs ,  "), ["Docs", "knowledge"]);
});

test("turns a tool into an editable row draft and back into an explicit patch", () => {
  const draft = toolToRowDraft({
    id: "notes",
    name: "Notes",
    url: "https://example.com/notes",
    description: "Team notes",
    mono: "NO",
    accent: "blue",
    tags: ["Work", "Productivity"],
    favorite: true,
    iconKey: "notebook",
    aliases: ["Docs"],
  }, true);

  assert.deepEqual(draft, {
    iconKey: "notebook", color: "blue", name: "Notes", description: "Team notes",
    tags: ["Work", "Productivity"], url: "https://example.com/notes",
    pinned: true, favorite: true, aliases: ["Docs"],
  });
  assert.deepEqual(rowDraftToPatch({ ...draft, tags: ["Productivity"] }), {
    iconKey: "notebook", accent: "blue", name: "Notes", description: "Team notes",
    tags: ["Productivity"], url: "https://example.com/notes",
    pinned: true, favorite: true, aliases: ["Docs"],
  });
});

test("keeps named accents and normalizes custom hexadecimal tool colors", () => {
  assert.equal(normalizeToolColor("teal"), "teal");
  assert.equal(normalizeToolColor("#22d3ee"), "#22D3EE");
  assert.throws(() => normalizeToolColor("#22D3E"), /color.*invalid/i);
  assert.throws(() => normalizeToolColor("rgb(34, 211, 238)"), /color.*invalid/i);
});

test("decorates a custom tool color with translucent RGB values", () => {
  assert.deepEqual(decorate({
    id: "custom", name: "Custom", mono: "CU", accent: "#22D3EE", tags: [], favorite: false,
  }), {
    id: "custom", name: "Custom", mono: "CU", accent: "#22D3EE", tags: [], favorite: false,
    color: "#22D3EE", accentSoft: "rgba(34,211,238,0.18)",
    accentBorder: "rgba(34,211,238,0.35)", tagStr: "",
  });
});
