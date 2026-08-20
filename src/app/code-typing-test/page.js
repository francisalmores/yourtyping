import TypingTest from "@/components/TypingTest";

export const metadata = {
  title: "Code Typing Test — Practice Typing Programming Syntax",
  description:
    "Test your typing speed with real programming keywords, symbols, and operators from JavaScript, Python, SQL, and the command line. Free, no sign-up.",
  alternates: {
    canonical: "https://yourtyping.com/code-typing-test",
  },
};

// Single-token entries only (no internal spaces) — the test engine commits
// a word on every spacebar press, so multi-word entries like "git commit"
// would break mid-token.
const CODE_WORDS = [
  "function", "const", "let", "var", "return", "if", "else", "for", "while",
  "class", "import", "export", "default", "async", "await", "try", "catch",
  "finally", "throw", "new", "this", "super", "extends", "implements",
  "interface", "type", "enum", "public", "private", "static", "void",
  "null", "undefined", "true", "false", "typeof", "instanceof", "break",
  "continue", "switch", "case", "do", "delete", "yield", "console.log",
  "require", "useState", "useEffect", "props", "state", "render",
  "array.map", "array.filter", "array.reduce", "Promise", "=>", "===",
  "!==", "&&", "||", "??", "...", "{}", "[]", "()", "=", "+=", "-=", "++",
  "--", "def", "self", "print", "SELECT", "FROM", "WHERE", "JOIN", "INSERT",
  "UPDATE", "DELETE", "git", "npm", "docker", "kubectl", "curl", "grep",
  "sudo", "cd", "ls",
];

export default function CodeTypingTestPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>
        Code Typing Test
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        Regular typing tests use plain English words, but real coding speed
        depends on hitting symbols and operators cleanly —{" "}
        <code>{"=>"}</code>, <code>{"==="}</code>, <code>{"{}"}</code>, and
        the rest of the punctuation that makes up half of what you actually
        type in an editor. This test pulls from real keywords, symbols, and
        syntax across JavaScript, Python, SQL, and the command line.
      </p>

      <TypingTest forcePreset={{ words: CODE_WORDS, label: "Code Snippets" }} />

      <section className="mt-10 text-sm" style={{ color: "var(--text-secondary)" }}>
        <h2 className="text-base font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Why symbols matter as much as letters
        </h2>
        <p className="mb-4">
          Most typing tests measure how fast you type words. But when
          you&apos;re coding, a huge share of your keystrokes are
          punctuation — brackets, arrows, comparison operators, semicolons.
          Building speed and accuracy on those specifically is a different
          skill than typing plain sentences, and it&apos;s the part most
          typing tests skip entirely.
        </p>
        <h2 className="text-base font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Switch back any time
        </h2>
        <p>
          Want to go back to plain-word practice? Click the × next to
          &quot;Code Snippets&quot; above the test to clear the preset, or
          just head back to the{" "}
          <a href="/" className="underline" style={{ color: "var(--accent-dark)" }}>
            main typing test
          </a>
          .
        </p>
      </section>
    </div>
  );
}
