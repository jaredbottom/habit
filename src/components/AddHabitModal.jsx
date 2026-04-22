import { useState } from 'react';

const EMOJIS = ['⭐', '🏃', '📚', '🧘', '💧', '🎯', '✍️', '🎸', '🍎', '😴', '🧠', '💪'];

export default function AddHabitModal({ theme, onAdd, onClose }) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('⭐');
  const [type, setType] = useState('check');
  const [unit, setUnit] = useState('');

  const canAdd = name.trim().length > 0;

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50,
      display: 'flex', alignItems: 'flex-end', borderRadius: 'inherit',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: theme.card, borderRadius: '20px 20px 0 0', padding: '24px 20px 40px',
        width: '100%',
      }}>
        <div style={{ width: 36, height: 4, background: theme.cardBorder, borderRadius: 2, margin: '0 auto 20px' }} />
        <div style={{ fontSize: 17, fontWeight: 600, color: theme.text, marginBottom: 20 }}>New Habit</div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: theme.subtext, marginBottom: 8, fontWeight: 500 }}>ICON</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {EMOJIS.map(e => (
              <button key={e} onClick={() => setEmoji(e)} style={{
                width: 40, height: 40, borderRadius: 10,
                border: `2px solid ${emoji === e ? theme.accent : theme.cardBorder}`,
                background: emoji === e ? theme.accentLight : theme.card,
                fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{e}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: theme.subtext, marginBottom: 8, fontWeight: 500 }}>HABIT NAME</div>
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Journal, Walk, Stretch…"
            autoFocus
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 12,
              border: `1.5px solid ${theme.cardBorder}`,
              background: theme.bg, color: theme.text,
              fontSize: 15, fontFamily: 'DM Sans, sans-serif', outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: theme.subtext, marginBottom: 8, fontWeight: 500 }}>TRACKING TYPE</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ v: 'check', label: '✓  Done / not done' }, { v: 'count', label: '#  Count per day' }].map(opt => (
              <button key={opt.v} onClick={() => setType(opt.v)} style={{
                flex: 1, padding: '10px 8px', borderRadius: 12, fontSize: 13, fontWeight: 500,
                border: `2px solid ${type === opt.v ? theme.accent : theme.cardBorder}`,
                background: type === opt.v ? theme.accentLight : theme.card,
                color: type === opt.v ? theme.accent : theme.subtext,
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}>{opt.label}</button>
            ))}
          </div>
        </div>

        {type === 'count' && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: theme.subtext, marginBottom: 8, fontWeight: 500 }}>
              UNIT LABEL <span style={{ opacity: 0.5 }}>(optional)</span>
            </div>
            <input
              value={unit} onChange={e => setUnit(e.target.value)}
              placeholder="e.g. glasses, km, pages…"
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 12,
                border: `1.5px solid ${theme.cardBorder}`,
                background: theme.bg, color: theme.text,
                fontSize: 15, fontFamily: 'DM Sans, sans-serif', outline: 'none',
              }}
            />
          </div>
        )}

        <button
          onClick={() => { if (canAdd) onAdd(name.trim(), emoji, type, unit.trim()); }}
          style={{
            width: '100%', padding: '14px', borderRadius: 14,
            background: canAdd ? theme.accent : theme.heatEmpty,
            color: canAdd ? 'white' : theme.subtext,
            fontSize: 15, fontWeight: 600, border: 'none', cursor: canAdd ? 'pointer' : 'default',
            fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
          }}
        >Add Habit</button>
      </div>
    </div>
  );
}
