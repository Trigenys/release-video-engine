# Engineering Failure Memory

This file records significant regressions and near misses that should change future engineering behavior.

## 2026-09 — Creative landing redesign QA

### Context

The landing evolved from a generic AppFactory page into a visually richer creative-tech experience with:

- a layered release-transformation hero;
- a real-release showcase gallery;
- reusable motion;
- a horizontally scrollable mobile template selector;
- an interactive creative template explorer.

### Near miss: visual richness without automated viewport guardrails

**Risk:** large positioned hero elements, wide template previews and mobile horizontal selectors can introduce document-level overflow at 320px even when each component looks correct at common desktop widths.

**Root cause:** visual QA was initially performed feature-by-feature; there was no repository-level viewport invariant.

**Prevention:** Playwright now asserts that document `scrollWidth` never exceeds viewport width at 320px and 1440px. Intentional component-level horizontal scrolling remains allowed.

### Near miss: animation accessibility could regress silently

**Risk:** decorative entrance/floating motion can become uncomfortable or leave content hidden when reduced motion is requested.

**Root cause:** motion behavior was implemented correctly, but initially depended on code review rather than a browser-level regression test.

**Prevention:** Playwright emulates `prefers-reduced-motion: reduce` and asserts that decorative hero animation stops and reveal content is immediately visible.

### Near miss: conversion flow keyboard usability

**Risk:** a visually polished funnel can remain difficult to use without a pointer, especially after adding custom tabs and motion wrappers.

**Root cause:** focusability was present but not tested as an end-to-end conversion path.

**Prevention:** CI tabs from the primary CTA through the early-access fields, submits through the keyboard, and separately verifies arrow/Home/End behavior in the template explorer.

### Near miss: gallery media and layout shift

**Risk:** proof media can hurt the very conversion experience it is meant to strengthen.

**Root cause:** gallery previews were introduced after the original landing performance assumptions.

**Prevention:** showcase media remains lazy-loaded, CLS is measured in browser QA with a 0.1 ceiling, and web bundle budgets are enforced.

### Guardrails

The landing QA suite now covers:

- 320px and 1440px viewport overflow;
- keyboard conversion path;
- template-selector keyboard behavior;
- serious/critical axe findings;
- reduced motion;
- lazy showcase media;
- CLS <= 0.1;
- JS/CSS bundle budgets.

A failure in one of these checks blocks the QA workflow rather than relying on memory or visual inspection.
