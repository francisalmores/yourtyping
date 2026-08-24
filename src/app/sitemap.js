export const revalidate = 3600; // refresh hourly so new posts appear without a redeploy

export default function sitemap() {
  const baseUrl = 'https://yourtyping.com'
  const now = new Date()

  const blogPosts = [
    { path: '/blog/average-typing-speed', date: '2026-08-24' },
    { path: '/blog/how-to-improve-typing-speed', date: '2026-08-31' },
    { path: '/blog/touch-typing-for-programmers', date: '2026-09-07' },
    { path: '/blog/typing-games-vs-typing-tests', date: '2026-09-14' },
  ].filter((post) => new Date(post.date + 'T00:00:00Z') <= now)

  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/1-minute-typing-test', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/code-typing-test', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/blog', priority: 0.6, changeFrequency: 'weekly' },
    ...blogPosts.map((post) => ({ path: post.path, priority: 0.7, changeFrequency: 'monthly' })),
    { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' },
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
