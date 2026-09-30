# HyperFrames renderer spike

Issue: #31

## Purpose

Evaluate HyperFrames as an experimental second renderer for Release Video Engine without replacing Remotion before there is evidence.

The benchmark uses **Formbricks 6.0.1**, which is also the first concierge-pilot artifact from issue #7. Both engines therefore consume the same real prospect, the same normalized release content and the same brand tokens.

AgenFetch 0.3.1 remains the regression/reference composition for the existing Remotion implementation.

## Contract boundary

HyperFrames does **not** introduce a second release-data schema.

`scripts/build-hyperframes-formbricks.mts` imports:

- `video/data/formbricks.ts#formbricksRelease`;
- `video/contracts/releaseVideo.ts`.

It resolves the same `ReleaseVideoSpec` used by the Remotion pipeline and emits engine-specific HTML only at the renderer boundary.

```text
GitHub release
    ↓
ReleaseVideoSpec
    ├── Remotion renderer
    └── HyperFrames HTML adapter
```

## Benchmark setup

HyperFrames CLI is pinned to **0.8.62**.

Both engines rendered the same 24-second release story at 30 fps in:

- 9:16 — 1080×1920;
- 1:1 — 1080×1080;
- 16:9 — 1920×1080.

The HyperFrames workflow verifies Node 24, installs FFmpeg, ensures the renderer browser, generates the compositions from the shared spec, runs `hyperframes check`, renders all three outputs and uploads a benchmark JSON with duration and bytes.

## Results

### Render time

| Format | Remotion | HyperFrames | HyperFrames delta |
| --- | ---: | ---: | ---: |
| 9:16 | 65.217 s | 23.368 s | 64.2% less time · 2.79× faster |
| 1:1 | 35.656 s | 15.831 s | 55.6% less time · 2.25× faster |
| 16:9 | 49.439 s | 22.027 s | 55.4% less time · 2.24× faster |
| **Total** | **150.312 s** | **61.226 s** | **59.3% less time · 2.45× faster** |

These measurements are from one GitHub-hosted CI benchmark and should not be generalized to all compositions or machines.

### Output size

| Format | Remotion | HyperFrames | HyperFrames delta |
| --- | ---: | ---: | ---: |
| 9:16 | 1,843,439 B | 1,870,690 B | +1.5% |
| 1:1 | 1,517,164 B | 1,389,123 B | -8.4% |
| 16:9 | 1,539,082 B | 1,711,526 B | +11.2% |
| **Total** | **4,899,685 B** | **4,971,339 B** | **+1.5%** |

For this benchmark the aggregate output-size difference is negligible compared with the render-time difference.

## Visual review

The benchmark deliberately keeps the same art direction and release content so the comparison tests the renderer boundary rather than two unrelated designs.

Observed from representative 3 s, 10 s and 20 s frames:

- both engines preserve the intended hierarchy, safe areas and brand palette;
- both produce readable 2×2 release-change cards in landscape;
- HyperFrames preserves the same CTA/outro structure and makes small typographic/layout differences expected from an HTML/CSS implementation;
- the HyperFrames benchmark carries explicit `HYPERFRAMES`, `PUBLIC RELEASE NOTES` and `CONCEPT PREVIEW` labels to make provenance obvious during review. Those labels are benchmark-only and should not appear in a prospect-facing final.

No visual defect was found that invalidates the benchmark.

## Capability and constraint check

### Motion

**Verified in the spike.** A finite paused GSAP timeline is registered synchronously and passed `hyperframes check` for all three aspect ratios.

### Images and screenshots

**Supported by the framework but not exercised in this text/card benchmark.** HyperFrames treats normal `<img>` and `<video>` elements as timed media clips. The next media-heavy benchmark should use real screenshots to verify crop/focal-point parity with `ReleaseVideoSpec`.

### Audio

**Supported but not exercised.** The framework supports `<audio>` and video audio with trim, gain and fades. Release Video Engine should benchmark voice/music only when the product requires it rather than adding audio to this renderer test.

### Captions

**Supported but not exercised.** HyperFrames has deterministic caption composition conventions and timestamp-driven caption tooling. Caption parity remains a follow-up before using HyperFrames for narrated/localized release videos.

### Fonts

**Viable with constraints.** HyperFrames includes a bundled font set and supports embedded `@font-face`. Brand fonts must be bundled or explicitly embedded for deterministic CI/cloud rendering; a font that merely exists on a developer machine is not a safe production dependency.

### Runtime dependencies

The CI runner did not include FFmpeg by default, so the spike explicitly installs it. This is a real deployment prerequisite, not a renderer defect.

The current generated composition loads GSAP from a pinned CDN URL. Before production use, vendor or package GSAP locally so deterministic rendering does not depend on third-party network availability.

## Engineering observations

### HyperFrames strengths observed

- consumed the existing `ReleaseVideoSpec` without a parallel product schema;
- HTML/CSS structure is natural for agent-authored visual templates;
- `hyperframes check` caught composition/runtime concerns before rendering;
- all three formats rendered successfully in CI;
- materially lower render time in this benchmark;
- output size remained comparable;
- normal web primitives make rapid visual iteration straightforward.

### Remotion strengths retained

- already proven in the repository and in AgenFetch;
- typed React composition model is integrated with the existing codebase;
- existing CI, composition registry and tests are mature relative to the new adapter;
- known behavior for the current deterministic pipeline;
- no migration risk is introduced by keeping it available.

## Decision — **ADAPT**

Do **not** replace Remotion globally.

Adopt HyperFrames as an **experimental second renderer / creative renderer** behind the existing `ReleaseVideoSpec` boundary.

Rationale:

1. The shared-contract architecture works: no product-data duplication was required.
2. HyperFrames completed the same three-format benchmark roughly 2.45× faster in this CI run.
3. Output sizes were effectively comparable in aggregate.
4. HTML/CSS/GSAP is promising for agent-generated creative templates.
5. The benchmark is still deliberately simple: it does not yet prove screenshot-heavy scenes, custom brand fonts, audio, captions or localization at production quality.

### Next gate before any primary-renderer migration

Run one media-heavy release through both engines with:

- real product screenshots;
- a custom/bundled brand font;
- at least one audio track;
- captions/localization;
- crop/focal-point rules;
- CPU/memory telemetry where practical.

If HyperFrames preserves visual parity and keeps a meaningful operational advantage there, reconsider whether it should become the default renderer for new templates.

Until then:

```text
ReleaseVideoSpec
    ├── Remotion     = stable baseline
    └── HyperFrames  = experimental creative renderer
```
