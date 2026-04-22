const TABS = [
  {
    id: 'today', label: 'Today',
    icon: (active, accent, subtext) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="4" width="16" height="15" rx="3" stroke={active ? accent : subtext} strokeWidth="1.8" />
        <line x1="3" y1="8.5" x2="19" y2="8.5" stroke={active ? accent : subtext} strokeWidth="1.8" />
        <line x1="8" y1="2" x2="8" y2="6" stroke={active ? accent : subtext} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="14" y1="2" x2="14" y2="6" stroke={active ? accent : subtext} strokeWidth="1.8" strokeLinecap="round" />
        <rect x="7" y="12" width="3" height="3" rx="1" fill={active ? accent : subtext} />
      </svg>
    ),
  },
  {
    id: 'stats', label: 'Stats',
    icon: (active, accent, subtext) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="12" width="4" height="7" rx="1.5" fill={active ? accent : subtext} />
        <rect x="9" y="7" width="4" height="12" rx="1.5" fill={active ? accent : subtext} />
        <rect x="15" y="3" width="4" height="16" rx="1.5" fill={active ? accent : subtext} />
      </svg>
    ),
  },
  {
    id: 'settings', label: 'Settings',
    icon: (active, accent, subtext) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="3" stroke={active ? accent : subtext} strokeWidth="1.8" />
        <path
          d="M11 2v2M11 18v2M2 11h2M18 11h2M4.2 4.2l1.4 1.4M16.4 16.4l1.4 1.4M4.2 17.8l1.4-1.4M16.4 5.6l1.4-1.4"
          stroke={active ? accent : subtext} strokeWidth="1.8" strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function BottomNav({ page, setPage, theme }) {
  return (
    <div style={{
      background: theme.navBg,
      borderTop: `1px solid ${theme.navBorder}`,
      display: 'flex',
      padding: '8px 0 max(2px, env(safe-area-inset-bottom))',
      flexShrink: 0,
    }}>
      {TABS.map(t => (
        <button key={t.id} onClick={() => setPage(t.id)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          {t.icon(page === t.id, theme.accent, theme.subtext)}
          <span style={{
            fontSize: 11,
            color: page === t.id ? theme.accent : theme.subtext,
            fontWeight: page === t.id ? 600 : 400,
          }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
