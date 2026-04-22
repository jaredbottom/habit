import { getDb, json, err } from '../../_shared/db.js';

export async function onRequestPut({ request, env, params }) {
  try {
    const db = getDb(env);
    const { habitId, date } = params;
    const { count } = await request.json();

    if (typeof count !== 'number' || count < 0) return err('count must be a non-negative number');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return err('date must be YYYY-MM-DD');

    await db.execute({
      sql: `INSERT INTO completions (habit_id, date, count)
            VALUES (?, ?, ?)
            ON CONFLICT(habit_id, date) DO UPDATE SET count = excluded.count`,
      args: [habitId, date, Math.floor(count)],
    });

    return json({ habit_id: habitId, date, count: Math.floor(count) });
  } catch (e) {
    return err(e.message, 500);
  }
}
