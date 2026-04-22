import { useState } from 'react';
import { IconPencil, IconTrash, IconChevronUp, IconChevronDown } from './Icons.jsx';

const EMOJIS = ['⭐', '🏃', '📚', '🧘', '💧', '🎯', '✍️', '🎸', '🍎', '😴', '🧠', '💪', '🚴', '🏊', '🎵'];

export default function SettingsPage({ habits, theme, themeName, onUpdateHabit, onDeleteHabit, onReorderHabits, onThemeChange }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState('');
  const [editType, setEditType] = useState('check');
  const [editUnit, setEditUnit] = useState('');

  const startEdit = (h) => {
    setEditingId(h.id);
    setEditName(h.name);
    setEditEmoji(h.emoji);
    setEditType(h.type || 'check');
    setEditUnit(h.unit || '');
  };

  const saveEdit = () => {
    onUpdateHabit(editingId, { name: editName, emoji: editEmoji, type: editType, unit: editUnit });
    setEditingId(null);
  };

  const moveHabit = (id, dir) => {
    const idx = habits.findIndex(h => h.id === id);
    const next = [...habits];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    onReorderHabits(next);
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: theme.bg }}>
      <div style={{ padding: '16px 20px 0 20px' }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: theme.text }}>Settings</div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: theme.subtext, letterSpacing: '0.6px', padding: '18px 20px 8px' }}>HABITS</div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {habits.map((h, idx) => (
          <div key={h.id} style={{ background: theme.card, borderRadius: 14, border: `1px solid ${theme.cardBorder}`, overflow: 'hidden' }}>
            {editingId === h.id ? (
              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {EMOJIS.map(e => (
                    <button key={e} onClick={() => setEditEmoji(e)} style={{
                      width: 34, height: 34, borderRadius: 8, fontSize: 17,
                      border: `2px solid ${editEmoji === e ? theme.accent : theme.cardBorder}`,
                      background: editEmoji === e ? theme.accentLight : theme.card,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{e}</button>
                  ))}
                </div>
                <input
                  value={editName} onChange={e => setEditName(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 10,
                    border: `1.5px solid ${theme.accent}`,
                    background: theme.bg, color: theme.text,
                    fontSize: 15, fontFamily: 'DM Sans, sans-serif', outline: 'none', marginBottom: 10,
                  }}
                />
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  {[{ v: 'check', label: '✓ Done/not done' }, { v: 'count', label: '# Count' }].map(opt => (
                    <button key={opt.v} onClick={() => setEditType(opt.v)} style={{
                      flex: 1, padding: '8px 6px', borderRadius: 10, fontSize: 12, fontWeight: 500,
                      border: `2px solid ${editType === opt.v ? theme.accent : theme.cardBorder}`,
                      background: editType === opt.v ? theme.accentLight : theme.card,
                      color: editType === opt.v ? theme.accent : theme.subtext,
                      cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                    }}>{opt.label}</button>
                  ))}
                </div>
                {editType === 'count' && (
                  <input
                    value={editUnit} onChange={e => setEditUnit(e.target.value)}
                    placeholder="Unit label (e.g. glasses, km)"
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 10,
                      border: `1.5px solid ${theme.cardBorder}`,
                      background: theme.bg, color: theme.text,
                      fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none', marginBottom: 10,
                    }}
                  />
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={saveEdit} style={{
                    flex: 1, padding: '10px', borderRadius: 10,
                    background: theme.accent, color: 'white',
                    border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  }}>Save</button>
                  <button onClick={() => setEditingId(null)} style={{
                    flex: 1, padding: '10px', borderRadius: 10,
                    background: theme.heatEmpty, color: theme.subtext,
                    border: 'none', fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 10 }}>
                <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: theme.text }}>{h.name}</span>
                <span style={{ fontSize: 11, color: theme.subtext, background: theme.heatEmpty, borderRadius: 6, padding: '3px 7px', flexShrink: 0 }}>
                  {h.type === 'count' ? `# ${h.unit || 'count'}` : '✓ check'}
                </span>
                <button onClick={() => moveHabit(h.id, -1)} disabled={idx === 0} style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.2 : 0.6, padding: '4px' }}>
                  <IconChevronUp color={theme.text} />
                </button>
                <button onClick={() => moveHabit(h.id, 1)} disabled={idx === habits.length - 1} style={{ background: 'none', border: 'none', cursor: idx === habits.length - 1 ? 'default' : 'pointer', opacity: idx === habits.length - 1 ? 0.2 : 0.6, padding: '4px' }}>
                  <IconChevronDown color={theme.text} />
                </button>
                <button onClick={() => startEdit(h)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', opacity: 0.6 }}>
                  <IconPencil color={theme.text} />
                </button>
                <button onClick={() => onDeleteHabit(h.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <IconTrash color="oklch(60% 0.2 25)" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Theme selector */}
      <div style={{ fontSize: 12, fontWeight: 600, color: theme.subtext, letterSpacing: '0.6px', padding: '18px 20px 8px' }}>APPEARANCE</div>
      <div style={{ padding: '0 16px', marginBottom: 32 }}>
        <div style={{ background: theme.card, borderRadius: 14, border: `1px solid ${theme.cardBorder}`, padding: '14px' }}>
          <div style={{ fontSize: 13, color: theme.subtext, marginBottom: 10 }}>Visual style</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['minimal', 'dark', 'warm'].map(t => (
              <button
                key={t}
                onClick={() => onThemeChange(t)}
                style={{
                  flex: 1, padding: '8px', borderRadius: 10, fontSize: 12, fontWeight: 500,
                  border: `2px solid ${t === themeName ? theme.accent : theme.cardBorder}`,
                  background: t === themeName ? theme.accentLight : theme.bg,
                  color: t === themeName ? theme.accent : theme.subtext,
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', textTransform: 'capitalize',
                }}
              >{t}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
