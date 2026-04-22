import { createClient } from '@libsql/client/web';

export function getDb(env) {
  if (!env.TURSO_DATABASE_URL || !env.TURSO_AUTH_TOKEN) {
    throw new Error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variables');
  }
  return createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });
}

export async function ensureTables(db) {
  await db.batch([
    {
      sql: `CREATE TABLE IF NOT EXISTS habits (
        id         TEXT    PRIMARY KEY,
        name       TEXT    NOT NULL,
        emoji      TEXT    NOT NULL DEFAULT '⭐',
        type       TEXT    NOT NULL DEFAULT 'check',
        unit       TEXT    NOT NULL DEFAULT '',
        position   INTEGER NOT NULL DEFAULT 0,
        created_at TEXT    NOT NULL DEFAULT (datetime('now'))
      )`,
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS completions (
        habit_id TEXT    NOT NULL,
        date     TEXT    NOT NULL,
        count    INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (habit_id, date),
        FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
      )`,
    },
  ]);
}

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const err = (msg, status = 400) => json({ error: msg }, status);

export const rowToHabit = (row) => ({
  id: row.id,
  name: row.name,
  emoji: row.emoji,
  type: row.type,
  unit: row.unit,
  position: Number(row.position),
});
