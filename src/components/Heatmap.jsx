import { useState } from 'react';
import { TODAY, dateKey, getCount } from '../utils.js';

export default function Heatmap({ habitId, habit, completions, theme, onToggleDay }) {
  const [selected, setSelected] = useState(null);
  const weeks = 15;

  const startDate = new Date(TODAY);
  startDate.setDate(TODAY.getDate() - (weeks * 7 - 1));

  const allCounts = [];
  const cells = [];
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const k = dateKey(d);
    const count = getCount(completions, k, habitId);
    const isFuture = d > TODAY;
    if (!isFuture) allCounts.push(count);
    cells.push({ count, isFuture, k, d });
  }
  const maxCount = Math.max(...allCounts, 1);

  const selCell = selected ? cells.find(c => c.k === selected) : null;
  const selCount = selCell ? getCount(completions, selected, habitId) : 0;
  const isCount = habit?.type === 'count';

  const handleTap = (c) => {
    if (c.isFuture || !onToggleDay) return;
    setSelected(c.k);
    onToggleDay(c.k);
  };

  const cellOpacity = (count) => {
    if (count === 0) return null;
    if (!isCount) return 1;
    return 0.25 + 0.75 * (count / maxCount);
  };

  return (
    <div>
      <div style={{
        minHeight: 36, marginBottom: 10,
        background: selected ? theme.accentLight : 'transparent',
        borderRadius: 10, padding: selected ? '8px 12px' : '0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'background 0.2s',
      }}>
        {selected && selCell ? (
          <>
            <span style={{ fontSize: 13, fontWeight: 600, color: theme.accent }}>
              {selCell.d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 10, height: 10, borderRadius: 3,
                background: selCount > 0 ? theme.heatFull : theme.heatEmpty,
                border: `1.5px solid ${theme.accent}`,
              }} />
              <span style={{ fontSize: 13, color: theme.accent, fontWeight: 500 }}>
                {isCount
                  ? selCount > 0 ? `${selCount}×${habit.unit ? ' ' + habit.unit : ''}` : 'Not logged'
                  : selCount > 0 ? 'Completed' : 'Not logged'
                }
              </span>
            </div>
          </>
        ) : (
          <span style={{ fontSize: 12, color: theme.subtext, opacity: 0.7 }}>Tap a cell to edit</span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${weeks}, 1fr)`, gap: 3 }}>
        {Array.from({ length: weeks }).map((_, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {cells.slice(wi * 7, wi * 7 + 7).map((c, di) => {
              const isSel = c.k === selected;
              const op = cellOpacity(c.count);
              return (
                <div
                  key={di}
                  onClick={() => handleTap(c)}
                  style={{
                    width: '100%', aspectRatio: '1',
                    borderRadius: 3,
                    background: c.isFuture ? 'transparent' : op !== null ? theme.heatFull : theme.heatEmpty,
                    opacity: c.isFuture ? 0 : op !== null ? op : 1,
                    cursor: c.isFuture ? 'default' : 'pointer',
                    outline: isSel ? `2px solid ${theme.accent}` : 'none',
                    outlineOffset: '1px',
                    transform: isSel ? 'scale(1.25)' : 'scale(1)',
                    transition: 'transform 0.15s, background 0.15s',
                    zIndex: isSel ? 1 : 0,
                    position: 'relative',
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
