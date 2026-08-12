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

test("manage uses a quiet non-photo background and an integrated library surface", async () => {
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
  assert.match(dashboardCss, /67, 56, 202/);
  assert.match(dashboardCss, /14, 165, 233/);
  assert.match(dashboardCss, /\.dashboard-tool-transition-overlay\s*\{[^}]*container-type:\s*inline-size/);
  assert.match(dashboardCss, /\.tool-library-morph-row\s*\{[^}]*font-size:\s*clamp\(/);
  assert.match(dashboardCss, /\.tool-library-morph-preview\s*\{[\s\S]*radial-gradient\(ellipse at 78% 4%[\s\S]*radial-gradient\(ellipse at 48% 92%/);
});

test("desktop tool library fits the Dashboard content width without a forced wide table", async () => {
  const css = await readFile(secondaryCssUrl, "utf8");

  assert.doesNotMatch(css, /\.tool-library-table\s*\{[\s\S]*?min-width:\s*1660px/);
  assert.match(css, /@media \(min-width: 900px\)[\s\S]*\.tool-library-table-scroll\s*\{[\s\S]*overflow-x:\s*hidden/);
  assert.match(css, /\.tool-library-table\s*\{[\s\S]*?table-layout:\s*fixed/);
  assert.match(css, /\.tool-library-header h1\s*\{[^}]*color:\s*#f2f6ff/);
});
