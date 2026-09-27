# Funnel production readiness

Issue #6 is not complete until the early-access form persists a real submission in Cloudflare D1.

## Runtime contract

The Pages Function expects a D1 binding named:

`LEADS_DB`

The production health endpoint is:

`GET /api/early-access-health`

Healthy response:

```json
{
  "ok": true,
  "checks": {
    "binding": true,
    "leadsTable": true,
    "conversionTable": true
  }
}
```

A missing binding returns HTTP 503 with `configuration_error`.

A configured database without the required migration returns HTTP 503 with `database_not_ready`.

## Cloudflare setup

1. Create a D1 database, for example `release-video-engine-leads`.
2. Apply `migrations/0001_early_access.sql`.
3. Open the Release Video Engine Pages project.
4. Go to **Settings → Bindings → Add → D1 database bindings**.
5. Set the variable name to **LEADS_DB**.
6. Select the D1 database.
7. Configure the binding for production and preview as needed.
8. Redeploy so the binding reaches Pages Functions.

Do not commit account IDs, database IDs or secrets merely to make the binding work.

## Production smoke

Run the GitHub Actions workflow:

`Funnel production smoke`

It performs:

1. `GET /api/early-access-health`;
2. one early-access submission;
3. the same submission again;
4. verification that both calls return the same `leadId`.

The smoke identity is intentionally stable:

- email: `release-video-smoke@trigenys.invalid`
- repository: `Trigenys/release-video-engine`

Because the funnel is idempotent, repeated smoke runs reconcile the same lead instead of growing test data indefinitely.

## Proof of Done for issue #6

Close issue #6 only when:

- health endpoint returns HTTP 200 in production;
- production has `LEADS_DB` bound;
- the migration exists in that database;
- the smoke workflow is green against production;
- a normal browser form submission returns success and creates/reconciles the expected lead;
- `early_access_submitted` remains unique per lead.
