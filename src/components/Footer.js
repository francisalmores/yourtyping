"use client";

import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  return (
    <footer className="w-full mt-16" style={{ background: "var(--nav-bg)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span
                style={{ width: 3, height: 20, background: "var(--accent)", display: "inline-block", borderRadius: 2 }}
              />
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "var(--text-primary)",
                }}
              >
                yourtyping
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>
              A calm, honest typing speed test.
            </p>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            {FOOTER_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div
          className="text-center mt-8 pt-6 text-xs"
          style={{ borderTop: "1px solid var(--border)", color: "var(--text-faint)" }}
        >
          © {new Date().getFullYear()} YourTyping. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
