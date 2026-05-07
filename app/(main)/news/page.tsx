import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { IceCreamCone } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import { getNewsPosts } from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'News & Events — EisManuFaktur Geratal',
  description: 'Aktuelle Neuigkeiten, saisonale Angebote und Events aus dem EisManuFaktur Geratal in Gräfenroda.',
  alternates: { canonical: '/news' },
}

export default async function NewsPage() {
  const posts = await getNewsPosts()

  return (
    <>
      {/* Page hero */}
      <section
        className="py-20 px-6"
        style={{ backgroundImage: "url('/images/background_pink.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="section-label text-brand-pink">Aktuelles & Veranstaltungen</p>
          <h1 className="font-kaushan text-5xl text-brand-dark leading-tight mb-4">News & Events</h1>
          <p className="font-nunito text-lg text-brand-mid max-w-xl leading-relaxed">
            Saisonale Neuheiten, besondere Events und Geschichten aus unserem Eiscafé.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section
        className="py-16 px-6"
        aria-labelledby="news-list-heading"
        style={{ backgroundImage: "url('/images/background_pink.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 id="news-list-heading" className="sr-only">Alle Beiträge</h2>

          {posts.length === 0 ? (
            <p className="font-nunito text-brand-mid text-center py-20">
              Noch keine Beiträge vorhanden.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/news/${post.slug.current}`}
                  aria-labelledby={`post-title-${post._id}`}
                  className="card-brand group hover:shadow-md transition-shadow"
                >
                  {post.image ? (
                    <div className="w-full overflow-hidden">
                      <Image
                        src={urlFor(post.image).width(800).fit('max').url()}
                        alt=""
                        width={800}
                        height={533}
                        className="w-full h-auto block motion-safe:group-hover:scale-105 motion-safe:transition-transform motion-safe:duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] bg-brand-pink/20 flex items-center justify-center text-brand-pink">
                      <IceCreamCone aria-hidden="true" size={48} />
                    </div>
                  )}
                  <div className="p-5">
                    <time dateTime={post.publishedAt} className="block font-nunito text-xs text-brand-mid mb-2">
                      {format(parseISO(post.publishedAt), 'd. MMMM yyyy', { locale: de })}
                    </time>
                    <h2 id={`post-title-${post._id}`} className="font-kaushan text-xl text-brand-dark leading-snug mb-2 group-hover:text-brand-pink transition-colors">
                      {post.title}
                    </h2>
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
        </div>
      </section>
    </>
  )
}
