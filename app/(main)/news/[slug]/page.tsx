import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { ArrowLeft } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import { getNewsPost, getNewsPosts } from '@/sanity/lib/queries'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getNewsPosts()
  return posts.map((p) => ({ slug: p.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getNewsPost(slug)
  if (!post) return {}
  return {
    title: `${post.title} — EisManuFaktur Geratal`,
    description: post.excerpt ?? '',
    alternates: { canonical: `/news/${post.slug.current}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? '',
      images: post.image ? [urlFor(post.image).width(1200).height(630).url()] : [],
    },
  }
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getNewsPost(slug)
  if (!post) notFound()

  return (
    <>
      {/* Cover image */}
      {post.image && (
        <div className="w-full max-h-[480px] overflow-hidden">
          <Image
            src={urlFor(post.image).width(1200).height(480).url()}
            alt={post.image.alt ?? post.title}
            width={1200}
            height={480}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      )}

      <article
        className="py-16 px-6"
        style={{ backgroundImage: "url('/images/background_blue.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="max-w-2xl mx-auto">

          {/* Back link */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 font-nunito text-sm text-brand-teal hover:text-brand-red transition-colors mb-8"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Alle News
          </Link>

          {/* Meta */}
          <time dateTime={post.publishedAt} className="block font-nunito text-sm text-brand-mid mb-4">
            {format(parseISO(post.publishedAt), 'd. MMMM yyyy', { locale: de })}
          </time>

          <h1 className="font-kaushan text-4xl text-brand-dark leading-tight mb-8">
            {post.title}
          </h1>

          {/* Body */}
          {post.body && (
            <div className="prose prose-lg font-nunito text-brand-mid max-w-none
              prose-headings:font-kaushan prose-headings:text-brand-dark
              prose-a:text-brand-teal prose-a:no-underline hover:prose-a:text-brand-red
              prose-strong:text-brand-dark
              prose-img:rounded-2xl">
              <PortableText value={post.body} />
            </div>
          )}

          {/* Footer nav */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 font-nunito text-sm text-brand-teal hover:text-brand-red transition-colors"
            >
              <ArrowLeft aria-hidden="true" size={16} />
              Zurück zu News & Events
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
