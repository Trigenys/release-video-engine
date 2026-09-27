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


## 2026-09 — First landing QA run caught three real regressions

### 320px overflow

**Observed:** Chromium reported a 340px document width in a 320px viewport.

**Root cause:** the legacy global rule `body { min-width: 320px; }` combined badly with the mobile viewport/scrollbar model and defeated the page's narrower responsive calculations.

**Fix:** remove the body minimum width and let component/container constraints define responsive width.

**Guardrail:** the 320px browser invariant remains strict; the test was not weakened.

### Async form success state

**Observed:** the mocked early-access POST succeeded, but the success message never appeared.

**Root cause:** the submit handler used `event.currentTarget.reset()` after awaited network work. React event `currentTarget` is not a safe long-lived reference across the async boundary, so the success path could throw and fall into the generic error handler.

**Fix:** capture `const formElement = event.currentTarget` before the first await and use that stable DOM reference for FormData and reset.

**Guardrail:** the keyboard conversion test still requires the real success state after submit.

### Reduced-motion cascade conflict

**Observed:** `prefers-reduced-motion: reduce` still reported `source-float` as the active animation name.

**Root cause:** legacy hero animation declarations in `styles.css` came after the imported motion system and reintroduced `animation: source-float`. A global near-zero duration rule reduced the animation but did not remove it.

**Fix:** centralize float ownership in `motion/motion.css` and explicitly set decorative animation names to `none !important` under reduced motion.

**Guardrail:** browser QA continues to assert `animationName === "none"`; it does not accept merely tiny animation durations.


### Mobile template tab scroller leaked into document width

**Observed:** after removing the global body minimum width, the document still measured 340px in a 320px viewport. Diagnostic output identified off-screen `.template-tab` descendants as the source.

**Root cause:** the intentionally horizontally scrollable tab row lived inside a grid item with the default min-content sizing behavior. The children were allowed to extend for local scrolling, but the grid item itself was not explicitly shrinkable.

**Fix:** constrain the tab grid item and mobile scrollport with `min-width: 0`, `max-width: 100%`, `width: 100%` and local `overflow-x: auto`.

**Guardrail:** mobile QA now separately verifies that the tab row has internal horizontal overflow while its own bounding box remains inside the viewport. Intentional component scrolling is allowed; document-level scrolling is not.


### Mobile selector changed from horizontal scroller to compact grid

**Observed:** even after constraining the horizontal tab scrollport, Chromium still reported a 340px document width at a 320px viewport. The failing descendants remained the template-selector tabs.

**Decision:** stop forcing horizontal scrolling at the smallest breakpoint. At <= 620px the selector now becomes a compact 2x2 grid, with secondary descriptions hidden and all four directions visible at once.

**Why:** the scroller added interaction complexity without enough mobile value. The grid is simpler, more discoverable and removes the overflow class of failure entirely.

**Guardrail:** the mobile QA now requires the selector and every tab to remain inside the viewport with no internal horizontal overflow.
