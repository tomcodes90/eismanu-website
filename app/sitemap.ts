import type { MetadataRoute } from 'next'
import { getNewsPosts } from '@/sanity/lib/queries'

const BASE = 'https://eismanufaktur-geratal.de'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getNewsPosts()

  const newsUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/news/${p.slug.current}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    { url: BASE,                               priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE}/eis`,                      priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE}/speisen-getraenke`,        priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE}/ueber-uns`,                priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE}/news`,                     priority: 0.7, changeFrequency: 'weekly' },
    { url: `${BASE}/kontakt`,                  priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE}/impressum`,                priority: 0.3, changeFrequency: 'yearly' },
    { url: `${BASE}/datenschutz`,              priority: 0.3, changeFrequency: 'yearly' },
    ...newsUrls,
  ]
}
