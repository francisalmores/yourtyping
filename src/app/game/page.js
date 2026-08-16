"use client";

import { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import { WORD_BANK } from "@/lib/words";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import AdSlot from "@/components/AdSlot";

const GAME_HEIGHT = 320;

export default function GamePage() {
  const { user } = useAuth();
  const [gameStatus, setGameStatus] = useState("idle");
  const [fallingWords, setFallingWords] = useState([]);
  const [gameScore, setGameScore] = useState(0);
  const [gameLives, setGameLives] = useState(3);
  const [gameInput, setGameInput] = useState("");
  const gameElapsedRef = useRef(0);
  const savedRef = useRef(false);

  useEffect(() => {
    if (gameStatus !== "running") return;
    const startElapsed = gameElapsedRef.current;
    const tick = setInterval(() => {
      gameElapsedRef.current += 50;
      setFallingWords((prev) => {
        const speed = 1.1 + Math.min(gameElapsedRef.current / 20000, 2.5);
        const next = [];
        let livesLost = 0;
        prev.forEach((w) => {
          const ny = w.y + speed * 2;
          if (ny > GAME_HEIGHT) livesLost++;
          else next.push({ ...w, y: ny });
        });
        if (livesLost > 0) {
          setGameLives((l) => {
            const nl = l - livesLost;
            if (nl <= 0) setGameStatus("over");
            return Math.max(nl, 0);
          });
        }
        return next;
      });
    }, 50);
    const spawn = setInterval(() => {
      setFallingWords((prev) => {
        if (prev.length >= 8) return prev;
        const text = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
        return [...prev, { id: Date.now() + Math.random(), text, x: 8 + Math.random() * 78, y: 0 }];
      });
    }, Math.max(700, 1500 - startElapsed / 40));
    return () => {
      clearInterval(tick);
      clearInterval(spawn);
    };
  }, [gameStatus]);

  useEffect(() => {
    if (gameStatus === "over" && user && !savedRef.current) {
      savedRef.current = true;
      supabase.from("game_scores").insert({ user_id: user.id, score: gameScore }).then(() => {});
    }
    if (gameStatus === "running") savedRef.current = false;
  }, [gameStatus, user, gameScore]);

  function startGame() {
    setFallingWords([]);
    setGameScore(0);
    setGameLives(3);
    setGameInput("");
    gameElapsedRef.current = 0;
    setGameStatus("running");
  }

  function handleGameInputChange(e) {
    const val = e.target.value;
    setGameInput(val);
    const trimmed = val.trim();
    if (trimmed.length === 0) return;
    setFallingWords((prev) => {
      const idx = prev.findIndex((w) => w.text === trimmed);
      if (idx === -1) return prev;
      setGameScore((s) => s + trimmed.length);
      setGameInput("");
      const copy = prev.slice();
      copy.splice(idx, 1);
      return copy;
    });
  }

  return (
    <div className="border p-4 rounded-lg" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
          Score <span className="text-base font-bold ml-1" style={{ color: "var(--accent)" }}>{gameScore}</span>
        </span>
        <span className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart key={i} size={14} fill={i < gameLives ? "var(--error)" : "none"} stroke="var(--error)" />
          ))}
        </span>
      </div>
      <div
        className="relative rounded-md overflow-hidden"
        style={{ height: GAME_HEIGHT, background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
      >
        {gameStatus === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Type each word before it lands. Three misses and it's over.
            </p>
            <button
              onClick={startGame}
              className="font-bold px-4 py-2 rounded-md text-sm"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
              Start Game
            </button>
          </div>
        )}
        {gameStatus === "over" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
              Game Over
            </p>
            <p className="text-3xl font-extrabold" style={{ color: "var(--accent)" }}>
              {gameScore} pts
            </p>
            {!user && <p className="text-xs" style={{ color: "var(--text-faint)" }}>Sign in to save your score</p>}
            <button
              onClick={startGame}
              className="font-bold px-4 py-2 rounded-md text-sm mt-2"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
              Play Again
            </button>
          </div>
        )}
        {gameStatus === "running" &&
          fallingWords.map((w) => (
            <div
              key={w.id}
              className="absolute text-sm font-bold px-2 py-0.5 rounded font-mono"
              style={{
                left: `${w.x}%`,
                top: w.y,
                color: "var(--text-primary)",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              {w.text}
            </div>
          ))}
      </div>
      {gameStatus === "running" && (
        <input
          autoFocus
          value={gameInput}
          onChange={handleGameInputChange}
          className="w-full mt-3 px-3 py-2 rounded-md text-sm font-mono border"
          style={{ background: "var(--bg-card)", color: "var(--text-primary)", borderColor: "var(--border)" }}
          placeholder="type the falling word..."
        />
      )}
      <AdSlot slot="3333333333" className="mt-6 h-24" />
    </div>
  );
}
