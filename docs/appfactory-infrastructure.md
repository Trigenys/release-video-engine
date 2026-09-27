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

After the production deployment completes, check
`/api/early-access-health`. A healthy response has `ok: true` and
`binding: true`. Then manually run the AppFactory Infrastructure workflow
to verify persistence and idempotency. The workflow remains manual while
the production binding is first validated. Preview deployments do not
use the production D1 binding.

This Pages integration uses Cloudflare's Git deployment and does not need
a new Cloudflare API token or AppFactory's separate provisioning broker.
