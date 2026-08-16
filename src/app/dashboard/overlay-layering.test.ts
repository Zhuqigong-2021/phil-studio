import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Add Tool overlay is portaled outside the GSAP-transformed hero section", () => {
  const source = readFileSync("src/app/dashboard/page.tsx", "utf8");
  const heroStart = source.indexOf("function HeroSection()");
  const statsStart = source.indexOf("function StatsRow(");
  const heroSource = source.slice(heroStart, statsStart);

  assert.match(
    heroSource,
    /createPortal\([\s\S]*?<AddToolModal[\s\S]*?document\.body,\s*\)/,
  );
});

test("command palette is portaled above every transformed dashboard layer", () => {
  const source = readFileSync("src/app/dashboard/page.tsx", "utf8");
  const searchStart = source.indexOf("function GlobalSearchBar(");
  const brandStart = source.indexOf("function BrandMark(");
  const searchSource = source.slice(searchStart, brandStart);

  assert.match(
    searchSource,
    /createPortal\([\s\S]*?<CommandPaletteDark[\s\S]*?document\.body,\s*\)/,
  );
  assert.match(source, /className="dashboard-motion-root dashboard-overlay-backdrop fixed inset-0 z-\[100\]/);
  assert.match(source, /zIndex: 120/);
  assert.match(source, /getOverlayMotion\(Boolean\(useReducedMotion\(\)\), "search"\)/);
  assert.match(source, /<motion\.div[\s\S]*?\.\.\.overlayMotion\.backdrop/);
  assert.match(source, /data-search-palette-surface[\s\S]*?\.\.\.overlayMotion\.surface/);
});

test("sidebar items and their active layer share explicit rounded corners", () => {
  const source = readFileSync("src/app/dashboard/page.tsx", "utf8");
  const navStart = source.indexOf("function NavItem(");
  const weatherStart = source.indexOf("function WeatherModalDark(");
  const navSource = source.slice(navStart, weatherStart);

  assert.match(navSource, /const radius = emphasized \? 11 : 9/);
  assert.equal(navSource.match(/borderRadius: radius/g)?.length, 2);
});

test("mobile Dashboard navigation closes the drawer and returns from Manage", () => {
  const source = readFileSync("src/app/dashboard/page.tsx", "utf8");
  const drawerStart = source.indexOf("function MobileNavDrawer(");
  const sidebarStart = source.indexOf("function Sidebar(", drawerStart);
  const drawerSource = source.slice(drawerStart, sidebarStart);

  assert.match(
    drawerSource,
    /label="Dashboard"[\s\S]*?onClick=\{\(\) => \{[\s\S]*?onClose\(\);[\s\S]*?router\.push\("\/dashboard"\)/,
  );
});
