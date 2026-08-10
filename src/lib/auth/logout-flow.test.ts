import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const clientUrl = new URL("./client.ts", import.meta.url);
const clientSource = existsSync(clientUrl) ? readFileSync(clientUrl, "utf8") : "";
const actionsSource = readFileSync(
  new URL("./actions.ts", import.meta.url),
  "utf8",
);
const dashboardSource = readFileSync(
  new URL("../../app/dashboard/page.tsx", import.meta.url),
  "utf8",
);
const shellSource = readFileSync(
  new URL("../../hooks/useShellState.ts", import.meta.url),
  "utf8",
);
const profileMenuSource = dashboardSource.slice(
  dashboardSource.indexOf("function ProfileMenu()"),
  dashboardSource.indexOf("function CommandPaletteDark("),
);
const topBarSource = dashboardSource.slice(
  dashboardSource.indexOf("function TopBar("),
  dashboardSource.indexOf("const timeZone ="),
);

test("dashboard logout uses the Auth.js client sign-out flow", () => {
  assert.match(clientSource, /^"use client";/);
  assert.match(clientSource, /import \{ signOut \} from "next-auth\/react"/);
  assert.match(clientSource, /signOut\(\{ redirectTo: "\/sign-in" \}\)/);
  assert.match(dashboardSource, /@\/lib\/auth\/client/);
  assert.match(shellSource, /@\/lib\/auth\/client/);
  assert.doesNotMatch(actionsSource, /export async function signOutFromApp\(\)/);
});

test("navbar profile menu uses the same proven client sign-out call as the sidebar", () => {
  assert.match(
    profileMenuSource,
    /<button[\s\S]*?type="button"[\s\S]*?onClick=\{\(\) => void signOutFromApp\(\)\}[\s\S]*?Logout[\s\S]*?<\/button>/,
  );
  assert.doesNotMatch(
    profileMenuSource,
    /setMenuOpen\(false\);[\s\S]{0,120}signOutFromApp\(\)/,
  );
  assert.match(
    topBarSource,
    /<header[\s\S]*?className="grid relative z-30 /,
  );
});
