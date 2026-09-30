# HyperFrames renderer spike

Issue: #31

## Purpose

Evaluate HyperFrames as an experimental second renderer for Release Video Engine without replacing Remotion before there is evidence.

The active benchmark is **Formbricks 6.0.1**, because it is also the first concierge-pilot artifact from issue #7. This gives both renderers the same real prospect, the same normalized release content and the same brand tokens.

AgenFetch 0.3.1 remains the regression/reference composition for the existing Remotion implementation.

## Contract boundary

HyperFrames does **not** introduce a second release-data schema.

`scripts/build-hyperframes-formbricks.mts` imports:

- `video/data/formbricks.ts#formbricksRelease`;
- `video/contracts/releaseVideo.ts`.

It resolves the same `ReleaseVideoSpec` used by the Remotion pipeline and emits engine-specific HTML compositions only at the renderer boundary.

```text
GitHub release
    ↓
ReleaseVideoSpec
    ├── Remotion renderer
    └── HyperFrames HTML adapter
```

## HyperFrames baseline

Pinned CLI: **0.8.62**

Runtime requirements verified from upstream documentation:

- Node.js 22+;
- FFmpeg;
- HTML/CSS/JS compositions;
- finite seekable GSAP timeline;
- deterministic MP4 rendering supported by the CLI.

The spike uses plain HTML/CSS plus GSAP and does not add hosted HeyGen generation services, avatars, TTS or paid media APIs.

## Formats

The same source spec generates:

- 9:16 — 1080×1920;
- 1:1 — 1080×1080;
- 16:9 — 1920×1080.

All three compositions are generated under `hyperframes/formbricks-6.0.1/`.

## Commands

```bash
npm run build:hyperframes:formbricks
npm run check:hyperframes:formbricks
npm run render:hyperframes:formbricks
```

The render command records duration and output bytes in:

`out/formbricks-6.0.1-hyperframes-benchmark.json`

## Evaluation matrix

Capture evidence for:

- visual flexibility;
- implementation effort;
- deterministic reproducibility;
- render duration;
- output size;
- CI reliability;
- local developer ergonomics;
- suitability for agent-authored templates;
- fonts/audio/screenshots/captions constraints;
- maintenance cost relative to Remotion.

## Decision status

**Pending render evidence.**

Do not remove or demote Remotion until the benchmark completes and an explicit Adopt / Adapt / Learn / Reject decision is recorded.
