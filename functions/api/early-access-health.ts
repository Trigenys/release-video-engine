import {ensureEarlyAccessSchema} from "../lib/early-access-schema";

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

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.LEADS_DB;

  if (!db) {
    return json(
      {
        ok: false,
        error: "configuration_error",
        checks: {
          binding: false,
          leadsTable: false,
          conversionTable: false
        }
      },
      503
    );
  }

  try {
    await ensureEarlyAccessSchema(db);

    await db.prepare("SELECT COUNT(*) AS count FROM early_access_leads").first();
    await db.prepare("SELECT COUNT(*) AS count FROM conversion_events").first();

    return json({
      ok: true,
      checks: {
        binding: true,
        leadsTable: true,
        conversionTable: true
      }
    });
  } catch {
    return json(
      {
        ok: false,
        error: "database_not_ready",
        checks: {
          binding: true,
          leadsTable: false,
          conversionTable: false
        }
      },
      503
    );
  }
};

export const onRequestPost: PagesFunction<Env> = async () =>
  json({ok: false, error: "method_not_allowed"}, 405);
