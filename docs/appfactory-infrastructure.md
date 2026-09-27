# Release Video Engine Pages + D1

Production Pages binds `LEADS_DB` to the existing
`release-video-engine-leads` D1 database in `wrangler.jsonc`.
The UUID was supplied from the Cloudflare D1 database list in the
same account as the Pages project. The previously used value omitted
one character and caused a failed production deployment.

The first request to `/api/early-access-health` or the lead submission
endpoint applies the idempotent initial schema through the D1 binding.
`migrations/0001_early_access.sql` is the SQL reference. Future schema
changes need an explicit migration.

After each infrastructure configuration change, the AppFactory Infrastructure
workflow waits for production health, then verifies persistence and
idempotency. The workflow can also be run manually. A healthy response from
`/api/early-access-health` has `ok: true` and `binding: true`.
Preview deployments do not use the production D1 binding.

This Pages integration uses Cloudflare's Git deployment and does not need
a new Cloudflare API token or AppFactory's separate provisioning broker.
