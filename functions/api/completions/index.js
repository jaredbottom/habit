import { getDb, json, err } from '../_shared/db.js';

export async function onRequestGet({ request, env }) {
  console.log('GET /api/completions', {
    hasUrl: !!env.TURSO_DATABASE_URL,
    hasToken: !!env.TURSO_AUTH_TOKEN,
  });
  try {
    const db = getDb(env);
    const url = new URL(request.url);
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');

    if (!start || !end) return err('start and end query params are required');

    const { rows } = await db.execute({
      sql: 'SELECT habit_id, date, count FROM completions WHERE date >= ? AND date <= ? ORDER BY date',
      args: [start, end],
    });

    // Build nested { date: { habitId: count } } structure
    const result = {};
    for (const row of rows) {
      const dateStr = row.date;
      const habitId = row.habit_id;
      const count = Number(row.count);
      if (!result[dateStr]) result[dateStr] = {};
      result[dateStr][habitId] = count;
    }

    return json(result);
  } catch (e) {
    console.error('GET /api/completions failed:', e.message);
    return err(e.message, 500);
  }
}
