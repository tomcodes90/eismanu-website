import { client } from './client'
import type { SiteSettings, IceFlavor, MenuItem, NewsPost } from '@/types'

// ─── Site settings ────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(
    `*[_type == "siteSettings"][0]{ _id, phone, email, address, openingHours }`,
    {},
    { next: { revalidate: 3600 } },
  )
}

// ─── Ice flavors ──────────────────────────────────────────────────────────────

export async function getIceFlavors(): Promise<IceFlavor[]> {
  return client.fetch(
    `*[_type == "iceFlavor"] | order(name asc){ _id, name, category, available, vegan, tags, image }`,
    {},
    { next: { revalidate: 3600 } },
  )
}

// ─── Menu items ───────────────────────────────────────────────────────────────

export async function getMenuItems(): Promise<MenuItem[]> {
  return client.fetch(
    `*[_type == "menuItem"] | order(category asc, name asc){ _id, name, description, price, category, vegetarian, vegan, tags }`,
    {},
    process.env.NODE_ENV === 'production'
      ? { next: { revalidate: 3600 } }
      : { cache: 'no-store' },
  )
}

// ─── News posts ───────────────────────────────────────────────────────────────

export async function getNewsPosts(): Promise<NewsPost[]> {
  return client.fetch(
    `*[_type == "newsPost"] | order(publishedAt desc)[0...20]{ _id, title, slug, publishedAt, excerpt, image }`,
    {},
    { next: { revalidate: 300 } },
  )
}

export async function getNewsPost(slug: string): Promise<NewsPost | null> {
  return client.fetch(
    `*[_type == "newsPost" && slug.current == $slug][0]{ _id, title, slug, publishedAt, excerpt, image, body }`,
    { slug },
    { next: { revalidate: 60 } },
  )
}
