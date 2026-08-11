import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentUrl = new URL("./DynamicToolIcon.tsx", import.meta.url);
const stylesUrl = new URL("./DynamicToolIcon.module.css", import.meta.url);

test("lazy-loads allowlisted Lucide icons with loading and error fallbacks", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /TOOL_ICON_LOADERS/);
  assert.doesNotMatch(source, /lucide-react\/dynamicIconImports/);
  assert.match(source, /getToolIcon/);
  assert.match(source, /lazy\(/);
  assert.match(source, /Suspense/);
  assert.match(source, /DEFAULT_TOOL_ICON_KEY/);
  assert.match(source, /componentDidCatch|getDerivedStateFromError/);
});

test("preserves icon dimensions while a dynamic chunk loads", async () => {
  const styles = await readFile(stylesUrl, "utf8");

  assert.match(styles, /display:\s*inline-block/);
  assert.match(styles, /width:\s*1em/);
  assert.match(styles, /height:\s*1em/);
});
