import {ensureEarlyAccessSchema} from "../lib/early-access-schema";
import {
  normalizedLeadKey,
  validateEarlyAccessPayload
} from "../../shared/earlyAccess";

interface Env {
  LEADS_DB?: D1Database;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let payload: unknown;

  try {
    payload = await context.request.json();
  } catch {
    return json({ok: false, error: "invalid_json"}, 400);
  }

  const validation = validateEarlyAccessPayload(payload);

  if (!validation.ok || !validation.data) {
    return json(
      {
        ok: false,
        error: "validation_failed",
        fields: validation.errors ?? {}
      },
      422
    );
  }

  const data = validation.data;
  const idempotencyKey = normalizedLeadKey(data);
  const id = crypto.randomUUID();
  const db = context.env.LEADS_DB;

  if (!db) {
    return json(
      {
        ok: false,
        error: "configuration_error",
        message: "LEADS_DB binding is not configured."
      },
      503
    );
  }

  try {
    await ensureEarlyAccessSchema(db);

    const lead = await db.prepare(
      `INSERT INTO early_access_leads (
        id,
        idempotency_key,
        email,
        repository_url,
        release_frequency,
        source,
        campaign,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(idempotency_key) DO UPDATE SET
        release_frequency = excluded.release_frequency,
        source = COALESCE(excluded.source, early_access_leads.source),
        campaign = COALESCE(excluded.campaign, early_access_leads.campaign),
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, created_at`
    )
      .bind(
        id,
        idempotencyKey,
        data.email,
        data.repositoryUrl,
        data.releaseFrequency,
        data.source ?? null,
        data.campaign ?? null
      )
      .first<{id: string; created_at: string}>();

    if (!lead) {
      return json({ok: false, error: "persistence_failed"}, 500);
    }

    await db.prepare(
      `INSERT OR IGNORE INTO conversion_events (
        id,
        lead_id,
        event_type,
        created_at
      ) VALUES (?, ?, 'early_access_submitted', CURRENT_TIMESTAMP)`
    )
      .bind(crypto.randomUUID(), lead.id)
      .run();

    return json({
      ok: true,
      leadId: lead.id
    });
  } catch {
    return json({ok: false, error: "persistence_failed"}, 500);
  }
};

export const onRequestGet: PagesFunction<Env> = async () =>
  json({ok: false, error: "method_not_allowed"}, 405);
