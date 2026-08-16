function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export default function Gauge({ value, max = 150 }) {
  const clamped = Math.max(0, Math.min(value, max));
  const angle = 180 - (clamped / max) * 180;
  const arcPath = describeArc(100, 100, 80, 180, 0);
  const ticks = [0, 40, 80, 120, 150];

  return (
    <svg viewBox="0 0 200 115" className="w-40 h-24 sm:w-48 sm:h-28 flex-shrink-0">
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--error)" />
          <stop offset="50%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--success)" />
        </linearGradient>
      </defs>
      <path
        d={arcPath}
        fill="none"
        stroke="url(#gaugeGrad)"
        strokeWidth="9"
        strokeLinecap="round"
        opacity="0.9"
      />
      {ticks.map((t) => {
        const a = 180 - (t / max) * 180;
        const p1 = polarToCartesian(100, 100, 80, a);
        const p2 = polarToCartesian(100, 100, 70, a);
        const lp = polarToCartesian(100, 100, 58, a);
        return (
          <g key={t}>
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--border-light)" strokeWidth="1.5" />
            <text x={lp.x} y={lp.y} fontSize="8" fill="var(--text-faint)" textAnchor="middle">
              {t}
            </text>
          </g>
        );
      })}
      <g
        style={{
          transform: `rotate(${90 - angle}deg)`,
          transformOrigin: "100px 100px",
          transition: "transform 0.5s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <line x1="100" y1="100" x2="100" y2="32" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx="100" cy="100" r="6" fill="var(--accent)" stroke="var(--bg-card)" strokeWidth="2" />
    </svg>
  );
}
