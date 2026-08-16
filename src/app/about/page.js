export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold mb-4" style={{ color: "var(--text-primary)" }}>
        About YourTyping
      </h1>
      <div className="flex flex-col gap-4 text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
        <p>
          YourTyping is a free, no-nonsense typing speed test built for anyone who wants to type
          faster and more accurately — students, professionals, coders, and competitive typists
          alike.
        </p>
        <p>
          Pick your test length, choose a difficulty or language, or upload your own text to
          practice with. Track your progress over time, compete on the public leaderboard, and
          see exactly which keys are slowing you down with detailed post-test analytics.
        </p>
        <p>No clutter, no paywalls — just a clean space to get better, one keystroke at a time.</p>
      </div>
    </div>
  );
}
