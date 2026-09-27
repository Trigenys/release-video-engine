# Motion language

Release Video Engine uses a small native motion system rather than a third-party animation framework.

## Reuse-first decision

### Adopt
- CSS transitions, keyframes and custom properties for timing/easing.
- Browser `IntersectionObserver` for one-shot viewport reveals.
- `prefers-reduced-motion` for accessibility.

### Adapt
- Existing hero float animations and showcase hover behavior now consume shared motion tokens.

### Learn
A motion library such as Framer Motion would make orchestration easier, but the current landing does not need gesture physics, route transitions or complex timeline coordination. Adding one would increase bundle and API surface without a concrete product benefit.

### Build
Only one thin React primitive, `MotionReveal`, was added. It owns the viewport-observation behavior and leaves visual behavior in CSS.

## Tokens

Central tokens live in `src/motion/motion.css`:

- duration: fast / base / slow / float;
- easing: standard / emphasized;
- distance: small / medium / large;
- enter scale and hover scale.

No component should introduce arbitrary animation timings when an existing token fits.

## Interaction rules

- Motion supports hierarchy; it must not delay access to content.
- Hover motion is subtle and never required to reveal information.
- CTA press feedback is immediate.
- Section reveals run once.
- Decorative hero motion is disabled on reduced-motion systems.
- Mobile avoids hover-only movement and expensive scroll effects.

## Reduced motion

When `prefers-reduced-motion: reduce` is active:

- reveals render immediately;
- floating animations stop;
- hover/press transforms are removed;
- content remains fully visible and interactive.

## Performance

The motion system uses no scroll event listeners and no animation dependency. `IntersectionObserver` disconnects after the first reveal.
