"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw, Check, Volume2, VolumeX, Share2, Keyboard as KeyboardIcon, Upload, X, SlidersHorizontal } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { EASY_WORDS, MEDIUM_WORDS, HARD_WORDS, LANGUAGE_WORDS, generateFromList, generateSentenceTokens } from "@/lib/words";
import { computeStats } from "@/lib/typingEngine";
import { playType, playError } from "@/lib/sounds";
import Gauge from "@/components/Gauge";
import WordSpan from "@/components/WordSpan";
import Keyboard from "@/components/Keyboard";
import AdSlot from "@/components/AdSlot";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabaseClient";

const DURATIONS = [15, 30, 60, 120];
const DIFFICULTIES = ["easy", "medium", "hard"];
const LANGUAGES = [
  { id: "english", label: "English" },
  { id: "spanish", label: "Español" },
  { id: "filipino", label: "Filipino" },
  { id: "french", label: "Français" },
  { id: "german", label: "Deutsch" },
];
const WORDS_PER_BATCH = 22;
const SOUND_KEY = "yourtyping-sound";
const KEYBOARD_KEY = "yourtyping-keyboard";
const DEFAULT_DURATION_KEY = "yourtyping-default-duration";
const DEFAULT_DIFFICULTY_KEY = "yourtyping-default-difficulty";
const DEFAULT_LANGUAGE_KEY = "yourtyping-default-language";
const QUOTES = [
  { text: "Diligence over haste.", sub: "Proverbs 21:5" },
  { text: "Accuracy is speed, eventually.", sub: "" },
  { text: "Smooth is fast.", sub: "" },
  { text: "Every correct key is a rep.", sub: "" },
  { text: "Slow down to speed up.", sub: "" },
];

function difficultyPool(level) {
  return level === "hard" ? HARD_WORDS : level === "medium" ? MEDIUM_WORDS : EASY_WORDS;
}

export default function TestPage() {
  const { user } = useAuth();
  const [duration, setDuration] = useState(30);
  const [difficulty, setDifficulty] = useState("easy");
  const [language, setLanguage] = useState("english");
  const [customWords, setCustomWords] = useState(null);
  const [customFileName, setCustomFileName] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const [words, setWords] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [lineStart, setLineStart] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [completed, setCompleted] = useState([]);
  const [status, setStatus] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(30);
  const [result, setResult] = useState(null);
  const [resultQuote, setResultQuote] = useState(QUOTES[0]);
  const [saved, setSaved] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [keyboardOn, setKeyboardOn] = useState(true);
  const [wpmHistory, setWpmHistory] = useState([]);
  const [keyStats, setKeyStats] = useState({});
  const [shareCopied, setShareCopied] = useState(false);
  const [fileError, setFileError] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let initDuration = 30;
    let initDifficulty = "easy";
    let initLanguage = "english";
    if (typeof window !== "undefined") {
      const savedDuration = localStorage.getItem(DEFAULT_DURATION_KEY);
      const savedDifficulty = localStorage.getItem(DEFAULT_DIFFICULTY_KEY);
      const savedLanguage = localStorage.getItem(DEFAULT_LANGUAGE_KEY);
      if (savedDuration) initDuration = parseInt(savedDuration, 10) || 30;
      if (savedDifficulty) initDifficulty = savedDifficulty;
      if (savedLanguage) initLanguage = savedLanguage;
    }
    setDuration(initDuration);
    setTimeLeft(initDuration);
    setDifficulty(initDifficulty);
    setLanguage(initLanguage);
    setWords(buildWords(300, { customWords: null, language: initLanguage, difficulty: initDifficulty }));

    const savedSound = typeof window !== "undefined" ? localStorage.getItem(SOUND_KEY) : null;
    if (savedSound !== null) setSoundOn(savedSound === "true");
    const savedKb = typeof window !== "undefined" ? localStorage.getItem(KEYBOARD_KEY) : null;
    if (savedKb !== null) setKeyboardOn(savedKb === "true");
  }, []);

  useEffect(() => {
    if (status !== "running") return;
    timerRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [status]);

  useEffect(() => {
    if (status === "running" && timeLeft <= 0) finalizeTest();
    // eslint-disable-next-line
  }, [timeLeft, status]);

  useEffect(() => {
    if (status !== "running") return;
    const elapsedSec = duration - timeLeft;
    if (elapsedSec <= 0) return;
    const mins = elapsedSec / 60;
    const correctWords = completed.filter((c) => c.typed === c.target).length;
    const wpmNow = Math.round(correctWords / mins) || 0;
    setWpmHistory((prev) => [...prev, { t: elapsedSec, wpm: wpmNow }]);
    // eslint-disable-next-line
  }, [timeLeft]);

  function buildWords(count, cfg) {
    if (cfg.customWords && cfg.customWords.length > 0) return generateFromList(count, cfg.customWords);
    if (cfg.language !== "english") return generateFromList(count, LANGUAGE_WORDS[cfg.language] || EASY_WORDS);
    return generateFromList(count, difficultyPool(cfg.difficulty));
  }

  function toggleSound() {
    setSoundOn((s) => {
      const next = !s;
      if (typeof window !== "undefined") localStorage.setItem(SOUND_KEY, String(next));
      return next;
    });
  }

  function toggleKeyboard() {
    setKeyboardOn((s) => {
      const next = !s;
      if (typeof window !== "undefined") localStorage.setItem(KEYBOARD_KEY, String(next));
      return next;
    });
  }

  function resetWith(d, wordsOverride) {
    const initialWords = wordsOverride || buildWords(300, { customWords, language, difficulty });
    setWords(initialWords);
    setWordIndex(0);
    setLineStart(0);
    setCurrentInput("");
    setCompleted([]);
    setStatus("idle");
    setTimeLeft(d);
    setResult(null);
    setSaved(false);
    setWpmHistory([]);
    setKeyStats({});
    setShareCopied(false);
  }

  function handleDurationChange(d) {
    if (status === "running") return;
    setDuration(d);
    resetWith(d);
  }

  function handleDifficultyChange(level) {
    if (status === "running") return;
    setDifficulty(level);
    setLanguage("english");
    setCustomWords(null);
    setCustomFileName("");
    resetWith(duration, buildWords(300, { customWords: null, language: "english", difficulty: level }));
  }

  function handleLanguageChange(lang) {
    if (status === "running") return;
    setLanguage(lang);
    setCustomWords(null);
    setCustomFileName("");
    resetWith(duration, buildWords(300, { customWords: null, language: lang, difficulty }));
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setFileError("");
    if (file.size > 300000) {
      setFileError("File is too large (max 300KB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = String(evt.target.result || "");
      const rawWords = text
        .replace(/[\r\n\t]+/g, " ")
        .split(/\s+/)
        .map((w) => w.replace(/[^\p{L}'-]/gu, ""))
        .filter((w) => w.length > 0)
        .slice(0, 5000);
      if (rawWords.length === 0) {
        setFileError("Couldn't find readable words in that file.");
        return;
      }
      setCustomWords(rawWords);
      setCustomFileName(file.name);
      if (status !== "running") resetWith(duration, generateFromList(300, rawWords));
    };
    reader.readAsText(file);
  }

  function clearCustomWords() {
    if (status === "running") return;
    setCustomWords(null);
    setCustomFileName("");
    setFileError("");
    resetWith(duration, buildWords(300, { customWords: null, language, difficulty }));
  }

  function handleCustomSubmit(e) {
    e.preventDefault();
    const mins = parseFloat(customMinutes);
    if (!mins || mins <= 0) return;
    const seconds = Math.max(5, Math.min(1800, Math.round(mins * 60)));
    handleDurationChange(seconds);
    setCustomMinutes("");
  }

  function handleRestart() {
    clearInterval(timerRef.current);
    resetWith(duration);
    requestAnimationFrame(() => inputRef.current && inputRef.current.focus());
  }

  function normalizeKey(ch) {
    const SHIFT_MAP = {
      "!": "1", "@": "2", "#": "3", "$": "4", "%": "5", "^": "6", "&": "7", "*": "8", "(": "9", ")": "0",
      "_": "-", "+": "=", "{": "[", "}": "]", "|": "\\", ":": ";", '"': "'", "<": ",", ">": ".", "?": "/", "~": "`",
    };
    if (ch === " ") return " ";
    if (SHIFT_MAP[ch]) return SHIFT_MAP[ch];
    return ch.toLowerCase();
  }

  function trackKey(keyId, isError) {
    setKeyStats((prev) => {
      const cur = prev[keyId] || { presses: 0, errors: 0 };
      return { ...prev, [keyId]: { presses: cur.presses + 1, errors: cur.errors + (isError ? 1 : 0) } };
    });
  }

  function handleChange(e) {
    if (status === "finished") return;
    const val = e.target.value;
    if (status === "idle" && val.length > 0) setStatus("running");

    if (val.length > currentInput.length) {
      const targetWord = words[wordIndex] || "";
      const newChar = val[val.length - 1];
      const targetChar = targetWord[val.length - 1];
      const correct = newChar === targetChar;
      trackKey(normalizeKey(newChar), !correct);
      if (soundOn) {
        if (correct) playType();
        else playError();
      }
    } else if (val.length < currentInput.length) {
      trackKey("⌫", false);
    }

    setCurrentInput(val);
  }

  function handleKeyDown(e) {
    if (status === "finished") return;
    if (e.key === " ") {
      e.preventDefault();
      if (currentInput.length === 0) return;
      trackKey(" ", false);
      commitWord();
    }
  }

  function commitWord() {
    setCompleted((prev) => [...prev, { target: words[wordIndex], typed: currentInput }]);
    setWordIndex((prev) => {
      const next = prev + 1;
      if (next >= words.length - 20)
        setWords((w) => [...w, ...buildWords(200, { customWords, language, difficulty })]);
      if (next - lineStart >= WORDS_PER_BATCH) setLineStart(next);
      return next;
    });
    setCurrentInput("");
  }

  function computeConsistency(history) {
    if (history.length < 2) return 100;
    const values = history.map((h) => h.wpm);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    if (mean === 0) return 100;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / mean;
    return Math.max(0, Math.min(100, Math.round(100 - cv * 100)));
  }

  function speedRating(wpm) {
    if (wpm >= 65) return "Elite";
    if (wpm >= 45) return "Fast";
    if (wpm >= 30) return "Average";
    return "Building Speed";
  }

  async function finalizeTest() {
    clearInterval(timerRef.current);
    let partial = null;
    if (currentInput.length > 0) partial = { target: words[wordIndex] || "", typed: currentInput };
    const stats = computeStats(completed, partial, duration);
    const totalPresses = Object.values(keyStats).reduce((s, k) => s + k.presses, 0);
    const kps = Math.round((totalPresses / duration) * 10) / 10;
    const consistency = computeConsistency(wpmHistory);
    setResultQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    setResult({ ...stats, kps, consistency });
    setStatus("finished");
    setCurrentInput("");

    if (user) {
      try {
        await supabase.from("test_results").insert({
          user_id: user.id,
          wpm: stats.wpm,
          raw_wpm: stats.rawWpm,
          accuracy: stats.accuracy,
          duration: stats.duration,
          correct_chars: stats.correctChars,
          incorrect_chars: stats.incorrectChars,
          correct_words: stats.correctWords,
          total_words: stats.totalWords,
        });
        setSaved(true);
      } catch (e) {
        console.error(e);
      }
    }
  }

  async function handleShare() {
    if (!result) return;
    const text = `I just typed ${result.wpm} WPM with ${result.accuracy}% accuracy on YourTyping!`;
    const url = typeof window !== "undefined" ? window.location.origin : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "My YourTyping result", text, url });
      } catch (e) {}
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      } catch (e) {}
    }
  }

  const elapsedMin = Math.max(duration - timeLeft, 1) / 60;
  const activeWordText = words[wordIndex] || "";
  const nextChar =
    status === "finished" ? "" : currentInput.length < activeWordText.length ? activeWordText[currentInput.length] : " ";
  const liveWpm =
    status === "running"
      ? Math.round(completed.filter((c) => c.typed === c.target).length / elapsedMin) || 0
      : 0;
  const visible = words.slice(lineStart, lineStart + WORDS_PER_BATCH + 15);
  const isCustomActive = !DURATIONS.includes(duration);

  function displayTime(t) {
    if (t < 60) return `${t}s`;
    const m = t / 60;
    return `${Number.isInteger(m) ? m : m.toFixed(1)}m`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-1.5 items-center flex-wrap">
          {DURATIONS.map((d) => (
            <button
              key={d}
              disabled={status === "running"}
              onClick={() => handleDurationChange(d)}
              className="px-3 py-1.5 rounded-md text-xs font-bold border"
              style={{
                background: duration === d ? "var(--accent)" : "var(--bg-card)",
                color: duration === d ? "var(--on-accent)" : "var(--text-muted)",
                borderColor: duration === d ? "var(--accent)" : "var(--border)",
                opacity: status === "running" && duration !== d ? 0.4 : 1,
              }}
            >
              {d}s
            </button>
          ))}
          {!showCustomInput ? (
            <button
              disabled={status === "running"}
              onClick={() => setShowCustomInput(true)}
              className="px-3 py-1.5 rounded-md text-xs font-bold border"
              style={{
                background: isCustomActive ? "var(--accent)" : "var(--bg-card)",
                color: isCustomActive ? "var(--on-accent)" : "var(--text-muted)",
                borderColor: isCustomActive ? "var(--accent)" : "var(--border)",
                opacity: status === "running" && !isCustomActive ? 0.4 : 1,
              }}
            >
              {isCustomActive ? displayTime(duration) : "Custom"}
            </button>
          ) : (
            <form onSubmit={handleCustomSubmit} className="flex items-center gap-1">
              <input
                type="number"
                min="0.1"
                max="30"
                step="0.5"
                autoFocus
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                placeholder="min"
                className="w-16 px-2 py-1.5 rounded-md text-xs border"
                style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
              />
              <button
                type="submit"
                className="text-xs font-bold px-2.5 py-1.5 rounded-md"
                style={{ background: "var(--accent)", color: "var(--on-accent)" }}
              >
                Set
              </button>
            </form>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm font-bold">
          <span style={{ color: "var(--accent)" }}>{status === "finished" ? 0 : timeLeft}s</span>
          <span style={{ color: "var(--text-muted)" }}>{liveWpm} wpm</span>
          <button
            onClick={() => setShowOptions((s) => !s)}
            title="More options"
            className="opacity-70 hover:opacity-100"
            style={{ color: showOptions ? "var(--accent-dark)" : "var(--text-primary)" }}
          >
            <SlidersHorizontal size={16} />
          </button>
          <button
            onClick={toggleKeyboard}
            title={keyboardOn ? "Hide on-screen keyboard" : "Show on-screen keyboard"}
            className="opacity-70 hover:opacity-100"
            style={{ color: keyboardOn ? "var(--text-primary)" : "var(--border-light)" }}
          >
            <KeyboardIcon size={16} />
          </button>
          <button
            onClick={toggleSound}
            title={soundOn ? "Sound on" : "Sound off"}
            className="opacity-70 hover:opacity-100"
            style={{ color: "var(--text-primary)" }}
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button
            onClick={handleRestart}
            title="Restart"
            className="opacity-70 hover:opacity-100"
            style={{ color: "var(--text-primary)" }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {showOptions && (
        <div
          className="border rounded-lg p-4 mb-4 flex flex-col gap-4"
          style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold w-20 flex-shrink-0" style={{ color: "var(--text-faint)" }}>
              Language
            </span>
            <select
              disabled={status === "running"}
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="text-xs font-bold px-2 py-1.5 rounded-md border"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)", background: "var(--bg-card)" }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {language === "english" && !customFileName && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold w-20 flex-shrink-0" style={{ color: "var(--text-faint)" }}>
                Difficulty
              </span>
              {DIFFICULTIES.map((level) => (
                <button
                  key={level}
                  disabled={status === "running"}
                  onClick={() => handleDifficultyChange(level)}
                  className="px-3 py-1 rounded-md text-xs font-bold border capitalize"
                  style={{
                    background: difficulty === level ? "var(--accent)" : "var(--bg-card)",
                    color: difficulty === level ? "var(--on-accent)" : "var(--text-muted)",
                    borderColor: difficulty === level ? "var(--accent)" : "var(--border)",
                    opacity: status === "running" && difficulty !== level ? 0.4 : 1,
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold w-20 flex-shrink-0" style={{ color: "var(--text-faint)" }}>
              Practice text
            </span>
            <input ref={fileInputRef} type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
            <button
              disabled={status === "running"}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md border"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)", background: "var(--bg-card)" }}
            >
              <Upload size={12} /> Upload .txt file
            </button>
            {customFileName && (
              <span
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-md"
                style={{ color: "var(--text-secondary)", background: "var(--bg-subtle)" }}
              >
                {customFileName}
                <button onClick={clearCustomWords} style={{ color: "var(--text-faint)" }} title="Remove file">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
          {fileError && (
            <p className="text-xs" style={{ color: "var(--error)" }}>
              {fileError}
            </p>
          )}
        </div>
      )}

      {status !== "finished" && (
        <div className="w-full rounded-full mb-3" style={{ height: 6, background: "var(--border)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${Math.min(100, ((duration - timeLeft) / duration) * 100)}%`,
              background: "linear-gradient(90deg, var(--accent), #F4C430)",
              transition: "width 1s linear",
            }}
          />
        </div>
      )}

      {status !== "finished" ? (
        <div
          className="cursor-text relative py-2"
          onClick={() => inputRef.current && inputRef.current.focus()}
        >
          <div
            className="overflow-hidden"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignContent: "flex-start",
              lineHeight: "48px",
              maxHeight: "144px",
              fontSize: "34px",
              fontWeight: 300,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              filter: !isFocused ? "blur(5px)" : "none",
              transition: "filter 0.15s ease",
              userSelect: "none",
            }}
          >
            {visible.map((w, relIdx) => {
              const i = lineStart + relIdx;
              if (i < wordIndex) {
                const c = completed[i];
                if (!c) return null;
                return <WordSpan key={i} target={c.target} typed={c.typed} state="done" />;
              } else if (i === wordIndex) {
                return <WordSpan key={i} target={w} typed={currentInput} state="active" />;
              }
              return <WordSpan key={i} target={w} typed="" state="pending" />;
            })}
          </div>
          {!isFocused && (
            <div
              className="absolute inset-0 flex items-center justify-center text-sm font-bold pointer-events-none"
              style={{ color: "var(--text-primary)" }}
            >
              {status === "running" ? "Click here to continue" : "Click here to start typing"}
            </div>
          )}
          <input
            ref={inputRef}
            value={currentInput}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="absolute opacity-0"
            style={{ left: -9999, top: 0 }}
            autoFocus
          />
        </div>
      ) : (
        <div className="border p-6 rounded-lg" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Gauge value={result.wpm} max={150} />
            <div className="flex-1 w-full">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-3 flex-wrap">
                <span className="text-5xl font-extrabold" style={{ color: "var(--accent)" }}>
                  {result.wpm}
                </span>
                <span className="text-lg" style={{ color: "var(--text-muted)" }}>
                  wpm
                </span>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "var(--badge-bg)", color: "var(--badge-text)" }}
                >
                  {speedRating(result.wpm)}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center">
                <Stat label="Accuracy" value={`${result.accuracy}%`} />
                <Stat label="Raw WPM" value={result.rawWpm} />
                <Stat label="Words" value={`${result.correctWords}/${result.totalWords}`} />
                <Stat label="Chars" value={`${result.correctChars}/${result.incorrectChars}`} />
                <Stat label="KPS" value={result.kps} />
                <Stat label="Consistency" value={`${result.consistency}%`} />
              </div>
            </div>
          </div>

          {wpmHistory.length > 1 && (
            <div className="mt-6">
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-faint)" }}>
                Words per minute over time
              </div>
              <div style={{ width: "100%", height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={wpmHistory}>
                    <defs>
                      <linearGradient id="wpmFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="t" stroke="var(--text-faint)" fontSize={10} tickFormatter={(v) => `${v}s`} />
                    <YAxis stroke="var(--text-faint)" fontSize={10} />
                    <Tooltip
                      contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", fontSize: 12 }}
                      labelFormatter={(v) => `${v}s`}
                    />
                    <Area type="monotone" dataKey="wpm" stroke="var(--accent)" strokeWidth={2} fill="url(#wpmFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {(() => {
            const entries = Object.entries(keyStats);
            const errorRanking = entries
              .filter(([, v]) => v.errors > 0)
              .sort((a, b) => b[1].errors - a[1].errors)
              .slice(0, 6);
            const totalPresses = entries.reduce((s, [, v]) => s + v.presses, 0);
            const uniqueKeys = entries.length;
            const byPresses = [...entries].sort((a, b) => b[1].presses - a[1].presses);
            const mostUsed = byPresses[0];
            const leastUsed = byPresses[byPresses.length - 1];
            const label = (k) => (k === " " ? "Space" : k.toUpperCase());

            return (
              <>
                {errorRanking.length > 0 && (
                  <div className="mt-6">
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-faint)" }}>
                      Error Heat Map
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {errorRanking.map(([key, stat], idx) => (
                        <div
                          key={key}
                          className="rounded-md px-3 py-2 text-center"
                          style={{
                            background: idx === 0 ? "rgba(220,38,38,0.14)" : "rgba(220,38,38,0.07)",
                            minWidth: 56,
                          }}
                        >
                          <div className="text-[9px] font-bold" style={{ color: "var(--text-faint)" }}>
                            #{idx + 1}
                          </div>
                          <div className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>
                            {label(key)}
                          </div>
                          <div className="text-xs font-bold" style={{ color: "var(--error)" }}>
                            {stat.errors}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {totalPresses > 0 && (
                  <div className="mt-6">
                    <div
                      className="text-[10px] font-bold uppercase tracking-widest mb-3 text-center"
                      style={{ color: "var(--text-faint)" }}
                    >
                      Keyboard Activity
                    </div>
                    <Keyboard keyStats={keyStats} />
                    <div className="flex justify-center gap-6 mt-4 text-center flex-wrap">
                      <div>
                        <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                          {totalPresses}
                        </div>
                        <div className="text-[9px] uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
                          Total presses
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                          {uniqueKeys}
                        </div>
                        <div className="text-[9px] uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
                          Unique keys
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                          {mostUsed ? `${label(mostUsed[0])} (${mostUsed[1].presses})` : "-"}
                        </div>
                        <div className="text-[9px] uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
                          Most used
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                          {leastUsed ? `${label(leastUsed[0])} (${leastUsed[1].presses})` : "-"}
                        </div>
                        <div className="text-[9px] uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
                          Least used
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          <p className="text-center text-xs italic mt-6" style={{ color: "var(--text-faint)" }}>
            "{resultQuote.text}"{resultQuote.sub ? ` — ${resultQuote.sub}` : ""}
          </p>
          <div className="flex justify-center gap-3 mt-5 flex-wrap">
            <button
              onClick={handleRestart}
              className="font-bold px-5 py-2 rounded-md text-sm"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
              Try Again
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 font-bold px-5 py-2 rounded-md text-sm border"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              <Share2 size={14} /> {shareCopied ? "Copied!" : "Share"}
            </button>
            {!user ? (
              <a
                href="/signup"
                className="font-bold px-5 py-2 rounded-md text-sm border"
                style={{ borderColor: "var(--accent)", color: "var(--accent-dark)" }}
              >
                Sign up to save this score
              </a>
            ) : saved ? (
              <span className="flex items-center gap-1.5 text-sm px-3" style={{ color: "var(--success)" }}>
                <Check size={16} /> Saved to your stats
              </span>
            ) : null}
          </div>
        </div>
      )}

      {status !== "finished" && keyboardOn && (
        <div className="mt-10">
          <div
            className="text-[10px] font-bold uppercase tracking-widest mb-3 text-center"
            style={{ color: "var(--text-faint)" }}
          >
            Keyboard Activity
          </div>
          <Keyboard activeChar={nextChar} />
        </div>
      )}

      <AdSlot slot="1111111111" className="mt-6 h-24" />
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
