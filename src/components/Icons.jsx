const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.8',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const IconHome = (p) => (
  <svg {...base} {...p}>
    <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-7H10v7H5a1 1 0 0 1-1-1z" />
  </svg>
)
export const IconBox = (p) => (
  <svg {...base} {...p}>
    <path d="M3 8.5 12 4l9 4.5-9 4.5z" />
    <path d="M3 8.5v7L12 20l9-4.5v-7" />
    <path d="M12 13v7" />
  </svg>
)
export const IconClipboard = (p) => (
  <svg {...base} {...p}>
    <rect x="6" y="4" width="12" height="16" rx="2" />
    <path d="M9 4.5h6v3H9z" />
    <path d="M9 11h6M9 14h4" />
  </svg>
)
export const IconScan = (p) => (
  <svg {...base} {...p}>
    <path d="M7 4H5a1 1 0 0 0-1 1v2M17 4h2a1 1 0 0 1 1 1v2M4 17v2a1 1 0 0 0 1 1h2M20 17v2a1 1 0 0 1-1 1h-2" />
    <path d="M7 12h10" />
  </svg>
)
export const IconReport = (p) => (
  <svg {...base} {...p}>
    <path d="M7 3h8l4 4v14H7z" />
    <path d="M15 3v4h4M9 13h6M9 17h4" />
  </svg>
)
export const IconSettings = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.7.9 1.2 1.5 1.2H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
)
export const IconSearch = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)
export const IconBell = (p) => (
  <svg {...base} {...p}>
    <path d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
)
export const IconUser = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 19c1.6-3 4-4.5 7-4.5S17.4 16 19 19" />
  </svg>
)
export const IconLock = (p) => (
  <svg {...base} {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)
export const IconTrash = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M9 7V5h6v2M8 7l1 13h6l1-13" />
  </svg>
)
export const IconEye = (p) => (
  <svg {...base} {...p}>
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
export const IconPencil = (p) => (
  <svg {...base} {...p}>
    <path d="M4 20h4L19 9l-4-4L4 16z" />
    <path d="m13 5 4 4" />
  </svg>
)
export const IconQr = (p) => (
  <svg {...base} {...p}>
    <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4z" />
    <path d="M14 14h3v3h-3zM18 18h2v2h-2z" />
  </svg>
)
export const IconPlus = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
export const IconCheck = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-6" />
  </svg>
)
export const IconBorrow = (p) => (
  <svg {...base} {...p}>
    <path d="M8 7h11v10H8" />
    <path d="M12 12H3m0 0 3-3M3 12l3 3" />
  </svg>
)
export const IconScanBadge = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <path d="M8 12h8" />
  </svg>
)
export const IconCube = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3 21 8v8l-9 5-9-5V8z" />
    <path d="M12 13 3 8m9 5 9-5M12 13v8" />
  </svg>
)
export const IconDownload = (p) => (
  <svg {...base} {...p}>
    <path d="M12 4v12m0 0 4-4m-4 4-4-4M5 20h14" />
  </svg>
)
export const IconPrint = (p) => (
  <svg {...base} {...p}>
    <path d="M7 8V4h10v4" />
    <path d="M7 16H5a2 2 0 0 1-2-2v-4h18v4a2 2 0 0 1-2 2h-2" />
    <rect x="7" y="14" width="10" height="6" />
  </svg>
)
export const IconCalendar = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M8 3v4M16 3v4M4 10h16" />
  </svg>
)
export const IconWrench = (p) => (
  <svg {...base} {...p}>
    <path d="M14.7 6.3a4 4 0 0 0-5.6 5.6L4 17v3h3l5.1-5.1a4 4 0 0 0 5.6-5.6L16 11z" />
  </svg>
)
export const IconBack = (p) => (
  <svg {...base} {...p}>
    <path d="M15 6 9 12l6 6" />
  </svg>
)
export const IconLogout = (p) => (
  <svg {...base} {...p}>
    <path d="M10 7V5a1 1 0 0 1 1-1h8v16h-8a1 1 0 0 1-1-1v-2" />
    <path d="M4 12h10M4 12l3-3M4 12l3 3" />
  </svg>
)
export const IconUp = (p) => (
  <svg {...base} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)
export const IconDown = (p) => (
  <svg {...base} {...p}>
    <path d="M7 7l10 10M17 8v9H8" />
  </svg>
)
export const IconWarn = (p) => (
  <svg {...base} {...p}>
    <path d="M12 4 3 20h18z" />
    <path d="M12 10v5M12 17.5v.5" />
  </svg>
)
export const IconClose = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
export const IconHeart = (p) => (
  <svg {...base} {...p}>
    <path d="M12 20s-7-4.4-9-9.2C1.6 7.6 3.5 5 6.4 5c1.7 0 3.1.9 3.6 2.2C10.5 5.9 11.9 5 13.6 5 16.5 5 18.4 7.6 17 10.8 15 15.6 12 20 12 20z" />
  </svg>
)
export const IconCamera = (p) => (
  <svg {...base} {...p}>
    <path d="M4 8h3l2-2h6l2 2h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
)
