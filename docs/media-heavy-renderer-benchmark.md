# Media-heavy renderer parity benchmark

Issue: #36  
Continues: #31  
Feeds: #7 and #8

## Question

The first Formbricks renderer benchmark proved that HyperFrames could consume the shared `ReleaseVideoSpec` and materially reduce render time for a text/card composition.

That was not enough evidence to promote it.

This gate asks whether the advantage survives when a release video behaves more like a real marketing asset.

## Shared input

Both engines consume:

`video/data/formbricksMediaHeavy.ts#formbricksMediaHeavyRelease`

That spec extends the existing Formbricks 6.0.1 pilot release rather than copying the product/release data.

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

All videos are 24 seconds at 30 fps.

## Measurements

Each render records:

- wall-clock duration;
- output bytes;
- user CPU seconds;
- system CPU seconds;
- maximum resident set size when `/usr/bin/time -v` is available.

The CI job writes renderer-specific JSON reports plus an automatically generated side-by-side comparison.

## Decision rule

Do not promote HyperFrames merely because it wins wall-clock time.

Promotion requires:

1. successful render in every output slot;
2. no screenshot crop/focal-point regression;
3. no font-loading regression;
4. audible deterministic audio;
5. readable timed captions;
6. French copy without layout breakage;
7. operational resource usage that does not erase the render-time benefit.

Until those checks pass, the previous decision remains:

`Remotion = stable baseline`  
`HyperFrames = experimental creative renderer`

## Results

CI run `36771151913` completed successfully with all eight MP4 outputs, both benchmark JSON reports and the generated comparison report.

### Wall-clock render time

| Format | Locale | Remotion | HyperFrames | HyperFrames speedup |
| --- | --- | ---: | ---: | ---: |
| 9:16 | EN | 47.019 s | 30.844 s | 1.52× |
| 1:1 | EN | 29.471 s | 23.228 s | 1.27× |
| 16:9 | EN | 37.157 s | 31.021 s | 1.20× |
| 16:9 | FR | 38.167 s | 31.945 s | 1.19× |
| **Total** |  | **151.814 s** | **117.038 s** | **1.30×** |

HyperFrames reduced total wall-clock render time by about **22.9%** in this media-heavy run.

The advantage is real, but substantially smaller than the earlier text/card benchmark where HyperFrames was roughly 2×–2.45× faster.

### Output size

- Remotion aggregate: **9.61 MiB**
- HyperFrames aggregate: **12.42 MiB**
- HyperFrames delta: **+29.3%**

The current encoder/settings are therefore not size-equivalent even though the visual target is equivalent. This is a production consideration, especially for social delivery and storage.

### Memory

- Remotion peak RSS, max single render: **1232.3 MiB**
- HyperFrames peak RSS, max single render: **534.9 MiB**
- HyperFrames peak-RSS delta: **-56.6%**

This is the strongest operational HyperFrames advantage in the media-heavy benchmark.

### CPU

- Remotion aggregate user + system CPU time: **116.97 s**
- HyperFrames aggregate user + system CPU time: **229.97 s**

HyperFrames used about **96.6% more CPU time** despite finishing sooner in wall-clock time. That suggests more parallel/active work rather than a simple across-the-board efficiency gain.

### Audio verification

Both sampled 16:9 EN outputs contain AAC audio at 48 kHz stereo.

The deterministic audio bed measured identically in both sampled outputs:

- mean volume: **-47.2 dB**
- max volume: **-35.0 dB**

This confirms that the audio path is present on both renderers rather than silently dropping media.

### Visual review

Representative frames were reviewed at 2 s, 8 s, 12 s and 20 s for EN and FR landscape outputs, plus 8 s crop checks for 9:16 and 1:1.

Observed:

- EN and FR copy remain inside the intended layout;
- timed captions remain readable in the sampled frames;
- the real public Formbricks screenshot renders in both engines;
- both renderers preserve the declared 50% × 43% focal point;
- HyperFrames uses a more aggressive full-frame `cover` crop in vertical, while Remotion keeps more screenshot chrome inside its framed media panel;
- that difference is an art-direction/layout difference, not a focal-point failure;
- no sampled frame showed clipping that invalidates the benchmark;
- HyperFrames check passed all four generated projects after removing real caption/text-zone overlaps rather than suppressing the validator.

Artifact: `formbricks-6.0.1-media-heavy-renderer-benchmark`  
Artifact ID: `11123787504`  
Artifact SHA-256: `74f6b88a8d2bb68e126dbb9e07f8dbe8283c3b866a174ddc896eb9a181b936d4`

## Decision — ADAPT remains

Do **not** promote HyperFrames to the sole/default renderer yet.

The media-heavy evidence strengthens the case for keeping HyperFrames available:

- faster wall-clock rendering;
- dramatically lower peak memory;
- deterministic screenshot, font, audio and caption handling;
- successful EN/FR localization;
- strong suitability for HTML/CSS/GSAP-driven creative templates.

But the same evidence also exposes trade-offs:

- the speed advantage shrinks materially once real media is involved;
- output files are about 29% larger with the current settings;
- CPU time is almost double Remotion in this run;
- the two engines naturally express crop/layout differently even when they share the same media contract.

Current operating decision:

`ReleaseVideoSpec`
- `Remotion` = stable baseline / resource-efficient CPU path
- `HyperFrames` = experimental creative renderer / lower-memory, faster-wall-time path

The next renderer decision should come from product economics in #8, including where renders will actually run and what wall time, CPU, memory, egress and storage cost there.
