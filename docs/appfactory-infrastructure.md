# Release Video Engine Pages + D1

Production Pages and D1 are linked by `wrangler.jsonc` in this repository.
The Pages Git integration deploys `main`; `LEADS_DB` points to the existing
`release-video-engine-leads` database. Preview deployments have no production
D1 binding.

The first successful request to `/api/early-access-health` applies the
idempotent initial schema to the bound database using the D1 binding API. The
same initialization runs before a lead submission if health has not yet been
requested. `migrations/0001_early_access.sql` remains the SQL reference.
A later schema change needs an explicit migration; do not modify this initial
bootstrap and assume it upgrades populated databases.

The GitHub infrastructure workflow waits for production health and runs the
idempotency smoke. It does not call AppFactory's Cloudflare REST broker or
require a GitHub Cloudflare API token. The other AppFactory provisioning
routes and their credentials are independent of this Pages project.

The Pages Wrangler file is the deployment configuration source of truth.
Before changing other Pages settings, preserve the current production
configuration in that file. The D1 binding takes effect on the next production
deployment.
