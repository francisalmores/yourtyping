"use client";

const ROWS = [
  [
    { k: "`", w: 44 },
    { k: "1", w: 44 },
    { k: "2", w: 44 },
    { k: "3", w: 44 },
    { k: "4", w: 44 },
    { k: "5", w: 44 },
    { k: "6", w: 44 },
    { k: "7", w: 44 },
    { k: "8", w: 44 },
    { k: "9", w: 44 },
    { k: "0", w: 44 },
    { k: "-", w: 44 },
    { k: "=", w: 44 },
    { k: "⌫", w: 70, mod: true },
  ],
  [
    { k: "Tab", w: 60, mod: true },
    { k: "q", w: 44 },
    { k: "w", w: 44 },
    { k: "e", w: 44 },
    { k: "r", w: 44 },
    { k: "t", w: 44 },
    { k: "y", w: 44 },
    { k: "u", w: 44 },
    { k: "i", w: 44 },
    { k: "o", w: 44 },
    { k: "p", w: 44 },
    { k: "[", w: 44 },
    { k: "]", w: 44 },
    { k: "\\", w: 44 },
  ],
  [
    { k: "Caps", w: 70, mod: true },
    { k: "a", w: 44 },
    { k: "s", w: 44 },
    { k: "d", w: 44 },
    { k: "f", w: 44 },
    { k: "g", w: 44 },
    { k: "h", w: 44 },
    { k: "j", w: 44 },
    { k: "k", w: 44 },
    { k: "l", w: 44 },
    { k: ";", w: 44 },
    { k: "'", w: 44 },
    { k: "Enter", w: 80, mod: true },
  ],
  [
    { k: "Shift", w: 90, mod: true },
    { k: "z", w: 44 },
    { k: "x", w: 44 },
    { k: "c", w: 44 },
    { k: "v", w: 44 },
    { k: "b", w: 44 },
    { k: "n", w: 44 },
    { k: "m", w: 44 },
    { k: ",", w: 44 },
    { k: ".", w: 44 },
    { k: "/", w: 44 },
    { k: "Shift", w: 90, mod: true },
  ],
];

const KEY_GRADIENT = "linear-gradient(180deg, var(--kb-key-1) 0%, var(--kb-key-2) 100%)";
const MOD_GRADIENT = "linear-gradient(180deg, var(--kb-mod-1) 0%, var(--kb-mod-2) 100%)";
const ACTIVE_GRADIENT = "linear-gradient(180deg, #F6C744 0%, #EAB308 100%)";

export default function Keyboard({ activeChar, keyStats }) {
  const active = (activeChar || "").toLowerCase();
  const isHeatmap = !!keyStats;
  const maxPresses = isHeatmap
    ? Math.max(1, ...Object.values(keyStats).map((k) => k.presses))
    : 1;

  function cellStyle(key) {
    const keyId = key.k.toLowerCase();
    const stat = isHeatmap ? keyStats[keyId] : null;
    const presses = stat?.presses || 0;
    const errors = stat?.errors || 0;
    const isActive = !isHeatmap && !key.mod && keyId === active;

    if (isActive) {
      return { background: ACTIVE_GRADIENT, border: "1px solid #D69E0A", color: "#111111" };
    }
    if (isHeatmap && presses > 0) {
      const intensity = presses / maxPresses;
      const base = errors > presses / 2 ? [220, 38, 38] : [234, 179, 8];
      const alpha1 = 0.12 + intensity * 0.35;
      const alpha2 = 0.22 + intensity * 0.35;
      return {
        background: `linear-gradient(180deg, rgba(${base[0]},${base[1]},${base[2]},${alpha1}) 0%, rgba(${base[0]},${base[1]},${base[2]},${alpha2}) 100%)`,
        border: `1px solid rgba(${base[0]},${base[1]},${base[2]},${0.3 + intensity * 0.3})`,
        color: "var(--text-primary)",
      };
    }
    return {
      background: key.mod ? MOD_GRADIENT : KEY_GRADIENT,
      border: "1px solid var(--kb-border)",
      color: key.mod ? "var(--text-faint)" : "var(--kb-text)",
    };
  }

  return (
    <div>
      <div className="flex flex-col gap-1.5 items-center">
        {ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1.5">
            {row.map((key, ki) => {
              const keyId = key.k.toLowerCase();
              const stat = isHeatmap ? keyStats[keyId] : null;
              const isActive = !isHeatmap && !key.mod && keyId === active;
              const style = cellStyle(key);
              return (
                <div
                  key={ki}
                  className="rounded-md flex flex-col items-center justify-center text-xs font-bold uppercase"
                  style={{
                    ...style,
                    width: key.w,
                    height: 40,
                    boxShadow: isActive ? "none" : "0 1px 0 rgba(0,0,0,0.03)",
                    transition: "background 0.1s ease, transform 0.1s ease",
                    transform: isActive ? "translateY(1px)" : "none",
                    lineHeight: 1,
                  }}
                >
                  <span>{key.k}</span>
                  {isHeatmap && stat?.presses > 0 && (
                    <span style={{ fontSize: 8, fontWeight: 700, opacity: 0.55, marginTop: 2 }}>
                      {stat.presses}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <div
          className="rounded-md flex flex-col items-center justify-center"
          style={{
            width: 420,
            height: 40,
            ...(isHeatmap
              ? cellStyle({ k: " ", mod: false })
              : {
                  background: active === " " ? ACTIVE_GRADIENT : KEY_GRADIENT,
                  border: `1px solid ${active === " " ? "#D69E0A" : "var(--kb-border)"}`,
                }),
            transition: "background 0.1s ease",
          }}
        >
          {isHeatmap && keyStats[" "]?.presses > 0 && (
            <span style={{ fontSize: 8, fontWeight: 700, opacity: 0.55 }}>{keyStats[" "].presses}</span>
          )}
        </div>
      </div>
    </div>
  );
}
