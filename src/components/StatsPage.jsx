import { useState } from 'react';
import CompletionRing from './CompletionRing.jsx';
import Heatmap from './Heatmap.jsx';
import { TODAY, TODAY_KEY, dateKey, getCount, calcStreak, calcLongestStreak, calcCompletionRate, calcTotalCount, calcYearProjection } from '../utils.js';

export default function StatsPage({ habits, completions, onToggleDay, theme }) {
  const [selected, setSelected] = useState(habits[0]?.id);

  const h = habits.find(x => x.id === selected) || habits[0];
  if (!h) return (
    <div style={{ flex: 1, background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.subtext }}>
      No habits yet.
    </div>
  );

  const streak = calcStreak(h.id, completions);
  const longest = calcLongestStreak(h.id, completions);
  const rate = calcCompletionRate(h.id, completions);
  const projection = calcYearProjection(h.id, completions, h);
  const totalCount = calcTotalCount(h.id, completions);
  const color = theme.habitColors[habits.findIndex(x => x.id === h.id) % theme.habitColors.length];

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(TODAY);
    d.setDate(d.getDate() - 6 + i);
    const k = dateKey(d);
    return { label: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d.getDay()], count: getCount(completions, k, h.id), isToday: k === TODAY_KEY };
  });
  const maxBar = Math.max(...last7.map(d => d.count), 1);

  const yearStart = new Date(TODAY.getFullYear(), 0, 1);
  const yearProgress = Math.floor((TODAY - yearStart) / 86400000) / 365;

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: theme.bg }}>
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: theme.text, marginBottom: 16 }}>Stats</div>

        {/* Habit selector */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 20, scrollbarWidth: 'none' }}>
          {habits.map((hab, idx) => {
            const c = theme.habitColors[idx % theme.habitColors.length];
            const sel = hab.id === selected;
            return (
              <button key={hab.id} onClick={() => setSelected(hab.id)} style={{
                padding: '8px 14px', borderRadius: 20,
                border: `2px solid ${sel ? c : theme.cardBorder}`,
                background: sel ? c : theme.card,
                color: sel ? 'white' : theme.subtext,
                fontSize: 13, fontWeight: 500, cursor: 'pointer', flexShrink: 0,
                fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
              }}>{hab.name}</button>
            );
          })}
        </div>

        {/* Streak cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          {[
            { label: 'Current Streak', value: streak, unit: 'days', icon: '🔥' },
            { label: 'Longest Streak', value: longest, unit: 'days', icon: '🏆' },
          ].map(s => (
            <div key={s.label} style={{ background: theme.card, borderRadius: 16, padding: '16px 14px', border: `1px solid ${theme.cardBorder}` }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: theme.text, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: theme.subtext, marginTop: 2 }}>{s.unit}</div>
              <div style={{ fontSize: 12, color: theme.subtext, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Total count (count habits only) */}
        {h.type === 'count' && (
          <div style={{ background: theme.card, borderRadius: 16, padding: '16px', border: `1px solid ${theme.cardBorder}`, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color }}>{totalCount}</div>
            <div style={{ fontSize: 13, color: theme.subtext }}>total {h.unit || 'completions'} logged</div>
          </div>
        )}

        {/* 30-day completion rate */}
        <div style={{ background: theme.card, borderRadius: 16, padding: '16px', border: `1px solid ${theme.cardBorder}`, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 16 }}>
          <CompletionRing pct={rate} size={64} stroke={7} color={color} track={theme.ringTrack} />
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: theme.text }}>{Math.round(rate * 100)}%</div>
            <div style={{ fontSize: 13, color: theme.subtext }}>30-day completion rate</div>
          </div>
        </div>

        {/* Year projection */}
        <div style={{ background: theme.card, borderRadius: 16, padding: '16px', border: `1px solid ${theme.cardBorder}`, marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.subtext, marginBottom: 8 }}>AT CURRENT RATE</div>
          <div style={{ fontSize: 28, fontWeight: 700, color }}>
            {projection}<span style={{ fontSize: 14, fontWeight: 500, color: theme.subtext }}> completions</span>
          </div>
          <div style={{ fontSize: 13, color: theme.subtext }}>projected by end of {TODAY.getFullYear()}</div>
          <div style={{ marginTop: 12 }}>
            <div style={{ height: 8, borderRadius: 4, background: theme.heatEmpty, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 4, background: color, width: `${yearProgress * 100}%`, transition: 'width 0.6s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 11, color: theme.subtext }}>Jan 1</span>
              <span style={{ fontSize: 11, color: theme.subtext }}>Dec 31</span>
            </div>
          </div>
        </div>

        {/* Last 7 days bar chart */}
        <div style={{ background: theme.card, borderRadius: 16, padding: '16px', border: `1px solid ${theme.cardBorder}`, marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.subtext, marginBottom: 14 }}>LAST 7 DAYS</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 60 }}>
            {last7.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: '100%',
                  height: d.count > 0 ? Math.max(12, Math.round(44 * d.count / maxBar)) : 12,
                  borderRadius: 6,
                  background: d.count > 0 ? color : theme.heatEmpty,
                  transition: 'height 0.3s ease',
                  border: d.isToday ? `2px solid ${color}` : 'none',
                }} />
                <span style={{ fontSize: 11, color: d.isToday ? color : theme.subtext, fontWeight: d.isToday ? 600 : 400 }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 15-week heatmap */}
        <div style={{ background: theme.card, borderRadius: 16, padding: '16px', border: `1px solid ${theme.cardBorder}`, marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.subtext, marginBottom: 12 }}>LAST 15 WEEKS</div>
          <Heatmap
            habitId={h.id}
            habit={h}
            completions={completions}
            theme={theme}
            onToggleDay={k => onToggleDay(h.id, k)}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 11, color: theme.subtext }}>Less</span>
            {[0.15, 0.4, 0.65, 1].map(o => (
              <div key={o} style={{ width: 10, height: 10, borderRadius: 2, background: color, opacity: o }} />
            ))}
            <span style={{ fontSize: 11, color: theme.subtext }}>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
