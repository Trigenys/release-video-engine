# GitHub release ingestion

Release Video Engine ingests public GitHub repository metadata without requiring a GitHub credential for the MVP.

## Reuse-first decision

RAIDER ecosystem reconnaissance was done before implementation.

- GitHub's official REST API already exposes published releases and repository tags.
- Published releases and repository tags for public repositories can be read without authentication.
- GitHub Releases and regular Git tags are separate API concepts, so tags are treated as an explicit fallback rather than pretending they are releases.
- Zod validates untrusted GitHub responses and the normalized renderer-facing payload.

Decision: **Adopt** GitHub REST semantics and Zod validation; **Build** only the thin domain adapter Release Video Engine needs.

## Flow

```text
repository URL
    ↓
parse + validate owner/repo
    ↓
repository metadata
    ↓
requested tag? ── yes ─→ release by tag
    │                        ↓ 404
    │                     tag fallback
    no
    ↓
latest published release
    ↓ 404
latest Git tag fallback
    ↓
schema-validated normalized payload
```

The normalized payload records `release.source` as either `release` or `tag`, so fallback behavior is never hidden.

## Output

The normalized schema contains repository identity, release/tag metadata, a deterministic summary and 1–4 structured highlights suitable for the video contract.

Markdown formatting and links are removed before highlight extraction. The normalizer deliberately does not use an LLM.

## Errors

Actionable codes cover invalid URLs, missing repositories/releases, rate limiting, forbidden/private access, GitHub outages and schema drift.

## Live validation

`npm run validate:ingestion` checks the unauthenticated public flow against:

- `remotion-dev/remotion`;
- `vitejs/vite`;
- `fastapi/fastapi`.

It also verifies explicit release selection by tag.
