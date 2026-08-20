import TypingTest from "@/components/TypingTest";

export const metadata = {
  title: "1 Minute Typing Test — Free WPM Test in 60 Seconds",
  description:
    "Take a free 1-minute typing test and get your WPM and accuracy instantly. No sign-up required — click and start typing right away.",
  alternates: {
    canonical: "https://yourtyping.com/1-minute-typing-test",
  },
};

export default function OneMinuteTypingTestPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>
        1 Minute Typing Test
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        The 1-minute typing test is the standard length used by most typing
        certifications and speed benchmarks — long enough to settle into a
        real rhythm, short enough to take on a coffee break. Your test below
        starts at 60 seconds by default. Type naturally, and you&apos;ll get
        your WPM, accuracy, and a full breakdown the moment the timer hits
        zero.
      </p>

      <TypingTest forceDuration={60} />

      <section className="mt-10 text-sm" style={{ color: "var(--text-secondary)" }}>
        <h2 className="text-base font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          What&apos;s a good WPM for a 1-minute test?
        </h2>
        <p className="mb-4">
          Most everyday typists land between 35–45 WPM. Anything above 60 WPM
          is considered fast, and professional typists — transcriptionists,
          data entry specialists, competitive typists — often reach 80+ WPM.
          A 1-minute test tends to run a little faster than longer tests
          since fatigue hasn&apos;t set in yet, so don&apos;t be surprised if
          your 1-minute score is a few WPM higher than a 5-minute one.
        </p>
        <h2 className="text-base font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Why 60 seconds specifically?
        </h2>
        <p>
          One minute is long enough to smooth out the noise from a slow
          start, but short enough that most people can hold focus the entire
          time without their accuracy falling apart toward the end — which
          is exactly why it&apos;s the go-to length for typing certifications
          and job-application typing tests.
        </p>
      </section>
    </div>
  );
}
