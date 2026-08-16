export default function sitemap() {
  const baseUrl = 'https://yourtyping.com'
  const now = new Date()

  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
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
