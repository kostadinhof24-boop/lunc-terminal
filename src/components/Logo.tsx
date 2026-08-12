export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="moonGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FFD84D" />
          <stop offset="100%" stopColor="#F7D33F" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Orbite */}
      <circle cx="50" cy="50" r="45" stroke="#FFD84D" strokeWidth="1.5" opacity="0.4" />
      {/* Lune */}
      <circle cx="50" cy="50" r="28" fill="url(#moonGrad)" filter="url(#glow)" />
      {/* Croissant d'ombre spatial */}
      <circle cx="62" cy="42" r="28" fill="#020712" opacity="0.9" />
    </svg>
  );
}