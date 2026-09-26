# Branded video template contract

This document defines the reusable boundary between release content, brand data and Remotion composition code.

The contract lives in `video/contracts/releaseVideo.ts`. Product-specific templates may extend `template.data`, but shared brand, release, CTA, media and motion fields must remain portable.

## Design goals

The contract follows Trigenys RAIDER principles:

- **Reusable** — one release payload can drive multiple templates and formats.
- **Agnostic** — no repository, product, owner or platform identity is hard-coded in the shared contract.
- **Idempotent** — the same resolved spec and render configuration must produce the same intended composition.
- **Durable** — new template data is additive; shared fields remain stable and versioned through `schemaVersion`.
- **Engineering-grade** — explicit defaults, validation and render-safe rules are documented.
- **Retroactive** — existing product-specific compositions can adopt the contract without being rewritten from scratch.

## Shared schema

A `ReleaseVideoSpec` contains:

- product identity and version;
- release title, summary and optional headline;
- brand logo, palette and typography;
- 1–4 structured highlights;
- optional screenshots;
- CTA and optional destination;
- motion profile;
- optional legal footer;
- a template identifier plus typed template-specific data.

The format is intentionally **not** embedded in the content payload. The same spec is paired at render time with one of the format presets:

- `vertical` — 1080 × 1920;
- `square` — 1080 × 1080;
- `landscape` — 1920 × 1080.

This keeps content stable while layout changes.

## Brand fallbacks

Missing optional brand assets must degrade intentionally:

- no logo → render the brand/product name as a text lockup;
- no custom palette → use the neutral Trigenys-safe default palette;
- no custom typography → use the default system-safe font stack;
- no secondary color → templates use primary/accent colors only.

A missing optional asset must never crash a render.

## Screenshot rules

Screenshots are optional.

Each screenshot may specify:

- `fit: "contain" | "cover"`;
- a normalized focal point `x/y` from 0 to 1.

Defaults:

- UI/product screenshots should prefer `contain` when legibility matters;
- editorial/product imagery may use `cover`;
- absent focal point defaults to center;
- when screenshots are missing, the template must use a designed fallback scene rather than an empty frame.

Templates must respect the safe inset of the selected aspect ratio.

## Text overflow rules

Templates must assume real release copy is messy.

- release title: target at most 2 lines;
- headline: target at most 3 lines;
- highlight value: target 1 line;
- highlight label: target at most 2 lines;
- CTA: target 1 line.

When text exceeds the preferred bounds, templates should first reduce font size within a documented minimum, then clamp. Silent overflow outside the safe area is not acceptable.

The renderer should log when clamping occurs once render instrumentation is introduced.

## Motion profiles

The contract supports:

- `reduced` — fades and minimal translation only;
- `calm` — restrained movement;
- `standard` — default product-marketing motion;
- `energetic` — stronger transitions and scale changes.

A template may interpret intensity differently, but `reduced` must avoid unnecessary zooms, large parallax and rapid movement.

## Template-specific data

A template can define additional typed data under `template.data`.

Example: the AgenFetch proof of concept needs language chips and provider names. Those are not universal release fields, so they belong to the AgenFetch template extension rather than the shared schema.

This prevents the global contract from becoming a dump of one-off product fields.

## Compatibility

`schemaVersion: "1"` is the current public contract.

Breaking changes require a schema-version change and migration notes. Additive optional fields may remain within version 1 when existing payloads continue to resolve safely.
