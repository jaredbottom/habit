import { getDb, ensureTables, json, err, rowToHabit } from '../_shared/db.js';

export async function onRequestGet({ env }) {
  console.log('GET /api/habits', {
    hasUrl: !!env.TURSO_DATABASE_URL,
    hasToken: !!env.TURSO_AUTH_TOKEN,
  });
  try {
    const db = getDb(env);
    await ensureTables(db);
    const { rows } = await db.execute('SELECT * FROM habits ORDER BY position, created_at');
    return json(rows.map(rowToHabit));
  } catch (e) {
    console.error('GET /api/habits failed:', e.message);
    return err(e.message, 500);
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const db = getDb(env);
    const { name, emoji = '⭐', type = 'check', unit = '' } = await request.json();
    if (!name?.trim()) return err('name is required');

    const { rows: existing } = await db.execute(
      'SELECT COUNT(*) as cnt FROM habits'
    );
    const position = Number(existing[0].cnt);

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') + '_' + Date.now();

    await db.execute({
      sql: 'INSERT INTO habits (id, name, emoji, type, unit, position) VALUES (?, ?, ?, ?, ?, ?)',
      args: [id, name.trim(), emoji, type, unit, position],
    });

    return json({ id, name: name.trim(), emoji, type, unit, position }, 201);
  } catch (e) {
    console.error('POST /api/habits failed:', e.message);
    return err(e.message, 500);
  }
}
