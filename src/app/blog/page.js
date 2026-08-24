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
];

export default function BlogIndexPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>
        Blog
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        Data, benchmarks, and guides on typing speed.
      </p>

      <div className="space-y-6">
        {POSTS.map((post) => (
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
