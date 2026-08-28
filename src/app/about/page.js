export const metadata = {
  title: "About YourTyping",
  description:
    "YourTyping is a free typing speed test built to actually show you why you're slow, not just how slow — with a code typing mode, a typing game, and typing speed data most sites skip.",
};

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

        <h2 className="text-base font-bold mt-2" style={{ color: "var(--text-primary)" }}>
          Why this exists
        </h2>
        <p>
          Most typing tests give you a single number and nothing else. YourTyping was built to
          actually show you why — the per-key error heatmap exists because &quot;your WPM is
          62&quot; isn&apos;t nearly as useful as knowing your right pinky is the actual
          bottleneck. It&apos;s built and maintained independently, in spare time, not by a
          company — which is also why there&apos;s no clutter, no paywalls, and no dark patterns
          pushing you toward a subscription.
        </p>

        <h2 className="text-base font-bold mt-2" style={{ color: "var(--text-primary)" }}>
          What makes it different
        </h2>
        <p>
          Beyond the standard test, YourTyping includes a dedicated code typing test built around
          real programming syntax and symbols — something most typing sites skip entirely — along
          with a typing game for lower-pressure practice, and a blog covering typing speed data
          and technique guides.
        </p>

        <h2 className="text-base font-bold mt-2" style={{ color: "var(--text-primary)" }}>
          Still growing
        </h2>
        <p>
          This is an active project, with new features and content added regularly. No clutter,
          no paywalls — just a clean space to get better, one keystroke at a time.
        </p>
      </div>
    </div>
  );
}
