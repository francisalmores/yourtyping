"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import GoogleAuthButton from "@/components/GoogleAuthButton";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      await supabase.from("profiles").insert({ id: data.user.id, username }).select().maybeSingle();
      router.push("/");
    } else {
      setNeedsConfirm(true);
    }
  }

  if (needsConfirm) {
    return (
      <div
        className="max-w-sm mx-auto rounded-lg overflow-hidden border mt-8"
        style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
      >
        <div style={{ height: 4, background: "var(--accent)" }} />
        <div className="p-6 text-center">
          <h1 className="text-xl font-extrabold mb-3" style={{ color: "var(--text-primary)" }}>
            Check your email
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            We sent a confirmation link to {email}. Click it, then come back and sign in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-sm mx-auto rounded-lg overflow-hidden border mt-8"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      <div style={{ height: 4, background: "var(--accent)" }} />
      <div className="p-6">
        <h1 className="text-2xl font-extrabold mb-1" style={{ color: "var(--text-primary)" }}>
          Get started
        </h1>
        <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
          Create your account to save scores and track your progress.
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
              Username
            </label>
            <input
              required
              placeholder="How you'll appear on the leaderboard"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={24}
              className="w-full px-3 py-2 rounded-md text-sm"
              style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
            />
          </div>
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
              minLength={6}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm"
              style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
            />
          </div>

          {error && <p className="text-xs" style={{ color: "var(--error)" }}>{error}</p>}

          <button
            disabled={loading}
            type="submit"
            className="font-bold py-2.5 rounded-md text-sm mt-1"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <p className="text-sm text-center mt-4" style={{ color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <a href="/login" className="font-bold" style={{ color: "var(--accent-dark)" }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
