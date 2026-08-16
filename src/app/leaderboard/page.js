"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthProvider";
import AdSlot from "@/components/AdSlot";

const DURATIONS = [15, 30, 60, 120];

export default function LeaderboardPage() {
  const { profile } = useAuth();
  const [duration, setDuration] = useState(60);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("leaderboard")
      .select("*")
      .eq("duration", duration)
      .order("wpm", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!error) setRows(data || []);
        setLoading(false);
      });
  }, [duration]);

  return (
    <div className="border p-5 rounded-lg" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex gap-1.5">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className="px-2.5 py-1 rounded text-xs font-bold border"
              style={{
                background: duration === d ? "var(--accent)" : "var(--bg-card)",
                color: duration === d ? "var(--on-accent)" : "var(--text-muted)",
                borderColor: duration === d ? "var(--accent)" : "var(--border)",
              }}
            >
              {d}s
            </button>
          ))}
        </div>
        <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
          Public leaderboard
        </span>
      </div>
      {loading ? (
        <p className="text-sm text-center py-8" style={{ color: "var(--text-faint)" }}>Loading...</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: "var(--text-faint)" }}>
          No scores yet for this mode. Be the first.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs" style={{ color: "var(--text-faint)" }}>
              <th className="text-left font-normal pb-2">#</th>
              <th className="text-left font-normal pb-2">Name</th>
              <th className="text-right font-normal pb-2">WPM</th>
              <th className="text-right font-normal pb-2">Acc</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const isMe = profile && r.username === profile.username;
              return (
                <tr
                  key={r.user_id}
                  style={{
                    borderTop: "1px solid var(--border)",
                    background: isMe ? "rgba(234,179,8,0.08)" : "transparent",
                  }}
                >
                  <td className="py-1.5" style={{ color: "var(--text-primary)" }}>{i + 1}</td>
                  <td className="py-1.5" style={{ color: "var(--text-primary)" }}>{r.username}</td>
                  <td className="py-1.5 text-right" style={{ color: "var(--accent)" }}>{r.wpm}</td>
                  <td className="py-1.5 text-right" style={{ color: "var(--text-primary)" }}>{r.accuracy}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <AdSlot slot="2222222222" className="mt-6 h-24" />
    </div>
  );
}
