const requiredObjects = [
  "early_access_leads",
  "conversion_events",
  "idx_early_access_created_at",
  "idx_conversion_events_type_created_at"
];

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS early_access_leads (
    id TEXT PRIMARY KEY,
    idempotency_key TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    repository_url TEXT NOT NULL,
    release_frequency TEXT NOT NULL CHECK (
      release_frequency IN ('weekly', 'monthly', 'quarterly', 'occasionally')
    ),
    source TEXT,
    campaign TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_early_access_created_at
    ON early_access_leads(created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS conversion_events (
    id TEXT PRIMARY KEY,
    lead_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES early_access_leads(id) ON DELETE CASCADE,
    UNIQUE (lead_id, event_type)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_conversion_events_type_created_at
    ON conversion_events(event_type, created_at DESC)`
];

// Bootstrap migration 0001 through the bound D1 database. Cloudflare Pages
// Git builds cannot be assumed to have a CLI token for remote migrations.
export async function ensureEarlyAccessSchema(db: D1Database): Promise<void> {
  const existing = await db.prepare(
    "SELECT name FROM sqlite_schema WHERE type IN ('table', 'index') AND name IN (?, ?, ?, ?)"
  ).bind(...requiredObjects).all<{name: string}>();

  const names = new Set((existing.results ?? []).map((row) => row.name));
  if (requiredObjects.every((name) => names.has(name))) {
    return;
  }

  await db.batch(schemaStatements.map((statement) => db.prepare(statement)));
}
