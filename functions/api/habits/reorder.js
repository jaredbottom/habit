import { getDb, json, err } from '../_shared/db.js';

export async function onRequestPost({ request, env }) {
  try {
    const db = getDb(env);
    const { ids } = await request.json();
    if (!Array.isArray(ids)) return err('ids must be an array');

    const stmts = ids.map((id, position) => ({
      sql: 'UPDATE habits SET position = ? WHERE id = ?',
      args: [position, id],
    }));
    await db.batch(stmts);

    return json({ ok: true });
  } catch (e) {
    return err(e.message, 500);
  }
}
