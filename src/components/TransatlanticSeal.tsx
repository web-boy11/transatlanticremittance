type Props = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

const SIZES = {
  sm: 'size-7',
  md: 'size-10',
  lg: 'size-14',
  xl: 'size-20',
};

export default function TransatlanticSeal({ size = 'md', className = '' }: Props) {
  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full select-none ${SIZES[size]} ${className}`}
      title="Transatlantic Joint Task Force Official Insignia"
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tatf-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f7dc87" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#997517" />
          </linearGradient>
          <linearGradient id="tatf-navy" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#08142c" />
          </linearGradient>
          <radialGradient id="tatf-globe-radial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0a1a3a" stopOpacity="0.9" />
          </radialGradient>
        </defs>

        {/* Outer Ring with Gold Trim */}
        <circle cx="60" cy="60" r="58" fill="url(#tatf-navy)" stroke="url(#tatf-gold)" strokeWidth="3" />
        <circle cx="60" cy="60" r="53" fill="none" stroke="#d4af37" strokeWidth="0.75" strokeDasharray="2 2" />

        {/* 12 Stars on Ring — slow rotating group */}
        <g className="origin-center animate-seal-rotate" style={{ transformOrigin: '60px 60px' }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = 60 + 47 * Math.cos(angle);
            const y = 60 + 47 * Math.sin(angle);
            return (
              <polygon
                key={i}
                points={`${x},${y - 2.5} ${x + 0.8},${y - 0.8} ${x + 2.5},${y - 0.8} ${x + 1.2},${y + 0.5} ${x + 1.8},${y + 2.2} ${x},${y + 1.2} ${x - 1.8},${y + 2.2} ${x - 1.2},${y + 0.5} ${x - 2.5},${y - 0.8} ${x - 0.8},${y - 0.8}`}
                fill="url(#tatf-gold)"
              />
            );
          })}
        </g>

        {/* Inner Shield Field */}
        <circle cx="60" cy="60" r="39" fill="url(#tatf-globe-radial)" stroke="#60a5fa" strokeWidth="1" />

        {/* Transatlantic Latitude / Longitude Curvature Lines */}
        <ellipse cx="60" cy="60" rx="36" ry="16" fill="none" stroke="#60a5fa" strokeOpacity="0.35" strokeWidth="0.8" />
        <ellipse cx="60" cy="60" rx="36" ry="28" fill="none" stroke="#60a5fa" strokeOpacity="0.25" strokeWidth="0.8" />
        <line x1="24" y1="60" x2="96" y2="60" stroke="#60a5fa" strokeOpacity="0.5" strokeWidth="0.8" />
        <ellipse cx="60" cy="60" rx="16" ry="36" fill="none" stroke="#60a5fa" strokeOpacity="0.3" strokeWidth="0.8" />

        {/* Transatlantic Compass Star / Navigational Cross */}
        <g transform="translate(60, 60)">
          {/* North Star Spike */}
          <polygon points="0,-24 4,-6 0,0" fill="#f8fafc" />
          <polygon points="0,-24 -4,-6 0,0" fill="#94a3b8" />
          {/* South Star Spike */}
          <polygon points="0,24 -4,6 0,0" fill="#f8fafc" />
          <polygon points="0,24 4,6 0,0" fill="#94a3b8" />
          {/* East Star Spike */}
          <polygon points="24,0 6,4 0,0" fill="#f8fafc" />
          <polygon points="24,0 6,-4 0,0" fill="#94a3b8" />
          {/* West Star Spike */}
          <polygon points="-24,0 -6,-4 0,0" fill="#f8fafc" />
          <polygon points="-24,0 -6,4 0,0" fill="#94a3b8" />

          {/* Diagonal Secondary Spikes */}
          <polygon points="12,-12 4,-1 0,0" fill="url(#tatf-gold)" />
          <polygon points="-12,-12 -1,-4 0,0" fill="url(#tatf-gold)" />
          <polygon points="12,12 1,4 0,0" fill="url(#tatf-gold)" />
          <polygon points="-12,12 -4,1 0,0" fill="url(#tatf-gold)" />

          {/* Central Gold Core */}
          <circle cx="0" cy="0" r="4.5" fill="url(#tatf-gold)" stroke="#0a1428" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}
