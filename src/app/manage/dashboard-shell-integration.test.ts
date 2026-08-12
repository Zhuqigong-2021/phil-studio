import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const managePageUrl = new URL("./page.tsx", import.meta.url);
const dashboardPageUrl = new URL("../dashboard/page.tsx", import.meta.url);
const secondaryCssUrl = new URL("../../styles/secondary.css", import.meta.url);
const dashboardCssUrl = new URL("../dashboard/dashboard.css", import.meta.url);
const manageContentUrl = new URL("../../components/dashboard/pages/ManageContent.tsx", import.meta.url);

test("manage renders inside the real Dashboard shell instead of SecondaryPageShell", async () => {
  const [managePage, dashboardPage] = await Promise.all([
    readFile(managePageUrl, "utf8"),
    readFile(dashboardPageUrl, "utf8"),
  ]);

  assert.doesNotMatch(managePage, /SecondaryPageShell/);
  assert.match(managePage, /DashboardPageView/);
  assert.match(managePage, /activeRoute="manage"/);
  assert.match(dashboardPage, /export function DashboardPageView/);
  assert.match(dashboardPage, /mainContent/);
  assert.match(dashboardPage, /const resolvedActiveNav = activeRoute === "manage" \? "Manage" : activeNav/);
});

test("manage and its transition preview share an unrecognizably blurred harbour atmosphere", async () => {
  const [managePage, dashboardPage, manageContent, dashboardCss] = await Promise.all([
    readFile(managePageUrl, "utf8"),
    readFile(dashboardPageUrl, "utf8"),
    readFile(manageContentUrl, "utf8"),
    readFile(dashboardCssUrl, "utf8"),
  ]);

  assert.match(managePage, /backgroundMode="manage"/);
  assert.match(dashboardPage, /backgroundMode === "manage"/);
  assert.doesNotMatch(manageContent, /secondary-page-flow-border/);
  assert.match(dashboardPage, /activeRoute === "manage" \|\| reduceMotion/);
  assert.match(dashboardPage, /data-tool-library-morph-preview/);
  assert.match(manageContent, /data-tool-library-surface/);
  assert.match(dashboardPage, /toolViews\.slice\(0, 10\)/);
  assert.match(dashboardPage, /manage-scene-background/);
  assert.match(dashboardCss, /\.manage-scene-background\s*\{/);
  assert.match(dashboardCss, /124, 58, 237/);
  assert.match(dashboardCss, /14, 165, 233/);
  assert.match(dashboardCss, /rgba\(124, 58, 237, \.10\)/);
  assert.doesNotMatch(dashboardCss, /rgba\(124, 58, 237, \.48\)/);
  assert.match(dashboardCss, /url\("\/backgrounds\/dark-old-port-background-layout-final\.png"\)/);
  assert.match(dashboardCss, /filter:\s*blur\(80px\) brightness\(\.48\) saturate\(\.86\)/);
  assert.match(dashboardCss, /\.tool-library-morph-preview::before,\s*\n\.manage-scene-background::before/);
  assert.match(dashboardCss, /\.tool-library-morph-preview::before,[\s\S]*?z-index:\s*0/);
  assert.match(dashboardCss, /\.tool-library-morph-preview::after,[\s\S]*?z-index:\s*1/);
  assert.match(dashboardCss, /\.tool-library-morph-preview\s*>\s*\*,[\s\S]*?z-index:\s*2/);
  assert.doesNotMatch(dashboardCss, /\.manage-scene-background::before[\s\S]*?z-index:\s*-2/);
  assert.match(dashboardCss, /\.dashboard-tool-transition-overlay\s*\{[^}]*container-type:\s*inline-size/);
  assert.match(dashboardCss, /\.tool-library-morph-row\s*\{[^}]*font-size:\s*clamp\(/);
  assert.match(dashboardCss, /\.tool-library-morph-preview::after,\s*\n\.manage-scene-background::after\s*\{[\s\S]*radial-gradient\(ellipse at 77% 8%[\s\S]*radial-gradient\(ellipse at 48% 88%/);
});

test("desktop tool library fits the Dashboard content width without a forced wide table", async () => {
  const css = await readFile(secondaryCssUrl, "utf8");

  assert.doesNotMatch(css, /\.tool-library-table\s*\{[\s\S]*?min-width:\s*1660px/);
  assert.match(css, /@media \(min-width: 900px\)[\s\S]*\.tool-library-table-scroll\s*\{[\s\S]*overflow-x:\s*hidden/);
  assert.match(css, /\.tool-library-table\s*\{[\s\S]*?table-layout:\s*fixed/);
  assert.match(css, /\.tool-library-header h1\s*\{[^}]*color:\s*#f2f6ff/);
});

test("pin switches reuse the Theme switch indigo palette", async () => {
  const css = await readFile(secondaryCssUrl, "utf8");

  assert.match(css, /\.tool-pin-switch\[aria-checked="true"\]\s*\{[^}]*background:\s*#7255db/);
  assert.match(css, /\.tool-pin-switch\[aria-checked="true"\] span\s*\{[^}]*background:\s*#cfc4ff/);
  assert.doesNotMatch(css, /\.tool-pin-switch\[aria-checked="true"\]\s*\{[^}]*rgba\(59, 130, 246/);
});
