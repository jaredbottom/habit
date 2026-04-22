import { getDb, json, err, rowToHabit } from '../_shared/db.js';

export async function onRequestPut({ request, env, params }) {
  try {
    const db = getDb(env);
    const { id } = params;
    const { name, emoji, type, unit } = await request.json();

    const fields = [];
    const args = [];
    if (name !== undefined) { fields.push('name = ?'); args.push(name); }
    if (emoji !== undefined) { fields.push('emoji = ?'); args.push(emoji); }
    if (type !== undefined) { fields.push('type = ?'); args.push(type); }
    if (unit !== undefined) { fields.push('unit = ?'); args.push(unit); }
    if (!fields.length) return err('no fields to update');

    args.push(id);
    await db.execute({ sql: `UPDATE habits SET ${fields.join(', ')} WHERE id = ?`, args });

    const { rows } = await db.execute({ sql: 'SELECT * FROM habits WHERE id = ?', args: [id] });
    if (!rows.length) return err('habit not found', 404);
    return json(rowToHabit(rows[0]));
  } catch (e) {
    return err(e.message, 500);
  }
}

export async function onRequestDelete({ env, params }) {
  try {
    const db = getDb(env);
    const { id } = params;
    await db.execute({ sql: 'DELETE FROM habits WHERE id = ?', args: [id] });
    return new Response(null, { status: 204 });
  } catch (e) {
    return err(e.message, 500);
  }
}
