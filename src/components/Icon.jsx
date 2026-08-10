// Lightweight inline SVG icon set (stroke-based, consistent 1.9 weight).
// Keeps the bundle dependency-free and every icon themeable via currentColor.

const paths = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  ),
  patients: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20a6 6 0 0 1 12 0M16 11h5M18.5 8.5v5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 9h18" />
    </>
  ),
  queue: (
    <>
      <path d="M3 12a9 9 0 1 1 9 9" />
      <path d="M3 12h4M12 7v5l3 2" />
    </>
  ),
  stethoscope: (
    <>
      <path d="M9 4h6a1 1 0 0 1 1 1v1h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V5a1 1 0 0 1 1-1z" />
      <path d="M12 11v4M10 13h4" />
    </>
  ),
  rx: <path d="M6 3h12v4l-4 5 4 5v4H6v-4l4-5-4-5z" />,
  lab: <path d="M9 3v6l-3 5a4 4 0 0 0 4 6h0a4 4 0 0 0 4-6l-3-5V3M8 3h6" />,
  pharmacy: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2M12 12v4M10 14h4" />
    </>
  ),
  billing: <path d="M4 5h16v5H4zM4 14h16v5H4zM8 7.5h.01M8 16.5h.01" />,
  payments: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </>
  ),
  inventory: (
    <>
      <path d="M4 7l8-4 8 4v10l-8 4-8-4z" />
      <path d="M4 7l8 4 8-4M12 11v10" />
    </>
  ),
  video: (
    <>
      <path d="M15 10l5-3v10l-5-3z" />
      <rect x="3" y="6" width="12" height="12" rx="2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M2 12h20M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </>
  ),
  reports: <path d="M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-3" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1.3l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.2-1.3L14 2h-4l-.3 2.1a7 7 0 0 0-2.2 1.3l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .9.1 1.3l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2.2 1.3L10 22h4l.3-2.1a7 7 0 0 0 2.2-1.3l2.3.9 2-3.4-2-1.5c.1-.4.1-.9.1-1.3z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </>
  ),
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  bell: <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0" />,
  plus: <path d="M12 5v14M5 12h14" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4l3 2" />
    </>
  ),
  rupee: <path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  trend: (
    <>
      <path d="M4 19V5M4 19h16" />
      <path d="M7 15l4-5 3 3 4-6" />
    </>
  ),
  brain: (
    <>
      <path d="M12 3a5 5 0 0 0-5 5c0 1.5.6 2.6 1.5 3.5C9 12 9 13 9 14h6c0-1 0-2 .5-2.5A5 5 0 0 0 12 3z" />
      <path d="M9 18h6M10 21h4" />
    </>
  ),
  alert: <path d="M12 9v4M12 17h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />,
  send: <path d="M4 12l16-8-6 16-3-6-7-2z" />,
  check: <path d="M20 6 9 17l-5-5" />,
  box: <path d="M4 7l8-4 8 4v10l-8 4-8-4z" />,
  logo: (
    <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h5v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2z" />
  ),
}

export default function Icon({ name, size = 18, className = '', strokeWidth = 1.9, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {paths[name] || null}
    </svg>
  )
}
