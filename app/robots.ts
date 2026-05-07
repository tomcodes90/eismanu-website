import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/reservierung/stornieren/'],
      },
    ],
    sitemap: 'https://eismanufaktur-geratal.de/sitemap.xml',
  }
}
