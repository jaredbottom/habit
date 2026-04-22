export const dateKey = (d) => d.toISOString().slice(0, 10);

const _today = new Date();
_today.setHours(0, 0, 0, 0);
export const TODAY = _today;
export const TODAY_KEY = dateKey(TODAY);

export const getCount = (completions, dateK, habitId) =>
  completions[dateK]?.[habitId] ?? 0;

export const isDone = (completions, dateK, habitId) =>
  getCount(completions, dateK, habitId) > 0;

export function calcStreak(habitId, completions) {
  let streak = 0;
  const d = new Date(TODAY);
  if (!isDone(completions, TODAY_KEY, habitId)) d.setDate(d.getDate() - 1);
  while (streak < 365) {
    const k = dateKey(d);
    if (!isDone(completions, k, habitId)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function calcLongestStreak(habitId, completions) {
  const keys = Object.keys(completions).sort();
  if (!keys.length) return 0;
  let best = 0, cur = 0;
  const start = new Date(keys[0]);
  for (let d = new Date(start); d <= TODAY; d.setDate(d.getDate() + 1)) {
    const k = dateKey(new Date(d));
    if (isDone(completions, k, habitId)) { cur++; if (cur > best) best = cur; }
    else cur = 0;
  }
  return best;
}

export function calcCompletionRate(habitId, completions) {
  const keys = Object.keys(completions).filter(k => k <= TODAY_KEY).sort().slice(-30);
  if (!keys.length) return 0;
  return keys.filter(k => isDone(completions, k, habitId)).length / keys.length;
}

export function calcTotalCount(habitId, completions) {
  return Object.keys(completions)
    .filter(k => k <= TODAY_KEY)
    .reduce((sum, k) => sum + getCount(completions, k, habitId), 0);
}

export function calcYearProjection(habitId, completions, habit) {
  const yearStr = String(TODAY.getFullYear());
  const yearStart = new Date(TODAY.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((TODAY - yearStart) / 86400000) + 1;
  const remaining = 365 - dayOfYear;
  const rate = calcCompletionRate(habitId, completions);

  if (habit?.type === 'count') {
    const yearTotal = Object.keys(completions)
      .filter(k => k.startsWith(yearStr) && k <= TODAY_KEY)
      .reduce((s, k) => s + getCount(completions, k, habitId), 0);
    const avgPerDay = yearTotal / Math.max(dayOfYear, 1);
    return Math.round(calcTotalCount(habitId, completions) + remaining * avgPerDay);
  }

  const doneSoFar = Object.keys(completions)
    .filter(k => k.startsWith(yearStr) && k <= TODAY_KEY && isDone(completions, k, habitId))
    .length;
  return Math.round(doneSoFar + remaining * rate);
}
