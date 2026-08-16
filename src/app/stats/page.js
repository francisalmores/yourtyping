"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabaseClient";

export default function StatsPage() {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    supabase
      .from("test_results")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setHistory(data || []);
        setLoading(false);
      });
  }, [user]);

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="border p-8 rounded-lg text-center" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
          Sign in to see your typing history and progress.
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

  const bestWpm = history.length ? Math.max(...history.map((h) => h.wpm)) : 0;
  const avgAcc = history.length
    ? Math.round(history.reduce((s, h) => s + h.accuracy, 0) / history.length)
    : 0;
  const chartData = history
    .slice(0, 20)
    .slice()
    .reverse()
    .map((h, i) => ({ idx: i + 1, wpm: h.wpm }));

  return (
    <div className="border p-5 rounded-lg" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <div className="grid grid-cols-3 gap-3 text-center mb-6">
        <Stat label="Tests Taken" value={history.length} />
        <Stat label="Best WPM" value={bestWpm} />
        <Stat label="Avg Accuracy" value={`${avgAcc}%`} />
      </div>
      {loading ? (
        <p className="text-sm text-center py-8" style={{ color: "var(--text-faint)" }}>Loading...</p>
      ) : history.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: "var(--text-faint)" }}>
          No tests completed yet — take a test to see your stats here.
        </p>
      ) : (
        <>
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="idx" stroke="var(--text-faint)" fontSize={10} />
                <YAxis stroke="var(--text-faint)" fontSize={10} />
                <Tooltip
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", fontSize: 12 }}
                  labelStyle={{ color: "var(--text-primary)" }}
                />
                <Line type="monotone" dataKey="wpm" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3, fill: "var(--accent)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <table className="w-full text-xs mt-4">
            <thead>
              <tr style={{ color: "var(--text-faint)" }}>
                <th className="text-left font-normal pb-2">Date</th>
                <th className="text-left font-normal pb-2">Mode</th>
                <th className="text-right font-normal pb-2">WPM</th>
                <th className="text-right font-normal pb-2">Acc</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 10).map((h) => (
                <tr key={h.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td className="py-1.5" style={{ color: "var(--text-primary)" }}>{new Date(h.created_at).toLocaleDateString()}</td>
                  <td className="py-1.5" style={{ color: "var(--text-primary)" }}>{h.duration}s</td>
                  <td className="py-1.5 text-right" style={{ color: "var(--accent)" }}>{h.wpm}</td>
                  <td className="py-1.5 text-right" style={{ color: "var(--text-primary)" }}>{h.accuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: "var(--text-faint)" }}>
        {label}
      </div>
    </div>
  );
}
