export const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <polyline points="2,7 6,11 12,3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconPlus = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <line x1="9" y1="3" x2="9" y2="15" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="9" x2="15" y2="9" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const IconTrash = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 4h12M6 4V2h4v2M5 4l1 9h4l1-9" stroke={color || 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconFlame = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={color || 'currentColor'}>
    <path d="M8 14c-3.3 0-6-2.4-6-5.3 0-2 1.2-3.7 2.3-4.9C5.4 2.5 6 1 6 1s.5 2 1.5 2.5c0-1 .5-2 1.5-2.5 0 0-.2 2.5 2 3.5 1.2.6 1 2 1 2s.8-.5.8-1.5c1.4 1.2 2.2 2.9 2.2 4.7 0 2.9-2.7 5.3-6 5.3z"/>
  </svg>
);

export const IconPencil = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M11 2l3 3-9 9H2v-3L11 2z" stroke={color || 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconChevronUp = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 10l4-4 4 4" stroke={color || 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconChevronDown = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6l4 4 4-4" stroke={color || 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
