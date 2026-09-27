const baseUrl = (process.env.FUNNEL_BASE_URL || "").replace(/\/$/, "");

if (!baseUrl) {
  console.error("[funnel-smoke] FUNNEL_BASE_URL is required");
  process.exit(1);
}

const payload = {
  email: "release-video-smoke@trigenys.invalid",
  repositoryUrl: "https://github.com/Trigenys/release-video-engine",
  releaseFrequency: "monthly",
  source: "github-actions",
  campaign: "production-smoke"
};

async function requestJson(path, init) {
  const response = await fetch(baseUrl + path, init);
  let body;

  try {
    body = await response.json();
  } catch {
    body = {ok: false, error: "invalid_json_response"};
  }

  return {response, body};
}

const health = await requestJson("/api/early-access-health");

if (!health.response.ok || !health.body?.ok) {
  console.error(
    "[funnel-smoke] health check failed",
    health.response.status,
    JSON.stringify(health.body)
  );
  process.exit(1);
}

const submit = () =>
  requestJson("/api/early-access", {
    method: "POST",
    headers: {"content-type": "application/json"},
    body: JSON.stringify(payload)
  });

const first = await submit();
if (!first.response.ok || !first.body?.ok || !first.body?.leadId) {
  console.error(
    "[funnel-smoke] first submission failed",
    first.response.status,
    JSON.stringify(first.body)
  );
  process.exit(1);
}

const second = await submit();
if (!second.response.ok || !second.body?.ok || !second.body?.leadId) {
  console.error(
    "[funnel-smoke] second submission failed",
    second.response.status,
    JSON.stringify(second.body)
  );
  process.exit(1);
}

if (first.body.leadId !== second.body.leadId) {
  console.error(
    "[funnel-smoke] idempotency failed",
    first.body.leadId,
    second.body.leadId
  );
  process.exit(1);
}

console.log("[funnel-smoke] production funnel is healthy");
console.log("[funnel-smoke] lead id:", first.body.leadId);
