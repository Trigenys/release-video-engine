# Early-access funnel

The landing page is designed to validate demand before Release Video Engine grows into a self-serve SaaS.

## What is captured

The form asks only for:

- work email;
- public GitHub repository URL;
- release cadence;
- optional `utm_source` and `utm_campaign` attribution from the landing URL.

No tracking pixel, IP address, full referrer URL or user-agent fingerprint is stored.

## Persistence

The endpoint is a Cloudflare Pages Function at:

`POST /api/early-access`

It requires a D1 binding named `LEADS_DB`.

Apply `migrations/0001_early_access.sql` to the D1 database before production traffic.

The lead table uses a normalized email + canonical repository URL idempotency key. Re-submitting the same lead updates cadence/attribution instead of creating a duplicate.

A first-party conversion row is stored once per lead as:

`early_access_submitted`

This makes the conversion count measurable without third-party analytics cookies.

## Cloudflare setup

Create a D1 database from the Cloudflare dashboard or Wrangler, apply the migration, then bind it to the Pages project as `LEADS_DB`.

For production, verify:

1. the Pages deployment includes the `functions/` directory;
2. `LEADS_DB` exists in Preview and Production environments;
3. the migration is applied to both environments if they use separate databases;
4. a real form submission persists and returns HTTP 200;
5. the same email/repository submitted twice still creates only one conversion event.

## Funnel hypothesis

Primary message:

> Ship the release. Get the launch video.

Primary audience:

- SaaS founders;
- developer-tool teams;
- small product teams shipping frequently.

The page uses the real AgenFetch 0.3.1 proof instead of fabricated customer logos, testimonials or performance claims.
