# Dashboard Tool Library Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/manage` the expanded management state of the real Dashboard shell and fit all desktop table operations in the visible content area.

**Architecture:** Export a reusable Dashboard page view that accepts an optional main-content surface. The `/dashboard` route uses the default surface; `/manage` supplies `ManageContent`, so both routes share the exact root, background, navigation, responsive behavior, and Toast viewport. Keep database state in the existing manage hook.

**Tech Stack:** Next.js App Router 16.2.10, React, TypeScript, GSAP, CSS, Node test runner.

## Global Constraints

- Preserve all existing database mutation behavior.
- Do not introduce another page shell or background.
- Desktop Operation controls must be visible without horizontal scrolling.
- Use test-first changes and keep unrelated user files untouched.

---

### Task 1: Lock the shared-shell contract

**Files:**
- Create: `src/app/manage/dashboard-shell-integration.test.ts`
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/app/manage/page.tsx`

**Interfaces:**
- Produces: `DashboardPageView({ mainContent, activeRoute })`
- Consumes: existing `ManageContent` and `useManagePageState`

- [ ] Write a source contract test asserting `/manage` imports `DashboardPageView`, does not import `SecondaryPageShell`, and Dashboard renders supplied main content instead of Hero/Stats/BottomRow.
- [ ] Run the test and verify it fails because `/manage` still uses `SecondaryPageShell`.
- [ ] Add the minimal shared Dashboard view and route wiring.
- [ ] Run the test and existing Dashboard/manage tests until green.

### Task 2: Make Dashboard navigation route-aware

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Test: `src/app/manage/dashboard-shell-integration.test.ts`

**Interfaces:**
- Consumes: `activeRoute: "dashboard" | "manage"`
- Produces: route-correct Sidebar active state and Dashboard navigation

- [ ] Add failing assertions for Manage active state and Dashboard navigation back to `/dashboard`.
- [ ] Run RED.
- [ ] Pass the active route into desktop and mobile navigation and implement route navigation.
- [ ] Run GREEN.

### Task 3: Fit the management table in the Dashboard content region

**Files:**
- Modify: `src/styles/secondary.css`
- Test: `src/components/dashboard/manage/manage-controls.test.ts`

**Interfaces:**
- Produces: desktop grid/table layout with visible Operation column and narrow-screen overflow fallback

- [ ] Add a failing style contract rejecting the fixed `1660px` desktop table minimum and requiring desktop-fit column rules.
- [ ] Run RED.
- [ ] Replace the fixed desktop width with compact proportional columns and scope horizontal overflow to narrow screens.
- [ ] Run GREEN and focused management tests.

### Task 4: Verify the corrected experience

**Files:**
- Verify only; no production files unless a regression is found through a new failing test.

- [ ] Run focused tests, `npx tsc --noEmit`, lint, and production build.
- [ ] Open `/dashboard` and `/manage` in an authenticated browser.
- [ ] Verify the shared shell, no error overlay, no desktop horizontal table scrollbar, visible Operation buttons, transition, and mutation feedback.
- [ ] Commit only the intentional tracked files.
