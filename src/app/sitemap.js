export default function sitemap() {
  const baseUrl = 'https://yourtyping.com'
  const now = new Date()

  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/1-minute-typing-test', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/code-typing-test', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/blog', priority: 0.6, changeFrequency: 'weekly' },
    { path: '/blog/average-typing-speed', priority: 0.7, changeFrequency: 'monthly' },
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
