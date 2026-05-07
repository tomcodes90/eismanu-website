import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { IceCreamCone } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import type { NewsPost } from '@/types'

interface NewsSectionProps {
  posts: NewsPost[]
}

export function NewsSection({ posts }: NewsSectionProps) {
  const visible = posts.slice(0, 3)

  return (
    <section
      aria-labelledby="news-heading"
      className="py-20 px-6"
      style={{ backgroundImage: "url('/images/background_pink.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="max-w-6xl mx-auto">
        <p className="section-label text-brand-pink">Aktuelles & Veranstaltungen</p>
        <h2 id="news-heading" className="section-title mb-4">News & Events</h2>
        <p className="section-sub mb-12">
          Saisonale Neuheiten, Events und Geschichten aus unserem Eiscafé.
        </p>

        {visible.length === 0 ? (
          <p className="font-nunito text-brand-mid text-center py-12">
            Noch keine News vorhanden.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {visible.map((post) => (
              <Link
                key={post._id}
                href={`/news/${post.slug.current}`}
                aria-labelledby={`news-title-${post._id}`}
                className="card-brand group hover:shadow-md transition-shadow"
              >
                {post.image ? (
                  <div className="w-full overflow-hidden">
                    <Image
                      src={urlFor(post.image).width(800).fit('max').url()}
                      alt=""
                      width={800}
                      height={800}
                      className="w-full h-auto block motion-safe:group-hover:scale-105 motion-safe:transition-transform motion-safe:duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[4/3] bg-brand-pink/20 flex items-center justify-center text-brand-pink">
                    <IceCreamCone aria-hidden="true" size={48} />
                  </div>
                )}
                <div className="p-5">
                  <time
                    dateTime={post.publishedAt}
                    className="block font-nunito text-xs text-brand-mid mb-2"
                  >
                    {format(parseISO(post.publishedAt), 'd. MMMM yyyy', { locale: de })}
                  </time>
                  <h3 id={`news-title-${post._id}`} className="font-kaushan text-lg text-brand-dark leading-snug mb-2 group-hover:text-brand-pink transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="font-nunito text-sm text-brand-mid leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/news" className="btn-primary">
            Alle News ansehen
          </Link>
        </div>
      </div>
    </section>
  )
}
