import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getSiteSettings } from '@/sanity/lib/queries'

const BASE_URL = 'https://eismanufaktur-geratal.de'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'IceCreamShop',
    name: 'EisManuFaktur Geratal',
    url: BASE_URL,
    telephone: settings?.phone,
    email: settings?.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.address,
      addressLocality: 'Gräfenroda',
      addressRegion: 'Thüringen',
      addressCountry: 'DE',
    },
    openingHoursSpecification: settings?.openingHours?.map((row) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: row.days,
      opens: row.hours.split('–')[0]?.trim(),
      closes: row.hours.split('–')[1]?.trim(),
    })),
    servesCuisine: ['Eis', 'Flammkuchen', 'Kaffee'],
    priceRange: '€',
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:btn-primary"
      >
        Zum Inhalt springen
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">{children}</main>
      {/* Mobile: fixed height, cropped */}
      <div className="relative w-full h-48 overflow-hidden sm:hidden">
        <Image src="/images/eiscafe-footer.jpg" alt="" fill className="object-cover object-center" />
      </div>
      {/* Desktop: natural proportions */}
      <Image
        src="/images/eiscafe-footer.jpg"
        alt=""
        width={1800}
        height={265}
        className="hidden sm:block w-full h-auto"
      />
      <Footer settings={settings} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
