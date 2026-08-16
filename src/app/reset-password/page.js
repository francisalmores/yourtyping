"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/"), 2000);
  }

  return (
    <div
      className="max-w-sm mx-auto rounded-lg overflow-hidden border mt-8"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      <div style={{ height: 4, background: "var(--accent)" }} />
      <div className="p-6">
        {done ? (
          <>
            <h1 className="text-xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>
              Password updated
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Taking you back to YourTyping...
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold mb-1" style={{ color: "var(--text-primary)" }}>
              Set a new password
            </h1>
            <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
              Choose a new password for your account.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-bold block mb-1.5" style={{ color: "var(--text-primary)" }}>
                  New password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 rounded-md text-sm"
                  style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label className="text-sm font-bold block mb-1.5" style={{ color: "var(--text-primary)" }}>
                  Confirm password
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-3 py-2 rounded-md text-sm"
                  style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                />
              </div>
              {error && (
                <p className="text-xs" style={{ color: "var(--error)" }}>
                  {error}
                </p>
              )}
              <button
                disabled={loading}
                type="submit"
                className="font-bold py-2.5 rounded-md text-sm mt-1"
                style={{ background: "var(--accent)", color: "var(--on-accent)" }}
              >
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
