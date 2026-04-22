function parseValue(v) {
  if (!v || v.type === 'null') return null;
  if (v.type === 'integer') return Number(v.value);
  if (v.type === 'float') return parseFloat(v.value);
  return v.value;
}

function typedArg(val) {
  if (val === null || val === undefined) return { type: 'null' };
  if (typeof val === 'number') {
    return Number.isInteger(val)
      ? { type: 'integer', value: String(val) }
      : { type: 'float', value: String(val) };
  }
  if (typeof val === 'boolean') return { type: 'integer', value: val ? '1' : '0' };
  return { type: 'text', value: String(val) };
}

export function getDb(env) {
  const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = env;
  if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
    throw new Error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variables');
  }

  const baseUrl = TURSO_DATABASE_URL.replace(/^libsql:\/\//, 'https://');
  const pipelineUrl = `${baseUrl}/v2/pipeline`;

  async function pipeline(requests) {
    const res = await fetch(pipelineUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TURSO_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests: [...requests, { type: 'close' }] }),
    });
    if (!res.ok) throw new Error(`Turso HTTP ${res.status}: ${await res.text()}`);
    return res.json();
  }

  async function execute(sqlOrObj, argsArr = []) {
    const sql = typeof sqlOrObj === 'string' ? sqlOrObj : sqlOrObj.sql;
    const args = typeof sqlOrObj === 'string' ? argsArr : (sqlOrObj.args || []);
    const { results } = await pipeline([
      { type: 'execute', stmt: { sql, args: args.map(typedArg) } },
    ]);
    const r = results[0];
    if (r.type === 'error') throw new Error(r.error.message);
    const cols = r.response.result.cols.map(c => c.name);
    const rows = r.response.result.rows.map(row =>
      Object.fromEntries(cols.map((name, i) => [name, parseValue(row[i])]))
    );
    return { rows };
  }

  async function batch(stmts) {
    const requests = stmts.map(s => ({
      type: 'execute',
      stmt: { sql: s.sql, args: (s.args || []).map(typedArg) },
    }));
    const { results } = await pipeline(requests);
    for (const r of results) {
      if (r.type === 'error') throw new Error(r.error.message);
    }
  }

  return { execute, batch };
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
