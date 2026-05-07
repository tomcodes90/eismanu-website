import type { Metadata } from 'next'
import Link from 'next/link'
import { getIceFlavors } from '@/sanity/lib/queries'
import { IceCatalog } from '@/components/eis/IceCatalog'

export const metadata: Metadata = {
  title: 'Unsere Eissorten — EisManuFaktur Geratal',
  description: 'Entdecken Sie unsere hausgemachten Eissorten: Milcheis, Sorbets und Spezialitäten — täglich frisch zubereitet in Gräfenroda.',
  alternates: { canonical: '/eis' },
}

export default async function EisPage() {
  const flavors = await getIceFlavors()

  return (
    <>
      {/* Page hero */}
      <section
        className="py-20 px-6"
        style={{ backgroundImage: "url('/images/background_blue.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="section-label text-brand-yellow">Frisch & Hausgemacht</p>
          <h1 className="font-kaushan text-5xl text-white leading-tight mb-4">Unsere Eissorten</h1>
          <p className="font-nunito text-lg text-white/90 max-w-xl leading-relaxed">
            Jeden Tag frisch zubereitet aus besten Zutaten der Region — von klassischem Milcheis bis zu fruchtigen Sorbets und unseren Spezialitäten.
          </p>
        </div>
      </section>

      {/* Catalog */}
      <section
        className="py-16 px-6"
        aria-labelledby="catalog-heading"
        style={{ backgroundImage: "url('/images/background_orange.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 id="catalog-heading" className="sr-only">Eissorten Katalog</h2>
          <IceCatalog flavors={flavors} />
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 px-6 text-center"
        style={{ backgroundImage: "url('/images/background_blue.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <p className="section-label text-brand-teal mx-auto">Lust auf mehr?</p>
        <h2 className="section-title mb-4">Besuchen Sie uns</h2>
        <p className="section-sub mb-8 mx-auto">
          Reservieren Sie Ihren Tisch und genießen Sie unsere Eissorten vor Ort.
        </p>
        <Link href="/#reservierung" className="btn-teal">
          Tisch reservieren
        </Link>
      </section>
    </>
  )
}
