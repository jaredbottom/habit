import { useState } from 'react';
import CompletionRing from './CompletionRing.jsx';
import AddHabitModal from './AddHabitModal.jsx';
import { IconCheck, IconPlus, IconFlame, IconTrash } from './Icons.jsx';
import { TODAY, TODAY_KEY, dateKey, getCount, calcStreak } from '../utils.js';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TodayPage({ habits, completions, theme, onToggle, onDecrement, onAddHabit, onDeleteHabit }) {
  const [showAdd, setShowAdd] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const done = habits.filter(h => (completions[TODAY_KEY]?.[h.id] ?? 0) > 0).length;
  const pct = habits.length ? done / habits.length : 0;

  const todayIdx = TODAY.getDay();
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(TODAY);
    d.setDate(TODAY.getDate() - todayIdx + i);
    return d;
  });

  const handleAdd = async (name, emoji, type, unit) => {
    await onAddHabit(name, emoji, type, unit);
    setShowAdd(false);
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: theme.bg, position: 'relative' }}>
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ fontSize: 13, color: theme.subtext, fontWeight: 500, marginBottom: 2 }}>
          {TODAY.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: theme.text, marginBottom: 16 }}>Today</div>

        {/* Week strip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          {weekDates.map((d, i) => {
            const isToday = i === todayIdx;
            const k = dateKey(d);
            const anyDone = habits.some(h => getCount(completions, k, h.id) > 0);
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 11, color: isToday ? theme.accent : theme.subtext, fontWeight: isToday ? 600 : 400 }}>
                  {DAYS[i]}
                </div>
                <div style={{
                  width: 30, height: 30, borderRadius: 10,
                  background: isToday ? theme.accent : anyDone ? theme.accentLight : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600,
                  color: isToday ? 'white' : anyDone ? theme.accent : theme.subtext,
                  border: isToday ? 'none' : `1.5px solid ${theme.cardBorder}`,
                }}>{d.getDate()}</div>
              </div>
            );
          })}
        </div>

        {/* Progress summary */}
        <div style={{
          background: theme.card, borderRadius: 16, padding: '14px 16px',
          border: `1px solid ${theme.cardBorder}`, marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <CompletionRing pct={pct} size={52} stroke={6} color={theme.accent} track={theme.ringTrack} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>{done}/{habits.length}</div>
            <div style={{ fontSize: 13, color: theme.subtext }}>
              {pct === 1 ? '🎉 All done!' : pct === 0 ? "Let's go!" : `${Math.round(pct * 100)}% complete`}
            </div>
          </div>
        </div>
      </div>

      {/* Habit list */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {habits.map((h, idx) => {
          const count = getCount(completions, TODAY_KEY, h.id);
          const isDoneToday = count > 0;
          const streak = calcStreak(h.id, completions);
          const color = theme.habitColors[idx % theme.habitColors.length];
          const isDeleting = deleting === h.id;
          const isCount = h.type === 'count';

          return (
            <div
              key={h.id}
              style={{
                background: theme.card, borderRadius: 16, padding: '14px 16px',
                border: `1px solid ${isDeleting ? theme.accent : theme.cardBorder}`,
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all 0.2s',
              }}
              onContextMenu={e => { e.preventDefault(); setDeleting(isDeleting ? null : h.id); }}
            >
              {isCount ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => { if (!isDeleting) onDecrement(h.id); }} style={{
                    width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                    background: count > 0 ? color : theme.heatEmpty,
                    border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <line x1="2" y1="6" x2="10" y2="6" stroke={count > 0 ? 'white' : theme.subtext} strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div style={{
                    minWidth: 24, textAlign: 'center', fontSize: 18, fontWeight: 700,
                    color: count > 0 ? color : theme.subtext, lineHeight: 1,
                  }}>{count}</div>
                  <button onClick={() => { if (!isDeleting) onToggle(h.id); }} style={{
                    width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                    background: color, border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    <IconPlus color="white" />
                  </button>
                </div>
              ) : (
                <div onClick={() => { if (!isDeleting) onToggle(h.id); }} style={{
                  width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                  background: isDoneToday ? color : 'transparent',
                  border: `2px solid ${isDoneToday ? color : theme.cardBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                  cursor: 'pointer',
                }}>
                  {isDoneToday && <IconCheck />}
                </div>
              )}

              <div
                style={{ flex: 1 }}
                onClick={() => { if (isDeleting) { setDeleting(null); } else if (!isCount) { onToggle(h.id); } }}
              >
                <div style={{
                  fontSize: 15, fontWeight: 500, color: theme.text,
                  textDecoration: (!isCount && isDoneToday) ? 'line-through' : 'none',
                  opacity: (!isCount && isDoneToday) ? 0.5 : 1, transition: 'all 0.2s',
                  cursor: isCount ? 'default' : 'pointer',
                }}>
                  {h.name}
                  {isCount && h.unit ? <span style={{ fontSize: 12, color: theme.subtext, fontWeight: 400 }}> · {h.unit}</span> : null}
                </div>
                {streak > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                    <IconFlame color={theme.accent} />
                    <span style={{ fontSize: 12, color: theme.accent, fontWeight: 500 }}>{streak} day streak</span>
                  </div>
                )}
              </div>

              {isDeleting && (
                <button onClick={e => { e.stopPropagation(); onDeleteHabit(h.id); setDeleting(null); }} style={{
                  padding: '6px 12px', borderRadius: 8, background: 'oklch(60% 0.2 25)',
                  color: 'white', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
                }}>
                  <IconTrash color="white" /> Remove
                </button>
              )}
            </div>
          );
        })}

        <button onClick={() => setShowAdd(true)} style={{
          padding: '14px 16px', borderRadius: 16, border: `1.5px dashed ${theme.cardBorder}`,
          background: 'transparent', display: 'flex', alignItems: 'center', gap: 8,
          cursor: 'pointer', color: theme.subtext, fontSize: 14, fontWeight: 500,
          fontFamily: 'DM Sans, sans-serif', marginBottom: 20,
        }}>
          <IconPlus color={theme.subtext} /> Add habit
        </button>
      </div>

      {showAdd && <AddHabitModal theme={theme} onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
