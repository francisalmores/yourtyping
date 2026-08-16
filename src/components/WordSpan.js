export default function WordSpan({ target, typed, state }) {
  if (state === "pending") {
    return (
      <span className="mr-2">
        {target.split("").map((ch, idx) => (
          <span key={idx} style={{ color: "var(--text-primary)" }}>
            {ch}
          </span>
        ))}
      </span>
    );
  }

  const maxLen = Math.max(target.length, typed.length);
  const spans = [];

  for (let idx = 0; idx < maxLen; idx++) {
    const inTarget = idx < target.length;
    const inTyped = idx < typed.length;
    const isCursor = state === "active" && idx === typed.length;
    let color = "var(--text-primary)";
    let background = "transparent";
    let underline = false;
    let ch = inTarget ? target[idx] : typed[idx];

    if (inTarget && inTyped) {
      const correct = target[idx] === typed[idx];
      color = correct ? "var(--success-dark)" : "var(--error-dark)";
      underline = !correct;
      if (state === "active") {
        background = correct ? "rgba(22,163,74,0.18)" : "rgba(220,38,38,0.2)";
      }
    } else if (inTyped && !inTarget) {
      color = "var(--error-dark)";
      underline = true;
      if (state === "active") background = "rgba(220,38,38,0.2)";
    } else if (!inTyped && inTarget && state === "done") {
      color = "var(--error-light)";
      underline = true;
    }

    if (isCursor) {
      background = "var(--accent)";
      color = "var(--text-primary)";
      underline = false;
    }

    spans.push(
      <span
        key={idx}
        style={{
          color,
          background,
          textDecoration: underline ? "underline" : "none",
        }}
      >
        {ch}
      </span>
    );
  }

  const showEndCursor = state === "active" && typed.length >= target.length;

  return (
    <span className="mr-2" style={{ position: "relative", display: "inline-block" }}>
      {spans}
      {showEndCursor && (
        <span
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: -5,
            width: 3,
            background: "var(--accent)",
            borderRadius: 1,
          }}
        />
      )}
    </span>
  );
}
