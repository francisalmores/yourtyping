"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import GoogleAuthButton from "@/components/GoogleAuthButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResetSent(false);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else router.push("/");
  }

  async function handleForgotPassword() {
    setError("");
    setResetSent(false);
    if (!email) {
      setError("Enter your email above first, then click Forgot password.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined,
    });
    if (error) setError(error.message);
    else setResetSent(true);
  }

  return (
    <div
      className="max-w-sm mx-auto rounded-lg overflow-hidden border mt-8"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      <div style={{ height: 4, background: "var(--accent)" }} />
      <div className="p-6">
        <h1 className="text-2xl font-extrabold mb-1" style={{ color: "var(--text-primary)" }}>
          Welcome back
        </h1>
        <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
          Sign in to continue your progress.
        </p>

        <GoogleAuthButton onError={setError} />

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          <span className="text-xs font-bold" style={{ color: "var(--text-faint)" }}>
            OR
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-bold block mb-1.5" style={{ color: "var(--text-primary)" }}>
              Email
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm"
              style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
            />
          </div>
          <div>
            <label className="text-sm font-bold block mb-1.5" style={{ color: "var(--text-primary)" }}>
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm"
              style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
            />
            <div className="text-right mt-1.5">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-medium"
                style={{ color: "var(--accent-dark)" }}
              >
                Forgot password?
              </button>
            </div>
          </div>

          {error && <p className="text-xs" style={{ color: "var(--error)" }}>{error}</p>}
          {resetSent && (
            <p className="text-xs" style={{ color: "var(--success)" }}>
              Password reset email sent — check your inbox.
            </p>
          )}

          <button
            disabled={loading}
            type="submit"
            className="font-bold py-2.5 rounded-md text-sm mt-1"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="text-sm text-center mt-4" style={{ color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <a href="/signup" className="font-bold" style={{ color: "var(--accent-dark)" }}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
