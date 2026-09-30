# Render cost and unit economics

Issue: #8

## Purpose

Release Video Engine must know the infrastructure cost of a generated release video before self-serve pricing is introduced.

This model deliberately separates **product price** from **infrastructure cost**. It does not attempt to price operator time, support, payment processing, taxes, acquisition, sales or profit beyond showing gross-margin floors.

## Measured renderer inputs

The renderer observations come from the green media-heavy Formbricks 6.0.1 parity benchmark:

- workflow run: `36772390469`;
- artifact: `11123829071`;
- 24-second outputs;
- Remotion and HyperFrames;
- 9:16 EN, 1:1 EN, 16:9 EN and 16:9 FR;
- wall time, bytes, CPU user/system time and peak RSS captured per render.

Source data lives in:

`economics/render-benchmark-observations.json`

## Current infrastructure rates

Rates are configuration, not code.

### GitHub Actions reference compute

The conservative marginal-cost profile uses the paid standard Linux 2-core GitHub-hosted runner rate:

- **$0.006 / minute**;
- each job is rounded up to a whole billed minute.

Source: https://docs.github.com/en/billing/reference/actions-runner-pricing

Standard public-repository Actions usage can be free. That subsidy is intentionally excluded from product economics because a self-serve business should not depend on the current repository being public.

### Cloudflare R2 Standard

The storage/delivery profile uses:

- **$0.015 / GB-month** standard storage;
- **$4.50 / million** Class A operations;
- **$0.36 / million** Class B operations;
- **$0 / GB** direct R2 egress.

Source: https://developers.cloudflare.com/r2/pricing/

R2 free-tier allowances are also excluded. The model is intended to show marginal cost after free allowances are consumed.

## Retry model

The default retry probability is **5%**.

If each failed attempt is retried until success, expected attempts are:

`1 / (1 - retryProbability)`

At 5%, that is approximately **1.0526 attempts per successful release job**.

This applies retry overhead to compute. Failed outputs are not treated as successfully retained customer assets.

## Setup assumptions

Measured render duration and setup duration are separate.

The default setup allowances are:

- Remotion: **45 seconds / release job**;
- HyperFrames: **55 seconds / release job**.

These values are based on the observed green benchmark job's checkout/runtime/dependency preparation, with an additional browser/bootstrap allowance for HyperFrames. HyperFrames lint/check QA time is excluded from customer production rendering.

They are intentionally configurable in `economics/scenarios.json`.

## Default customer scenarios

The model includes:

1. one 9:16 EN output;
2. one 1:1 EN output;
3. one 16:9 EN output;
4. a three-format EN launch pack in one job;
5. a localized pack: three EN formats plus 16:9 FR;
6. monthly automation: four releases/month, each with the three EN formats.

Default delivery assumptions:

- retention: 30 days;
- 20 reads/downloads per output;
- external API cost: $0 today.

## Current modeled results

Using the measured benchmark data, 5% retry probability and the current paid GitHub Actions/R2 reference rates:

| Scenario | Remotion | HyperFrames | What drives the result |
| --- | ---: | ---: | --- |
| Single 9:16 EN | ≈ $0.0127 / release | ≈ $0.0127 / release | Both round to 2 billed minutes |
| Single 1:1 EN | ≈ $0.0127 / release | ≈ $0.0127 / release | Both round to 2 billed minutes |
| Single 16:9 EN | ≈ $0.0127 / release | ≈ $0.0127 / release | Both round to 2 billed minutes |
| 3-format EN launch pack | ≈ $0.0254 / release | ≈ $0.0191 / release | Remotion rounds to 4 min; HyperFrames to 3 min |
| Localized 4-output pack | ≈ $0.0255 / release | ≈ $0.0255 / release | Both round to 4 min |
| 4 releases/month × 3 formats | ≈ $0.1016 / customer-month | ≈ $0.0765 / customer-month | Repeated 4-min vs 3-min batch jobs |

The storage and request components are tiny at these output sizes. Minute rounding dominates the GitHub-hosted compute model.

At the monthly-automation scenario, the infrastructure-only price floor is roughly:

- 80% gross margin: **$0.51/month Remotion**, **$0.38/month HyperFrames**;
- 90% gross margin: **$1.02/month Remotion**, **$0.76/month HyperFrames**.

Those are **not recommended selling prices**. They demonstrate that current infrastructure is unlikely to be the primary pricing constraint; operator time, support, product value, acquisition and future media/AI services can dominate.

## Renderer economics decision

HyperFrames is **not universally cheaper**.

Under whole-minute GitHub Actions billing:

- individual formats tie because both engines land in the same billing bucket;
- the three-format pack benefits from HyperFrames' lower wall time;
- the localized four-output pack ties again because both land in the same four-minute bucket.

The media-heavy benchmark also showed HyperFrames using more CPU time despite lower wall time and lower peak RAM. A resource-metered container provider could therefore produce a different answer from GitHub's minute-based billing.

Current decision:

```text
Remotion     = default / stable baseline
HyperFrames  = supported opt-in creative renderer
```

Do not switch the global default based only on the GitHub Actions model. Re-evaluate when the production rendering provider is selected and plug that provider's vCPU/memory rates into the same model.

## Commands

```bash
npm run economics:validate
npm run economics:report
```

Generated files:

- `out/unit-economics-report.json`
- `out/unit-economics-report.md`

## What to update later

Update configuration, not formulas, when any of these change:

- production compute provider;
- renderer benchmarks;
- output bitrate/size;
- retry rate;
- retention;
- download volume;
- TTS/LLM/image/video API usage;
- storage provider;
- gross-margin target.

No billing implementation is introduced by this work.
