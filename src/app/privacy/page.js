export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>
        Privacy Policy
      </h1>
      <p className="text-xs mb-8" style={{ color: "var(--text-faint)" }}>
        Last updated: August 2026
      </p>

      <div className="flex flex-col gap-6 text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
        <Section title="What we collect">
          When you create an account, we collect your email address and a display username. If
          you sign in with Google, we receive your name and email from Google. When you take a
          typing test, we store your results (words per minute, accuracy, and related stats) if
          you're signed in, so we can show them back to you on your Stats page and, if you choose,
          on the public leaderboard.
        </Section>
        <Section title="Local storage">
          Some preferences — like sound settings, your default test duration, and whether the
          on-screen keyboard is shown — are stored directly in your browser using local storage.
          This data never leaves your device.
        </Section>
        <Section title="Third-party services">
          We use Supabase to handle accounts and store data securely. If you sign in with Google,
          that sign-in is handled directly by Google's own authentication system. If this site
          displays advertising, those ads may be served by Google AdSense, which can use cookies
          to show relevant ads; you can control ad personalization through your Google account
          settings.
        </Section>
        <Section title="Public leaderboard">
          If you submit a score to the leaderboard, your chosen username, WPM, and accuracy for
          that test become visible to anyone using the site. Don't use anything on the
          leaderboard you wouldn't want to be public.
        </Section>
        <Section title="Your choices">
          You can change your display name or password anytime from Settings. To request deletion
          of your account and associated data, contact us using the email below.
        </Section>
        <Section title="Children's privacy">
          This site is not directed at children under 13, and we don't knowingly collect personal
          information from them.
        </Section>
        <Section title="Contact">
          Questions about this policy? Reach out at support@yourtyping.com.
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-base font-bold mb-1.5" style={{ color: "var(--text-primary)" }}>
        {title}
      </h2>
      <p>{children}</p>
    </div>
  );
}
