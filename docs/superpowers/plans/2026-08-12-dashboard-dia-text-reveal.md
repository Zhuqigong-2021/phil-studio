# Dashboard Dia Text Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Animate “Bonjour, Phil !” with a one-time Magic UI-style Dia Text Reveal on the Dashboard while keeping the wave emoji stable.

**Architecture:** Add a focused client component for the reveal and a small session policy helper that decides whether the animation may play. The Dashboard heading composes the animated text and its existing emoji without changing the surrounding hero layout.

**Tech Stack:** React 19, Motion 13, Next.js 16 App Router, Node test runner.

## Global Constraints

- Animate only the Dashboard greeting and only once per browser session.
- Keep the wave emoji outside the animated gradient text.
- Settle to the existing white foreground and honor reduced-motion preferences.
- Do not change the Dashboard entrance, background, or layout animation.

---

### Task 1: One-time reveal policy

**Files:**
- Create: `src/components/magicui/dia-text-reveal-state.ts`
- Test: `src/components/magicui/dia-text-reveal-state.test.ts`

**Interfaces:**
- Produces: `claimDiaTextReveal(storage, key): boolean`

- [ ] Write tests proving the first claim succeeds, later claims fail, and unavailable storage safely falls back to animation.
- [ ] Run the focused test and verify it fails because the module is missing.
- [ ] Implement the minimal session-storage policy.
- [ ] Run the focused test and verify it passes.

### Task 2: Greeting reveal component

**Files:**
- Create: `src/components/magicui/DiaTextReveal.tsx`
- Modify: `src/app/dashboard/page.tsx`

**Interfaces:**
- Consumes: `claimDiaTextReveal(storage, key): boolean`
- Produces: `DiaTextReveal` with `text`, `colors`, `duration`, `delay`, `textColor`, and `sessionKey` props.

- [ ] Add the focused component contract test before implementation.
- [ ] Run it and verify the missing component/integration fails.
- [ ] Implement the gradient sweep with Motion and reduced-motion fallback.
- [ ] Replace only the greeting text, leaving the emoji as a sibling.
- [ ] Run focused tests, TypeScript, lint, and production build.

