"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Timer, Gamepad2, BarChart3, Trophy, Newspaper, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import ThemeToggle from "@/components/ThemeToggle";

const TABS = [
  { href: "/", label: "Typing Test", icon: Timer },
  { href: "/game", label: "Game", icon: Gamepad2 },
  { href: "/stats", label: "My Stats", icon: BarChart3 },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/blog", label: "Blog", icon: Newspaper },
];

export default function Nav() {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full mb-8"
      style={{
        background: "var(--nav-bg)",
        borderBottom: "1px solid var(--border)",
        boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.05)" : "none",
        transition: "box-shadow 0.2s ease",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8 flex-wrap">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <span
              style={{ width: 3, height: 24, background: "var(--accent)", display: "inline-block", borderRadius: 2 }}
            />
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 20,
                color: "var(--text-primary)",
              }}
            >
              yourtyping
            </span>
          </Link>
          <nav
            className="flex items-center gap-6 flex-wrap"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {TABS.map((t) => {
              const active = pathname === t.href || pathname.startsWith(t.href + "/");
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className="text-sm whitespace-nowrap"
                  style={{ color: active ? "var(--text-primary)" : "var(--text-muted)", fontWeight: active ? 700 : 500 }}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {user ? (
          <div
            className="flex items-center gap-3 flex-shrink-0"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <ThemeToggle />
            <Link
              href="/settings"
              title="Settings"
              className="flex-shrink-0"
              style={{ color: pathname === "/settings" ? "var(--text-primary)" : "var(--text-faint)" }}
            >
              <Settings size={18} />
            </Link>
            <span
              className="text-sm"
              style={{
                color: "var(--text-secondary)",
                fontWeight: 500,
                maxWidth: 140,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={profile?.username || user.email}
            >
              {profile?.username || user.email}
            </span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-md flex-shrink-0"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-shrink-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <ThemeToggle />
            <Link href="/login" className="text-sm whitespace-nowrap" style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-bold px-4 py-2 rounded-md whitespace-nowrap"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
