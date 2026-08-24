export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog — Typing Speed Tips, Data, and Guides",
  description:
    "Guides, benchmarks, and data on typing speed — average WPM by profession, programmer-specific typing tips, and more.",
  alternates: {
    canonical: "https://yourtyping.com/blog",
  },
};

const POSTS = [
  {
    slug: "average-typing-speed",
    title: "Average Typing Speed by Age and Profession (2026 Data)",
    excerpt:
      "What counts as a good WPM? Full benchmarks by age, profession, and skill tier — plus why programmers' typing speed doesn't follow the same rules as everyone else's.",
    date: "2026-08-24",
  },
  {
    slug: "how-to-improve-typing-speed",
    title: "How to Improve Your Typing Speed: 10 Techniques That Actually Work",
    excerpt:
      "Most people plateau not from lack of practice, but from practicing the wrong way. 10 concrete techniques to actually raise your WPM.",
    date: "2026-08-31",
  },
  {
    slug: "touch-typing-for-programmers",
    title: "Touch Typing for Programmers: Why Code Feels Harder to Type Than Prose",
    excerpt:
      "Why the same person who types 70 WPM on prose can feel clumsy typing code — the mechanics of symbol typing and how to practice them deliberately.",
    date: "2026-09-07",
  },
  {
    slug: "typing-games-vs-typing-tests",
    title: "Do Typing Games Actually Improve Your WPM? What We Know",
    excerpt:
      "Typing games are more fun than formal tests — but do they build speed the same way? What each is genuinely good for, and why the answer is to use both.",
    date: "2026-09-14",
  },
];

export default function BlogIndexPage() {
  const now = new Date();
  const visiblePosts = POSTS
    .filter((post) => new Date(post.date + "T00:00:00Z") <= now)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>
        Blog
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        Data, benchmarks, and guides on typing speed.
      </p>

      <div className="space-y-6">
        {visiblePosts.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-lg p-5"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <h2 className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>
              {post.title}
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {post.excerpt}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
