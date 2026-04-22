import { useState, useEffect, useCallback } from 'react';
import { THEMES, DEFAULT_HABITS } from './themes.js';
import { TODAY, TODAY_KEY, dateKey, getCount } from './utils.js';
import TodayPage from './components/TodayPage.jsx';
import StatsPage from './components/StatsPage.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import BottomNav from './components/BottomNav.jsx';

function startDate() {
  const d = new Date(TODAY);
  d.setDate(TODAY.getDate() - 370);
  return dateKey(d);
}

async function apiFetch(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json()).error || ''; } catch {}
    throw new Error(`${options.method || 'GET'} ${path} → ${res.status}${detail ? ': ' + detail : ''}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export default function App() {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(() => localStorage.getItem('htracker_page') || 'today');
  const [themeName, setThemeName] = useState(() => localStorage.getItem('htracker_theme') || 'dark');

  const theme = THEMES[themeName] || THEMES.dark;

  useEffect(() => { localStorage.setItem('htracker_page', page); }, [page]);
  useEffect(() => { localStorage.setItem('htracker_theme', themeName); }, [themeName]);

  const loadData = useCallback(async () => {
    try {
      const [habitsData, completionsData] = await Promise.all([
        apiFetch('/api/habits'),
        apiFetch(`/api/completions?start=${startDate()}&end=${TODAY_KEY}`),
      ]);

      if (habitsData.length === 0) {
        // Seed default habits sequentially to preserve order
        const seeded = [];
        for (const h of DEFAULT_HABITS) {
          const created = await apiFetch('/api/habits', { method: 'POST', body: h });
          seeded.push(created);
        }
        setHabits(seeded);
      } else {
        setHabits(habitsData);
      }
      setCompletions(completionsData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleHabit = useCallback(async (id) => {
    const habit = habits.find(h => h.id === id);
    const cur = getCount(completions, TODAY_KEY, id);
    const next = habit?.type === 'count' ? cur + 1 : cur > 0 ? 0 : 1;
    setCompletions(prev => ({ ...prev, [TODAY_KEY]: { ...prev[TODAY_KEY], [id]: next } }));
    await apiFetch(`/api/completions/${encodeURIComponent(id)}/${TODAY_KEY}`, { method: 'PUT', body: { count: next } });
  }, [habits, completions]);

  const decrementHabit = useCallback(async (id) => {
    const cur = getCount(completions, TODAY_KEY, id);
    const next = Math.max(0, cur - 1);
    setCompletions(prev => ({ ...prev, [TODAY_KEY]: { ...prev[TODAY_KEY], [id]: next } }));
    await apiFetch(`/api/completions/${encodeURIComponent(id)}/${TODAY_KEY}`, { method: 'PUT', body: { count: next } });
  }, [completions]);

  const toggleDay = useCallback(async (habitId, dateK) => {
    const cur = getCount(completions, dateK, habitId);
    const next = cur > 0 ? 0 : 1;
    setCompletions(prev => ({ ...prev, [dateK]: { ...prev[dateK], [habitId]: next } }));
    await apiFetch(`/api/completions/${encodeURIComponent(habitId)}/${dateK}`, { method: 'PUT', body: { count: next } });
  }, [completions]);

  const addHabit = useCallback(async (name, emoji, type, unit) => {
    const created = await apiFetch('/api/habits', { method: 'POST', body: { name, emoji, type, unit } });
    setHabits(prev => [...prev, created]);
  }, []);

  const deleteHabit = useCallback(async (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    await apiFetch(`/api/habits/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }, []);

  const updateHabit = useCallback(async (id, updates) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    await apiFetch(`/api/habits/${encodeURIComponent(id)}`, { method: 'PUT', body: updates });
  }, []);

  const reorderHabits = useCallback(async (newHabits) => {
    setHabits(newHabits);
    await apiFetch('/api/habits/reorder', { method: 'POST', body: { ids: newHabits.map(h => h.id) } });
  }, []);

  if (loading) {
    return (
      <div style={{ width: '100%', height: '100%', background: THEMES.dark.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: THEMES.dark.subtext, fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>Loading…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: '100%', height: '100%', background: theme.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, fontFamily: 'DM Sans, sans-serif' }}>
        <div style={{ fontSize: 32 }}>⚠️</div>
        <div style={{ color: theme.text, fontSize: 16, fontWeight: 600, textAlign: 'center' }}>Could not connect</div>
        <div style={{ color: theme.subtext, fontSize: 13, textAlign: 'center' }}>{error}</div>
        <button onClick={() => { setError(null); setLoading(true); loadData(); }} style={{
          marginTop: 8, padding: '10px 20px', borderRadius: 12, background: theme.accent,
          color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
        }}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: theme.bg, fontFamily: 'DM Sans, sans-serif' }}>
      {page === 'today' && (
        <TodayPage
          habits={habits}
          completions={completions}
          theme={theme}
          onToggle={toggleHabit}
          onDecrement={decrementHabit}
          onAddHabit={addHabit}
          onDeleteHabit={deleteHabit}
        />
      )}
      {page === 'stats' && (
        <StatsPage
          habits={habits}
          completions={completions}
          onToggleDay={toggleDay}
          theme={theme}
        />
      )}
      {page === 'settings' && (
        <SettingsPage
          habits={habits}
          theme={theme}
          themeName={themeName}
          onUpdateHabit={updateHabit}
          onDeleteHabit={deleteHabit}
          onReorderHabits={reorderHabits}
          onThemeChange={setThemeName}
        />
      )}
      <BottomNav page={page} setPage={setPage} theme={theme} />
    </div>
  );
}
