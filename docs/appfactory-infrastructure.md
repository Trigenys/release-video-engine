# Release Video Engine Pages + D1

The production Pages project currently has no verified `LEADS_DB` binding.
The health endpoint returns `configuration_error` until a D1 database is
bound to the production Pages project. Lead submissions cannot persist until
then.

The previous `wrangler.jsonc` used the database ID
`f3c90df-e846-4b69-8ce3-644048e2b89f`, which is malformed (35 characters)
and came from an unverified bootstrap script. It has been removed to allow
Pages deployments to proceed. Do not guess a missing digit or use the D1
database belonging to the separate AppFactory Project Automation broker.

To complete setup, determine whether `release-video-engine-leads` actually
exists in the Cloudflare account used by this Pages project. Create it if
necessary; obtain its real database ID from Cloudflare. Bind that database
as `LEADS_DB` to the production Pages project using a verified configuration
or Cloudflare's Pages settings, then deploy and check
`/api/early-access-health`. The Functions code initializes the initial
schema on first use through the D1 binding. The SQL reference is
`migrations/0001_early_access.sql`; later changes require explicit migrations.

The GitHub infrastructure workflow is manual until the binding is verified.
After a healthy production response, run it to verify persistence and
idempotency. Its previous automatic trigger produced repeated failures while
the required binding was absent. AppFactory's separate Cloudflare API token
does not have the required D1 permissions; no new token has been added here.
