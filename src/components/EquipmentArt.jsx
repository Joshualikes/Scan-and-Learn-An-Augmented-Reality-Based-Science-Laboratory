export function EquipmentArt({ type, className = '' }) {
  const art = {
    Microscope: (
      <svg viewBox="0 0 120 90" className={className} aria-hidden="true">
        <rect x="8" y="62" width="70" height="10" rx="4" fill="#cfd8e3" />
        <rect x="28" y="48" width="28" height="16" rx="4" fill="#9aa7b8" />
        <rect x="38" y="18" width="10" height="34" rx="3" fill="#6b7787" />
        <circle cx="43" cy="16" r="10" fill="#4a5563" />
        <circle cx="43" cy="16" r="5" fill="#dbe7ff" />
        <rect x="46" y="28" width="28" height="8" rx="3" fill="#8b5a2b" transform="rotate(18 46 28)" />
        <ellipse cx="86" cy="58" rx="16" ry="10" fill="#8fd3ff" />
        <ellipse cx="86" cy="56" rx="10" ry="6" fill="#e8f7ff" />
      </svg>
    ),
    Beaker: (
      <svg viewBox="0 0 120 90" className={className} aria-hidden="true">
        <path d="M40 18h40l-6 50a14 14 0 0 1-14 12h-1a14 14 0 0 1-14-12L40 18z" fill="#d7f3ff" stroke="#7aa7c2" strokeWidth="3" />
        <path d="M38 18h44" stroke="#7aa7c2" strokeWidth="4" strokeLinecap="round" />
        <path d="M44 48h32l-3 22a10 10 0 0 1-10 8h-6a10 10 0 0 1-10-8L44 48z" fill="#4fc3f7" />
        <circle cx="92" cy="28" r="8" fill="#4fc3f7" opacity=".7" />
        <circle cx="28" cy="36" r="6" fill="#81d4fa" />
      </svg>
    ),
    'Test Tube Rack': (
      <svg viewBox="0 0 120 90" className={className} aria-hidden="true">
        <rect x="18" y="58" width="84" height="14" rx="3" fill="#8d6e63" />
        <rect x="26" y="22" width="12" height="44" rx="6" fill="#80deea" />
        <rect x="46" y="16" width="12" height="50" rx="6" fill="#ef9a9a" />
        <rect x="66" y="24" width="12" height="42" rx="6" fill="#fff59d" />
        <rect x="86" y="20" width="12" height="46" rx="6" fill="#a5d6a7" />
        <rect x="22" y="48" width="76" height="8" rx="2" fill="#6d4c41" />
      </svg>
    ),
    Thermometer: (
      <svg viewBox="0 0 120 90" className={className} aria-hidden="true">
        <rect x="54" y="8" width="12" height="54" rx="6" fill="#eceff1" stroke="#90a4ae" />
        <rect x="58" y="22" width="4" height="36" rx="2" fill="#e53935" />
        <circle cx="60" cy="70" r="12" fill="#e53935" />
        <circle cx="60" cy="70" r="6" fill="#ffcdd2" />
      </svg>
    ),
    Balance: (
      <svg viewBox="0 0 120 90" className={className} aria-hidden="true">
        <rect x="22" y="58" width="76" height="18" rx="6" fill="#cfd8dc" />
        <rect x="30" y="36" width="60" height="24" rx="6" fill="#eceff1" stroke="#90a4ae" />
        <rect x="38" y="22" width="44" height="16" rx="4" fill="#b0bec5" />
        <rect x="48" y="12" width="24" height="12" rx="3" fill="#78909c" />
        <text x="60" y="52" textAnchor="middle" fontSize="10" fill="#37474f" fontFamily="Poppins">0.00g</text>
      </svg>
    ),
    'Safety Goggles': (
      <svg viewBox="0 0 120 90" className={className} aria-hidden="true">
        <path d="M18 40h84" stroke="#455a64" strokeWidth="6" />
        <ellipse cx="42" cy="48" rx="18" ry="16" fill="#bbdefb" stroke="#455a64" strokeWidth="4" />
        <ellipse cx="78" cy="48" rx="18" ry="16" fill="#bbdefb" stroke="#455a64" strokeWidth="4" />
        <path d="M58 48h4" stroke="#455a64" strokeWidth="4" />
      </svg>
    ),
    'X-Ray Machine': (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        <rect x="18" y="70" width="104" height="18" rx="4" fill="#c5d0dc" />
        <rect x="28" y="62" width="84" height="12" rx="3" fill="#9eb0c4" />
        <rect x="64" y="18" width="12" height="46" rx="3" fill="#5d6d7e" />
        <rect x="42" y="14" width="56" height="16" rx="4" fill="#2f80ed" />
        <rect x="86" y="28" width="28" height="10" rx="3" fill="#90caf9" />
        <circle cx="48" cy="22" r="4" fill="#bbdefb" />
      </svg>
    ),
    'Ultrasound Machine': (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        <rect x="38" y="18" width="64" height="52" rx="8" fill="#eceff1" stroke="#90a4ae" />
        <rect x="46" y="26" width="48" height="30" rx="4" fill="#4fc3f7" />
        <rect x="44" y="72" width="52" height="18" rx="4" fill="#78909c" />
        <path d="M96 78c18 4 24 18 10 24" stroke="#90a4ae" strokeWidth="6" fill="none" />
        <ellipse cx="108" cy="100" rx="10" ry="6" fill="#b0bec5" />
      </svg>
    ),
    'ECG Machine': (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        <rect x="22" y="22" width="96" height="66" rx="10" fill="#eceff1" stroke="#90a4ae" />
        <rect x="32" y="32" width="76" height="32" rx="4" fill="#263238" />
        <polyline points="36,50 48,50 54,38 64,62 72,46 80,50 104,50" fill="none" stroke="#69f0ae" strokeWidth="3" />
        <circle cx="40" cy="74" r="4" fill="#ef5350" />
        <circle cx="54" cy="74" r="4" fill="#66bb6a" />
      </svg>
    ),
    Ventilator: (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        <rect x="30" y="16" width="80" height="78" rx="10" fill="#eceff1" stroke="#90a4ae" />
        <rect x="40" y="26" width="60" height="28" rx="4" fill="#81d4fa" />
        <rect x="40" y="60" width="18" height="18" rx="3" fill="#90a4ae" />
        <rect x="64" y="60" width="18" height="18" rx="3" fill="#90a4ae" />
        <rect x="88" y="60" width="18" height="18" rx="3" fill="#4db6ac" />
      </svg>
    ),
    'CT Scanner': (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        <ellipse cx="70" cy="58" rx="48" ry="32" fill="#cfd8dc" />
        <ellipse cx="70" cy="58" rx="24" ry="16" fill="#eceff1" />
        <rect x="22" y="70" width="96" height="14" rx="4" fill="#90a4ae" />
        <rect x="38" y="78" width="64" height="8" rx="3" fill="#78909c" />
      </svg>
    ),
    'MRI Scanner': (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        <rect x="24" y="28" width="92" height="54" rx="24" fill="#90caf9" />
        <rect x="40" y="40" width="60" height="30" rx="14" fill="#e3f2fd" />
        <rect x="20" y="72" width="100" height="12" rx="4" fill="#64b5f6" />
      </svg>
    ),
    Defibrillator: (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        <rect x="30" y="22" width="80" height="66" rx="10" fill="#ffebee" stroke="#e53935" />
        <path d="M68 34 56 56h12l-8 24 24-32H70z" fill="#e53935" />
      </svg>
    ),
    'Infusion Pump': (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        <rect x="48" y="18" width="44" height="70" rx="8" fill="#eceff1" stroke="#90a4ae" />
        <rect x="56" y="28" width="28" height="20" rx="3" fill="#80cbc4" />
        <rect x="58" y="54" width="24" height="8" rx="2" fill="#b0bec5" />
        <rect x="68" y="8" width="6" height="14" fill="#90a4ae" />
      </svg>
    ),
    'C-Arm X-Ray': (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        <path d="M38 78c0-28 16-50 40-50h8" stroke="#90a4ae" strokeWidth="12" fill="none" />
        <rect x="78" y="22" width="28" height="14" rx="4" fill="#2f80ed" />
        <rect x="28" y="70" width="36" height="16" rx="4" fill="#78909c" />
        <rect x="22" y="86" width="96" height="10" rx="3" fill="#cfd8dc" />
      </svg>
    ),
  }

  return art[type] || (
    <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
      <rect x="28" y="22" width="84" height="66" rx="10" fill="#eceff1" stroke="#90a4ae" />
      <rect x="40" y="34" width="60" height="24" rx="4" fill="#b3e5fc" />
      <circle cx="52" cy="72" r="6" fill="#66bb6a" />
      <circle cx="70" cy="72" r="6" fill="#42a5f5" />
      <circle cx="88" cy="72" r="6" fill="#ffa726" />
    </svg>
  )
}
