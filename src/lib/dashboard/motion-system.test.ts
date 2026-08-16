import assert from "node:assert/strict";
import test from "node:test";

import {
  MOTION_EASINGS,
  MOTION_CURVES,
  getDashboardEntranceTimeline,
  getDrawerMotion,
  getListItemMotion,
  getOverlayMotion,
  getPanelPresenceMotion,
  getPanelMotion,
  getPopoverMotion,
  getQuickAccessItemMotion,
  getStatCountMotion,
  getStatCountTiming,
  shouldDismissDrawer,
} from "./motion-system.ts";

test("dashboard motion uses one cohesive easing vocabulary", () => {
  assert.deepEqual(MOTION_EASINGS, {
    out: "cubic-bezier(0.23, 1, 0.32, 1)",
    inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
    drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
  });
  assert.deepEqual(MOTION_CURVES.out, [0.23, 1, 0.32, 1]);
});

test("GSAP dashboard entrance is perceptible while reduced motion removes travel", () => {
  assert.deepEqual(getDashboardEntranceTimeline(false).navbar.from, {
    autoAlpha: 0,
    y: -32,
  });
  assert.deepEqual(getDashboardEntranceTimeline(true).navbar.from, {
    autoAlpha: 0,
  });
  assert.deepEqual(getPanelMotion(false, 1), {
    from: { autoAlpha: 0, x: 14 },
    to: { autoAlpha: 1, x: 0, duration: 0.24, ease: "power3.out" },
  });
  assert.deepEqual(getPanelMotion(false, -1).from, { autoAlpha: 0, x: -14 });
});

test("stat panels transfer focus without horizontal travel", () => {
  assert.deepEqual(getPanelPresenceMotion(false), {
    initial: {
      opacity: 0,
      y: 10,
      scale: 0.975,
      filter: "blur(7px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: {
      opacity: 0,
      y: 5,
      scale: 0.985,
      filter: "blur(5px)",
      transition: { duration: 0.3, ease: MOTION_CURVES.out },
    },
    transition: { duration: 0.62, delay: 0.06, ease: MOTION_CURVES.out },
  });
  assert.deepEqual(getPanelPresenceMotion(true), {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.14, ease: MOTION_CURVES.out },
  });
});

test("stat count-up preserves integer and percent formatting", () => {
  assert.deepEqual(getStatCountMotion("23"), { end: 23, suffix: "" });
  assert.deepEqual(getStatCountMotion("75%"), { end: 75, suffix: "%" });
  assert.equal(getStatCountMotion("--"), null);
});

test("initial stat count waits for the stats row entrance while later updates start immediately", () => {
  assert.deepEqual(getStatCountTiming(true), { delay: 0.22, duration: 0.75 });
  assert.deepEqual(getStatCountTiming(false), { delay: 0, duration: 0.45 });
});

test("Motion overlays and drawers exit faster than they enter", () => {
  assert.deepEqual(getOverlayMotion(false, "modal"), {
    backdrop: {
      initial: { opacity: 0, backdropFilter: "blur(0px)" },
      animate: { opacity: 1, backdropFilter: "blur(8px)" },
      exit: {
        opacity: 0,
        backdropFilter: "blur(0px)",
        transition: { duration: 0.22, ease: MOTION_CURVES.out },
      },
      transition: { duration: 0.34, ease: MOTION_CURVES.out },
    },
    surface: {
      initial: {
        opacity: 0,
        transform: "translateY(14px) scale(0.94)",
        filter: "blur(6px)",
      },
      animate: {
        opacity: 1,
        transform: "translateY(0px) scale(1)",
        filter: "blur(0px)",
      },
      exit: {
        opacity: 0,
        transform: "translateY(6px) scale(0.975)",
        filter: "blur(4px)",
        transition: { duration: 0.26, ease: MOTION_CURVES.out },
      },
      transition: { duration: 0.64, delay: 0.07, ease: MOTION_CURVES.out },
    },
  });
  assert.deepEqual(getOverlayMotion(false, "search").surface.initial, {
    opacity: 0,
    transform: "translateY(-10px) scale(0.965)",
    filter: "blur(6px)",
  });
  assert.deepEqual(getOverlayMotion(false, "search").surface.transition, {
    duration: 0.58,
    delay: 0.06,
    ease: MOTION_CURVES.out,
  });
  assert.deepEqual(
    getOverlayMotion(false, "search").backdrop,
    getOverlayMotion(false, "modal").backdrop,
  );
  assert.deepEqual(getOverlayMotion(true, "search").surface, {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.14, ease: MOTION_CURVES.out },
  });
  const drawerMotion = getDrawerMotion(false);
  assert.equal(drawerMotion.transition.duration, 0.26);
  assert.ok("transition" in drawerMotion.exit);
  assert.equal(drawerMotion.exit.transition?.duration, 0.2);
  assert.deepEqual(getDrawerMotion(true).initial, { opacity: 0 });
});

test("dynamic list rows use restrained layout and presence motion", () => {
  assert.deepEqual(getListItemMotion(false), {
    initial: { opacity: 0, transform: "translateY(6px) scale(0.97)" },
    animate: { opacity: 1, transform: "translateY(0px) scale(1)" },
    exit: {
      opacity: 0,
      transform: "translateY(-4px) scale(0.985)",
      transition: { duration: 0.15, ease: MOTION_CURVES.out },
    },
    transition: { duration: 0.2, ease: MOTION_CURVES.out },
  });
  assert.deepEqual(getListItemMotion(true).initial, { opacity: 0 });
});

test("occasional popovers and quick access items have crisp source-aware motion", () => {
  assert.deepEqual(getPopoverMotion(false).initial, {
    opacity: 0,
    transform: "translateY(-6px) scale(0.96)",
  });
  assert.equal(getPopoverMotion(false).transition.duration, 0.18);
  assert.equal(getQuickAccessItemMotion(false, 3).transition.delay ?? null, 0.09);
  assert.deepEqual(getQuickAccessItemMotion(true, 3).initial, { opacity: 0 });
});

test("mobile drawer dismisses from either committed distance or leftward velocity", () => {
  assert.equal(shouldDismissDrawer(-72, 0), true);
  assert.equal(shouldDismissDrawer(-12, -620), true);
  assert.equal(shouldDismissDrawer(-20, -120), false);
  assert.equal(shouldDismissDrawer(10, 700), false);
});
