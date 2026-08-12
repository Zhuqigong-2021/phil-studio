# Sign-in Dark Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the sign-in page dark by default while preserving the existing light theme for future use.

**Architecture:** Keep one authentication markup tree and move visual decisions into theme classes and CSS custom properties. Render the explicit `dark` class server-side so there is no hydration-sensitive browser theme detection.

**Tech Stack:** Next.js App Router, React server component, CSS, Node test runner.

## Global Constraints

- Google authentication behavior and server action remain unchanged.
- Both dark and light theme tokens must remain in the codebase.
- No user-facing theme switch is added.
- The sign-in page defaults to dark on the server.

---

### Task 1: Theme-aware sign-in surface

**Files:**
- Modify: `src/app/sign-in/page.tsx`
- Modify: `src/app/sign-in/sign-in.css`
- Create: `src/app/sign-in/sign-in-theme.test.ts`

**Interfaces:**
- Consumes: existing `signInWithGoogle` server action and `error` search parameter.
- Produces: `.signin-page.signin-theme-dark` as the default root and preserved `.signin-theme-light` variables.

- [ ] **Step 1: Write a failing source-contract test**

Assert that the page root defaults to `signin-theme-dark`, CSS contains both `.signin-theme-dark` and `.signin-theme-light`, and the Google form still uses `signInWithGoogle`.

- [ ] **Step 2: Verify the test fails**

Run `node --experimental-strip-types src/app/sign-in/sign-in-theme.test.ts` and confirm it fails because theme classes do not exist.

- [ ] **Step 3: Convert inline colors to shared semantic classes**

Keep the existing split structure and copy. Add semantic classes for the root, visual pane, brand, form card, error, Google button, and access note. Define dark Dashboard-aligned variables and preserve the original light values under `.signin-theme-light`.

- [ ] **Step 4: Verify behavior and responsive layout**

Run the focused test, `npx tsc --noEmit`, `npm run lint`, and `npm run build`. Check `/sign-in` at desktop and 390x844: no white page surface in dark mode, no horizontal overflow, Google button visible, and no framework overlay.

- [ ] **Step 5: Commit only sign-in theme files**

Commit the page, CSS, test, and this plan without staging unrelated workspace files.
