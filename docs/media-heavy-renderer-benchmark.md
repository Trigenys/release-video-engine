# Media-heavy renderer parity benchmark

Issue: #36  
Continues: #31  
Feeds: #7 and #8

## Question

The first Formbricks renderer benchmark proved that HyperFrames could consume the shared `ReleaseVideoSpec` and materially reduce render time for a text/card composition.

This gate asks whether that advantage survives when a release video behaves more like a real marketing asset.

## Shared input

Both engines consume:

`video/data/formbricksMediaHeavy.ts#formbricksMediaHeavyRelease`

That spec extends the existing Formbricks 6.0.1 pilot release rather than copying product/release data.

## Media exercised

- real public Formbricks product screenshot sourced from the upstream repository README;
- explicit `cover` crop and focal point at 50% × 43%;
- Inter 400/700 from pinned `@fontsource/inter@5.3.0`;
- deterministic original 24-second WAV generated locally by the benchmark prep script;
- timed on-screen captions;
- English and French localized copy;
- GSAP vendored from the pinned npm dependency for HyperFrames rather than loaded from a CDN.

The screenshot is public product material. It is not represented as private customer material.

## Output matrix

Each renderer produces:

- 9:16 EN;
- 1:1 EN;
- 16:9 EN;
- 16:9 FR.

All videos target 24 seconds at 30 fps.

## Measurements

Each render records:

- wall-clock duration;
- output bytes;
- user CPU seconds;
- system CPU seconds;
- maximum resident set size when `/usr/bin/time -v` is available.

The CI job writes renderer-specific JSON reports plus an automatically generated side-by-side comparison.

## Final benchmark evidence

CI run `36772390469` completed successfully with all eight MP4 outputs, both benchmark JSON reports and the generated comparison report.

### Wall-clock render time

| Format | Locale | Remotion | HyperFrames | HyperFrames speedup |
| --- | --- | ---: | ---: | ---: |
| 9:16 | EN | 59.001 s | 39.099 s | 1.51× |
| 1:1 | EN | 35.824 s | 29.947 s | 1.20× |
| 16:9 | EN | 48.455 s | 40.241 s | 1.20× |
| 16:9 | FR | 49.449 s | 41.189 s | 1.20× |
| **Total** |  | **192.729 s** | **150.476 s** | **1.28×** |

HyperFrames reduced aggregate wall-clock render time by about **21.9%** in this media-heavy run.

That advantage is real but materially smaller than the earlier text/card benchmark, where HyperFrames was roughly 2×–2.45× faster.

### Output size

- Remotion aggregate: **9.61 MiB**
- HyperFrames aggregate: **12.43 MiB**
- HyperFrames delta: **+29.3%**

The current encoder/settings are therefore not size-equivalent. This matters for social delivery, storage and egress.

### Memory

- Remotion peak RSS, max single render: **1231.9 MiB**
- HyperFrames peak RSS, max single render: **516.5 MiB**
- HyperFrames peak-RSS delta: **-58.1%**

Lower peak memory is HyperFrames' strongest operational advantage in this media-heavy benchmark.

### CPU

- Remotion aggregate user + system CPU time: **143.11 s**
- HyperFrames aggregate user + system CPU time: **295.32 s**

HyperFrames used about **106.4% more CPU time** despite finishing sooner in wall-clock time. The wall-time improvement therefore should not be treated as an automatic cost reduction.

### Audio verification

`ffprobe` confirmed an AAC audio stream in **all eight** generated MP4s.

- HyperFrames outputs: 24.000 s
- Remotion outputs: 24.043 s

The deterministic audio path is therefore present in both renderers rather than being silently dropped.

### Visual review

Representative rendered frames were reviewed from the actual CI artifact:

- landscape EN at 3 s, 10 s and 20 s;
- landscape FR at 10 s;
- 9:16 EN at 10 s and 12 s;
- 1:1 EN at 10 s.

Observed:

- EN and FR copy remain inside the intended layouts;
- timed captions are readable in sampled scenes;
- the real public Formbricks screenshot renders in both engines;
- both preserve the declared 50% × 43% focal point;
- HyperFrames uses a more media-forward full-frame crop while Remotion keeps the screenshot inside a framed panel;
- that difference is art direction, not a focal-point failure;
- no sampled frame showed clipping that invalidates the benchmark;
- HyperFrames `check` passes all four generated projects after fixing a real scene-overlap error rather than suppressing the validator.

Artifact: `formbricks-6.0.1-media-heavy-renderer-benchmark`  
Artifact ID: `11123829071`  
Artifact SHA-256: `9f6b3ce8ec11e067de424523f0245e3f5bd29aa70b895538ee483fbfa050d5c5`

## Decision — ADAPT, promote HyperFrames to supported secondary renderer

Do **not** make HyperFrames the global/default renderer yet.

The media-heavy gate is strong enough to move HyperFrames beyond a throwaway experiment:

- it renders all required aspect-ratio/locale variants;
- screenshot, focal-point, bundled fonts, audio and captions work deterministically;
- visual quality remains valid across the sampled outputs;
- wall-clock time remains lower;
- peak memory is dramatically lower.

So the operating architecture becomes:

```text
ReleaseVideoSpec
    ├── Remotion     = default / stable baseline
    └── HyperFrames  = supported opt-in creative renderer
```

HyperFrames is a good candidate when rapid wall-clock rendering, lower peak memory or HTML/CSS/GSAP-heavy creative work matters.

Remotion remains the default while #8 translates the observed resource profile into actual unit economics. HyperFrames' ~2.06× CPU time and ~29% larger aggregate output could offset its wall-time and memory advantages depending on where renders run and how compute/storage/egress are billed.

The next decision is therefore economic, not functional: #36 establishes media-heavy parity; #8 determines whether HyperFrames should become the default renderer for new templates.
