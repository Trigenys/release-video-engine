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

Pending CI benchmark evidence from this PR.
