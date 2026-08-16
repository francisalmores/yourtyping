export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>
        Terms of Service
      </h1>
      <p className="text-xs mb-8" style={{ color: "var(--text-faint)" }}>
        Last updated: August 2026
      </p>

      <div className="flex flex-col gap-6 text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
        <Section title="Using YourTyping">
          YourTyping is a free typing speed test, practice tool, and leaderboard. By using this
          site, you agree to these terms. If you don't agree, please don't use the site.
        </Section>
        <Section title="Accounts">
          You're responsible for keeping your account credentials secure and for anything that
          happens under your account. Provide accurate information when you sign up, and let us
          know if you believe your account has been compromised.
        </Section>
        <Section title="Acceptable use">
          Please don't use the site to submit offensive, misleading, or abusive usernames or
          content, attempt to manipulate the leaderboard through automated tools or scripts, or
          interfere with the normal operation of the site for other users.
        </Section>
        <Section title="Your content">
          Any text you upload for practice (in the "Upload text to practice" feature) is
          processed only in your browser to generate your typing exercise and is not stored on
          our servers.
        </Section>
        <Section title="No warranty">
          YourTyping is provided "as is," without warranties of any kind. We do our best to keep
          things running smoothly but can't guarantee the service will be uninterrupted or
          error-free.
        </Section>
        <Section title="Limitation of liability">
          To the fullest extent permitted by law, YourTyping and its creator are not liable for
          any indirect, incidental, or consequential damages arising from your use of the site.
        </Section>
        <Section title="Changes">
          We may update these terms from time to time. Continued use of the site after changes
          means you accept the updated terms.
        </Section>
        <Section title="Contact">
          Questions about these terms? Reach out at support@yourtyping.com.
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
