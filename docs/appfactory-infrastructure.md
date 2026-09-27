# AppFactory infrastructure boundary

Release Video Engine does not own Cloudflare account credentials in GitHub.

The canonical infrastructure workflow is:

`.github/workflows/appfactory-infrastructure.yml`

It requests a short-lived GitHub Actions OIDC token and calls:

`POST https://appfactory-api.lawrynnjennifer.workers.dev/infrastructure/pages-d1`

AppFactory owns the Cloudflare API token and account ID at runtime.

For the `early-access-leads` recipe AppFactory derives:

- Pages project: `release-video-engine`
- D1 database: `release-video-engine-leads`
- binding: `LEADS_DB`

Then it applies the idempotent migration, binds D1 to production/preview Pages environments, triggers a deployment, and returns the deployment identifiers.

The repository workflow waits for `/api/early-access-health` and executes the stable idempotent production smoke.

No repository-level `CLOUDFLARE_API_TOKEN` or `CLOUDFLARE_ACCOUNT_ID` is required.
