const base = { viewBox: "0 0 24 24", "aria-hidden": true };

export function IconHome() {
  return (
    <svg {...base} fill="currentColor">
      <path d="M12 3 3 10.5V21h6.5v-6h5v6H21V10.5L12 3z" />
    </svg>
  );
}

export function IconPlay() {
  return (
    <svg {...base} fill="currentColor">
      <path d="M7 4.5v15l13-7.5-13-7.5z" />
    </svg>
  );
}

export function IconHistory() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
      <path d="M3.5 4.5v4.2h4.2" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function IconBook() {
  return (
    <svg {...base} fill="currentColor">
      <path d="M11 7.2C9.5 6 7.5 5.5 4 5.6v12.8c3.5-.1 5.5.4 7 1.5V7.2z" />
      <path d="M13 7.2c1.5-1.2 3.5-1.7 7-1.6v12.8c-3.5-.1-5.5.4-7 1.5V7.2z" />
    </svg>
  );
}

export function IconSettings() {
  return (
    <svg {...base} fill="currentColor">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  );
}

export function IconChevronDown() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconBriefcase() {
  return (
    <svg {...base} fill="currentColor">
      <path d="M9 5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7h-1.6V5.6h-2.8V7H9V5.5z" />
      <rect x="3.5" y="7" width="17" height="12.5" rx="2.5" />
      <path d="M3.5 12.6h17" stroke="var(--ic-bg, #f58220)" strokeWidth="1.4" />
      <rect x="10.4" y="11.2" width="3.2" height="3" rx="0.8" fill="var(--ic-bg, #f58220)" />
    </svg>
  );
}

export function IconRocket() {
  return (
    <svg {...base} fill="currentColor">
      <path
        fillRule="evenodd"
        d="M12 2c3.5 2 5.5 5.5 5.5 9.5 0 1.3-.3 2.6-.8 3.8H7.3c-.5-1.2-.8-2.5-.8-3.8C6.5 7.5 8.5 4 12 2zM12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"
      />
      <path d="M6.5 13l-3 3.5V20l3.5-1.5zM17.5 13l3 3.5V20L17 18.5zM10 17h4l-2 5z" />
    </svg>
  );
}

export function IconHouse() {
  return (
    <svg {...base} fill="currentColor">
      <path
        fillRule="evenodd"
        d="M12 3 2.5 11.5H5V20h14v-8.5h2.5L12 3zM10 20v-5.5h4V20z"
      />
    </svg>
  );
}

export function IconList() {
  return (
    <svg {...base} fill="currentColor">
      <circle cx="5" cy="7" r="1.7" />
      <circle cx="5" cy="12" r="1.7" />
      <circle cx="5" cy="17" r="1.7" />
      <path d="M9.5 7h10M9.5 12h10M9.5 17h10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconCheck() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function IconInfo() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.2" />
      <circle cx="12" cy="7.8" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function IconArrowRight() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
export function IconPlus() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconChevronRight() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function IconChat() {
  return (
    <svg {...base} fill="currentColor">
      <path d="M12 3.5c-4.7 0-8.5 3.2-8.5 7.2 0 2.2 1.2 4.2 3.1 5.5-.1 1.1-.6 2.2-1.4 3 1.7-.1 3.2-.7 4.3-1.6.8.2 1.6.3 2.5.3 4.7 0 8.5-3.2 8.5-7.2S16.7 3.5 12 3.5z" />
      <circle cx="8.3" cy="10.8" r="1.2" fill="var(--ic-dot, #3a2c26)" />
      <circle cx="12" cy="10.8" r="1.2" fill="var(--ic-dot, #3a2c26)" />
      <circle cx="15.7" cy="10.8" r="1.2" fill="var(--ic-dot, #3a2c26)" />
    </svg>
  );
}

export function IconStar() {
  return (
    <svg {...base} fill="currentColor">
      <path d="M12 2.8l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.6l-5.8 3.1 1.1-6.5L2.6 9.6l6.5-.9L12 2.8z" />
    </svg>
  );
}

export function IconTarget() {
  return (
    <svg {...base}>
      <circle cx="12" cy="12" r="9.5" fill="#fff" stroke="#e8432d" strokeWidth="2" />
      <circle cx="12" cy="12" r="5.8" fill="none" stroke="#e8432d" strokeWidth="2" />
      <circle cx="12" cy="12" r="2.4" fill="#e8432d" />
      <path d="M12 12l7.5-7.5" stroke="#8c5a2b" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconBan() {
  return (
    <svg {...base} fill="none" stroke="#e8432d" strokeWidth="2.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M5.8 5.8l12.4 12.4" />
    </svg>
  );
}

export function IconShieldCheck() {
  return (
    <svg {...base}>
      <path d="M12 2.8L4.5 5.6v5.6c0 4.6 3.1 8.2 7.5 10 4.4-1.8 7.5-5.4 7.5-10V5.6L12 2.8z" fill="#dcc33a" />
      <path d="M8.2 12.2l2.7 2.7 5-5.4" fill="none" stroke="#2d2a1f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconScaleLine() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3.5 3.5 0 0 0 6 0L5 7zM19 7l-3 7a3.5 3.5 0 0 0 6 0L19 7z" />
    </svg>
  );
}

export function IconTrophyLine() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
      <path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4" />
      <path d="M12 13v4M9.5 17h5M8.5 20h7" />
    </svg>
  );
}

export function IconSwapLine() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h13l-3.5-3.5M19 16H6l3.5 3.5" />
    </svg>
  );
}

export function IconTargetMono() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function IconBanMono() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8" />
    </svg>
  );
}

export function IconShieldMono() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 2.8v5.4c0 4.3-2.9 7.6-7 9.3-4.1-1.7-7-5-7-9.3V5.8L12 3z" />
      <path d="M8.8 12l2.3 2.3 4.2-4.6" />
    </svg>
  );
}

export function IconLayers() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 12.5l9 5 9-5" />
      <path d="M3 16.5l9 5 9-5" />
    </svg>
  );
}

export function IconBarsUp() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="14" width="3.5" height="6.5" rx="0.6" />
      <rect x="10.2" y="10.5" width="3.5" height="10" rx="0.6" />
      <rect x="16.5" y="7" width="3.5" height="13.5" rx="0.6" />
      <path d="M4 9.5l5-4 3.2 2.2L19 3" />
      <path d="M15.2 3H19v3.8" />
    </svg>
  );
}