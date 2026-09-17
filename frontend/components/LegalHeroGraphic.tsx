export default function LegalHeroGraphic() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto lg:mx-0 lg:ml-auto flex items-center justify-center select-none pointer-events-none py-8 lg:py-2">
      {/* Radial ambient behind the graphic */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_55%_45%,rgba(255,255,255,0.025),transparent_70%)]" />

      <svg
        viewBox="0 0 440 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto hero-graphic-float"
        aria-hidden="true"
      >
        <defs>
          <pattern id="mesh" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#1e1e1e" strokeWidth="0.4" />
          </pattern>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowStrong" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="bridgeRed" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#c04040" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#882222" stopOpacity="0.5" />
            <stop offset="1" stopColor="#c04040" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="bridgeAmber" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#b07820" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#7a5010" stopOpacity="0.4" />
            <stop offset="1" stopColor="#b07820" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Background coordinate axes */}
        <g stroke="#1a1a1a" strokeWidth="0.6" opacity="0.9">
          <line x1="0" y1="190" x2="440" y2="190" strokeDasharray="2 4" />
          <line x1="220" y1="0" x2="220" y2="380" strokeDasharray="2 4" />
        </g>
        {/* Corner crosshairs */}
        <g stroke="#252525" strokeWidth="0.8">
          <path d="M 20 18 L 26 18 M 23 15 L 23 21" />
          <path d="M 414 18 L 420 18 M 417 15 L 417 21" />
          <path d="M 20 362 L 26 362 M 23 359 L 23 365" />
          <path d="M 414 362 L 420 362 M 417 359 L 417 365" />
        </g>
        <text x="23" y="13" fill="#2e2e2e" fontSize="6.5" fontFamily="monospace" letterSpacing="0.06em">
          FIG 1.0 - DUAL REDLINE MATRIX
        </text>

        {/* CONTRACT A */}
        <g transform="translate(28, 50) rotate(-6, 77, 111)">
          <rect x="0" y="0" width="154" height="222" rx="5" fill="#121622" stroke="#2e374a" strokeWidth="1.2" />
          <rect x="0" y="0" width="154" height="222" rx="5" fill="url(#mesh)" opacity="0.4" />
          <path d="M 128 0 L 154 26 L 128 26 Z" fill="#181d2c" stroke="#2e374a" strokeWidth="0.8" />
          <line x1="128" y1="0" x2="154" y2="26" stroke="#2e374a" strokeWidth="0.8" />
          <rect x="14" y="14" width="68" height="14" rx="2.5" fill="#181e2e" stroke="#2e374a" strokeWidth="0.6" />
          <text x="19" y="23.5" fill="#94a3b8" fontSize="7" fontFamily="monospace" letterSpacing="0.06em">PARTY A - DRAFT</text>
          <text x="14" y="39" fill="#64748b" fontSize="5.5" fontFamily="monospace">REF: MSA-2024-001-A</text>
          <rect x="14" y="46" width="126" height="3" rx="1.5" fill="#252d3d" />
          <rect x="14" y="54" width="110" height="3" rx="1.5" fill="#1e2433" />
          <rect x="14" y="62" width="118" height="3" rx="1.5" fill="#1e2433" />
          <rect x="14" y="76" width="126" height="30" rx="3" fill="#2a1212" stroke="#5c2020" strokeWidth="0.8" />
          <rect x="14" y="76" width="3" height="30" rx="1" fill="#ef4444" />
          <text x="22" y="88" fill="#fca5a5" fontSize="6.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.04em">4.2  LIABILITY CLAUSE</text>
          <text x="22" y="98" fill="#f87171" fontSize="6" fontFamily="sans-serif" fontStyle="italic">Unlimited liability, no cap</text>
          <rect x="14" y="116" width="126" height="3" rx="1.5" fill="#1e2433" />
          <rect x="14" y="124" width="98" height="3" rx="1.5" fill="#252d3d" />
          <rect x="14" y="138" width="126" height="30" rx="3" fill="#261b09" stroke="#5e3c0b" strokeWidth="0.8" />
          <rect x="14" y="138" width="3" height="30" rx="1" fill="#d97706" />
          <text x="22" y="150" fill="#fcd34d" fontSize="6.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.04em">9.1  PAYMENT TERMS</text>
          <text x="22" y="160" fill="#fbbf24" fontSize="6" fontFamily="sans-serif" fontStyle="italic">Net 30 days from invoice</text>
          <rect x="14" y="178" width="126" height="3" rx="1.5" fill="#1e2433" />
          <rect x="14" y="186" width="80" height="3" rx="1.5" fill="#252d3d" />
          <line x1="14" y1="205" x2="70" y2="205" stroke="#2e374a" strokeWidth="1" />
          <text x="14" y="215" fill="#64748b" fontSize="5.5" fontFamily="monospace">0x9e4a-f2c1</text>
        </g>

        {/* CONTRACT B */}
        <g transform="translate(258, 60) rotate(6, 77, 111)">
          <rect x="0" y="0" width="154" height="222" rx="5" fill="#141926" stroke="#323c52" strokeWidth="1.2" />
          <rect x="0" y="0" width="154" height="222" rx="5" fill="url(#mesh)" opacity="0.4" />
          <path d="M 128 0 L 154 26 L 128 26 Z" fill="#1c2336" stroke="#323c52" strokeWidth="0.8" />
          <line x1="128" y1="0" x2="154" y2="26" stroke="#323c52" strokeWidth="0.8" />
          <rect x="14" y="14" width="72" height="14" rx="2.5" fill="#1c2336" stroke="#323c52" strokeWidth="0.6" />
          <text x="19" y="23.5" fill="#94a3b8" fontSize="7" fontFamily="monospace" letterSpacing="0.06em">PARTY B - REDLINE</text>
          <text x="14" y="39" fill="#64748b" fontSize="5.5" fontFamily="monospace">REF: MSA-2024-001-B</text>
          <rect x="14" y="46" width="126" height="3" rx="1.5" fill="#252d3d" />
          <rect x="14" y="54" width="118" height="3" rx="1.5" fill="#1e2433" />
          <rect x="14" y="62" width="104" height="3" rx="1.5" fill="#1e2433" />
          <rect x="14" y="76" width="126" height="30" rx="3" fill="#2a1212" stroke="#5c2020" strokeWidth="0.8" />
          <rect x="14" y="76" width="3" height="30" rx="1" fill="#ef4444" />
          <text x="22" y="88" fill="#fca5a5" fontSize="6.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.04em">4.2  LIABILITY CLAUSE</text>
          <text x="22" y="98" fill="#f87171" fontSize="6" fontFamily="sans-serif" fontStyle="italic">Cap at 1x annual fees paid</text>
          <rect x="14" y="116" width="126" height="3" rx="1.5" fill="#1e2433" />
          <rect x="14" y="124" width="108" height="3" rx="1.5" fill="#252d3d" />
          <rect x="14" y="138" width="126" height="30" rx="3" fill="#261b09" stroke="#5e3c0b" strokeWidth="0.8" />
          <rect x="14" y="138" width="3" height="30" rx="1" fill="#d97706" />
          <text x="22" y="150" fill="#fcd34d" fontSize="6.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.04em">9.1  PAYMENT TERMS</text>
          <text x="22" y="160" fill="#fbbf24" fontSize="6" fontFamily="sans-serif" fontStyle="italic">Net 60 days from invoice</text>
          <rect x="14" y="178" width="126" height="3" rx="1.5" fill="#1e2433" />
          <rect x="14" y="186" width="92" height="3" rx="1.5" fill="#252d3d" />
          <line x1="14" y1="205" x2="70" y2="205" stroke="#2e374a" strokeWidth="1" />
          <text x="14" y="215" fill="#64748b" fontSize="5.5" fontFamily="monospace">0x3a8b-d4e7</text>
        </g>

        {/* CONFLICT BRIDGES */}
        <path d="M 176 146 C 198 138, 230 138, 260 146" stroke="url(#bridgeRed)" strokeWidth="1.4" strokeDasharray="4 3" opacity="0.85" />
        <circle cx="176" cy="146" r="3.5" fill="#c04040" filter="url(#glow)" />
        <circle cx="176" cy="146" r="8" fill="#c04040" opacity="0.1" />
        <circle cx="260" cy="146" r="3.5" fill="#c04040" filter="url(#glow)" />
        <circle cx="260" cy="146" r="8" fill="#c04040" opacity="0.1" />

        <path d="M 176 208 C 198 222, 230 222, 260 208" stroke="url(#bridgeAmber)" strokeWidth="1.4" strokeDasharray="4 3" opacity="0.85" />
        <circle cx="176" cy="208" r="3.5" fill="#b07820" filter="url(#glow)" />
        <circle cx="176" cy="208" r="8" fill="#b07820" opacity="0.1" />
        <circle cx="260" cy="208" r="3.5" fill="#b07820" filter="url(#glow)" />
        <circle cx="260" cy="208" r="8" fill="#b07820" opacity="0.1" />

        {/* Vertical connector to nexus */}
        <line x1="220" y1="232" x2="220" y2="278" stroke="#1d4e36" strokeWidth="1" strokeDasharray="2 3" />
        <circle cx="220" cy="278" r="2.5" fill="#34d399" />

        {/* AI NEXUS CARD */}
        <g transform="translate(128, 286)">
          <rect x="-3" y="-3" width="190" height="82" rx="8" fill="none" stroke="#1d4e36" strokeWidth="1" opacity="0.6" />
          <rect x="0" y="0" width="184" height="76" rx="6" fill="#0d2319" stroke="#1d4e36" strokeWidth="1.2" />
          <rect x="0" y="0" width="184" height="76" rx="6" fill="url(#mesh)" opacity="0.2" />
          <rect x="0" y="0" width="184" height="22" rx="6" fill="#133626" />
          <rect x="0" y="16" width="184" height="6" fill="#133626" />
          <circle cx="14" cy="11" r="3.5" fill="#34d399" filter="url(#glowStrong)" />
          <circle cx="14" cy="11" r="7" fill="#34d399" opacity="0.2" />
          <text x="26" y="14.5" fill="#6ee7b7" fontSize="7.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.08em">AI COMPROMISE BRIDGE</text>
          <line x1="12" y1="27" x2="172" y2="27" stroke="#1d4e36" strokeWidth="0.7" />
          <text x="12" y="39" fill="#a7f3d0" fontSize="6.5" fontFamily="monospace" letterSpacing="0.04em">4.2: Cap 2x annual fees, negligence carve-out</text>
          <text x="12" y="52" fill="#a7f3d0" fontSize="6.5" fontFamily="monospace" letterSpacing="0.04em">9.1: Net 45 days, 1.5% penalty per month</text>
          <line x1="12" y1="60" x2="172" y2="60" stroke="#1d4e36" strokeWidth="0.7" />
          <circle cx="21" cy="69" r="2.5" fill="#34d399" />
          <text x="29" y="72" fill="#6ee7b7" fontSize="6" fontFamily="monospace">2 CONFLICTS RESOLVED</text>
          <rect x="142" y="62" width="34" height="12" rx="2.5" fill="#174f35" stroke="#2e8058" strokeWidth="0.7" />
          <text x="147.5" y="70.5" fill="#a7f3d0" fontSize="6" fontFamily="monospace" fontWeight="bold">ACCEPTED</text>
        </g>

        <text x="348" y="376" fill="#64748b" fontSize="6" fontFamily="monospace" letterSpacing="0.06em">EQUILIBRIUM: 100%</text>
      </svg>
    </div>
  );
}
