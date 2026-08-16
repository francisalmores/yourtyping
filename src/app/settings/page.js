"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabaseClient";

const DURATION_KEY = "yourtyping-default-duration";
const DIFFICULTY_KEY = "yourtyping-default-difficulty";
const LANGUAGE_KEY = "yourtyping-default-language";
const SOUND_KEY = "yourtyping-sound";
const KEYBOARD_KEY = "yourtyping-keyboard";

export default function SettingsPage() {
  const { user, profile, loading } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [defaultDuration, setDefaultDuration] = useState("30");
  const [defaultDifficulty, setDefaultDifficulty] = useState("easy");
  const [defaultLanguage, setDefaultLanguage] = useState("english");
  const [soundOn, setSoundOn] = useState(false);
  const [keyboardOn, setKeyboardOn] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    if (profile) setDisplayName(profile.username || "");
  }, [profile]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDefaultDuration(localStorage.getItem(DURATION_KEY) || "30");
    setDefaultDifficulty(localStorage.getItem(DIFFICULTY_KEY) || "easy");
    setDefaultLanguage(localStorage.getItem(LANGUAGE_KEY) || "english");
    setSoundOn(localStorage.getItem(SOUND_KEY) === "true");
    setKeyboardOn(localStorage.getItem(KEYBOARD_KEY) !== "false");
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      if (displayName && displayName !== profile?.username) {
        await supabase.from("profiles").update({ username: displayName }).eq("id", user.id);
      }
      localStorage.setItem(DURATION_KEY, defaultDuration);
      localStorage.setItem(DIFFICULTY_KEY, defaultDifficulty);
      localStorage.setItem(LANGUAGE_KEY, defaultLanguage);
      localStorage.setItem(SOUND_KEY, String(soundOn));
      localStorage.setItem(KEYBOARD_KEY, String(keyboardOn));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPasswordMsg("");
    if (newPassword.length < 6) {
      setPasswordMsg("Password must be at least 6 characters.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setPasswordMsg(error.message);
    else {
      setPasswordMsg("Password updated.");
      setNewPassword("");
    }
  }

  if (loading) return null;

  if (!user) {
    return (
      <div className="border p-8 rounded-lg text-center" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
          Sign in to manage your settings.
        </p>
        <a
          href="/login"
          className="font-bold px-5 py-2 rounded-md text-sm"
          style={{ background: "var(--accent)", color: "var(--on-accent)" }}
        >
          Sign in
        </a>
      </div>
    );
  }

  const initials = (profile?.username || user.email || "?").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>
          Settings
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Manage your account and typing preferences.
        </p>
      </div>

      <div className="border rounded-lg" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
            Account
          </span>
        </div>
        <div className="px-5 py-5 flex items-center gap-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-lg flex-shrink-0"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            {initials}
          </div>
          <div>
            <div className="font-bold" style={{ color: "var(--text-primary)" }}>
              {profile?.username || "Unnamed"}
            </div>
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
              {user.email}
            </div>
          </div>
        </div>
        <div className="px-5 py-5 border-b" style={{ borderColor: "var(--border)" }}>
          <label className="text-sm font-bold block mb-1" style={{ color: "var(--text-primary)" }}>
            Display name
          </label>
          <p className="text-xs mb-2" style={{ color: "var(--text-faint)" }}>
            Your name on the leaderboard.
          </p>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={24}
            className="w-full sm:w-80 px-3 py-2 rounded-md text-sm border"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>
        <div className="px-5 py-5">
          <label className="text-sm font-bold block mb-1" style={{ color: "var(--text-primary)" }}>
            Change password
          </label>
          <form onSubmit={handlePasswordChange} className="flex flex-wrap gap-2 items-center mt-2">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="px-3 py-2 rounded-md text-sm border w-full sm:w-64"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
            />
            <button
              type="submit"
              className="font-bold px-4 py-2 rounded-md text-sm border"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              Update
            </button>
          </form>
          {passwordMsg && (
            <p
              className="text-xs mt-2"
              style={{ color: passwordMsg.includes("updated") ? "var(--success)" : "var(--error)" }}
            >
              {passwordMsg}
            </p>
          )}
        </div>
      </div>

      <div className="border rounded-lg" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
            Typing
          </span>
        </div>

        <SettingRow label="Default time" desc="Starting timer for each practice session">
          <select
            value={defaultDuration}
            onChange={(e) => setDefaultDuration(e.target.value)}
            className="px-3 py-2 rounded-md text-sm border"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            {[15, 30, 60, 120].map((d) => (
              <option key={d} value={d}>
                {d}s
              </option>
            ))}
          </select>
        </SettingRow>

        <SettingRow label="Default difficulty" desc="Word difficulty when you start a new test">
          <select
            value={defaultDifficulty}
            onChange={(e) => setDefaultDifficulty(e.target.value)}
            className="px-3 py-2 rounded-md text-sm border capitalize"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            {["easy", "medium", "hard"].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </SettingRow>

        <SettingRow label="Default language" desc="Word list used when you start a new test">
          <select
            value={defaultLanguage}
            onChange={(e) => setDefaultLanguage(e.target.value)}
            className="px-3 py-2 rounded-md text-sm border"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            <option value="english">English</option>
            <option value="spanish">Español</option>
            <option value="filipino">Filipino</option>
            <option value="french">Français</option>
            <option value="german">Deutsch</option>
          </select>
        </SettingRow>

        <SettingRow label="Typing sounds" desc="Play a click or error tone as you type">
          <Toggle checked={soundOn} onChange={() => setSoundOn((s) => !s)} />
        </SettingRow>

        <SettingRow label="On-screen keyboard" desc="Show the visual keyboard below the test" last>
          <Toggle checked={keyboardOn} onChange={() => setKeyboardOn((s) => !s)} />
        </SettingRow>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="font-bold px-6 py-2.5 rounded-md text-sm"
          style={{ background: "var(--accent)", color: "var(--on-accent)" }}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--success)" }}>
            <Check size={16} /> Saved
          </span>
        )}
      </div>
    </div>
  );
}

function SettingRow({ label, desc, children, last }) {
  return (
    <div
      className={`px-5 py-4 flex items-center justify-between gap-4 flex-wrap ${last ? "" : "border-b"}`}
      style={{ borderColor: "var(--border)" }}
    >
      <div>
        <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
          {label}
        </div>
        <div className="text-xs" style={{ color: "var(--text-faint)" }}>
          {desc}
        </div>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className="rounded-full"
      style={{
        width: 44,
        height: 24,
        background: checked ? "var(--accent)" : "var(--border)",
        position: "relative",
        transition: "background 0.15s ease",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "var(--bg-card)",
          transition: "left 0.15s ease",
        }}
      />
    </button>
  );
}
