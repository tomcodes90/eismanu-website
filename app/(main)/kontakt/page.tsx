import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { getSiteSettings } from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Kontakt & Anfahrt — EisManuFaktur Geratal',
  description: 'Adresse, Öffnungszeiten, Telefon und Anfahrt zum EisManuFaktur Geratal in Gräfenroda, Thüringen.',
  alternates: { canonical: '/kontakt' },
}

export default async function KontaktPage() {
  const settings = await getSiteSettings()

  const mapQuery = encodeURIComponent(
    settings?.address ? `EisManuFaktur Geratal, ${settings.address}` : 'Gräfenroda Thüringen'
  )

  return (
    <>
      {/* Page hero */}
      <section
        className="py-20 px-6"
        style={{ backgroundImage: "url('/images/background_blue.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="section-label text-brand-yellow">Wir sind für Sie da</p>
          <h1 className="font-kaushan text-5xl text-white leading-tight mb-4">Kontakt & Anfahrt</h1>
          <p className="font-nunito text-lg text-white/90 max-w-xl leading-relaxed">
            Besuchen Sie uns im Herzen des Geratal — wir freuen uns auf Sie.
          </p>
        </div>
      </section>

      {/* Contact + map */}
      <section
        className="py-16 px-6"
        aria-labelledby="contact-heading"
        style={{ backgroundImage: "url('/images/background_blue.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">

          {/* Info panel */}
          <div>
            <h2 id="contact-heading" className="font-kaushan text-3xl text-brand-dark mb-8">So erreichen Sie uns</h2>

            <div className="space-y-6">
              {settings?.address && (
                <div className="flex gap-4">
                  <span className="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <MapPin aria-hidden="true" size={18} />
                  </span>
                  <div>
                    <p className="font-kaushan text-lg text-brand-dark mb-1">Adresse</p>
                    <address className="not-italic font-nunito text-sm text-brand-mid whitespace-pre-line leading-relaxed">
                      {settings.address}
                    </address>
                  </div>
                </div>
              )}

              {settings?.phone && (
                <div className="flex gap-4">
                  <span className="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <Phone aria-hidden="true" size={18} />
                  </span>
                  <div>
                    <p className="font-kaushan text-lg text-brand-dark mb-1">Telefon</p>
                    <a
                      href={`tel:${settings.phone}`}
                      aria-label={`Anrufen: ${settings.phone}`}
                      className="font-nunito text-sm text-brand-teal hover:text-brand-red transition-colors"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>
              )}

              {settings?.email && (
                <div className="flex gap-4">
                  <span className="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <Mail aria-hidden="true" size={18} />
                  </span>
                  <div>
                    <p className="font-kaushan text-lg text-brand-dark mb-1">E-Mail</p>
                    <a
                      href={`mailto:${settings.email}`}
                      aria-label={`E-Mail an: ${settings.email}`}
                      className="font-nunito text-sm text-brand-teal hover:text-brand-red transition-colors"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <span className="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                  <Clock aria-hidden="true" size={18} />
                </span>
                <div>
                  <p className="font-kaushan text-lg text-brand-dark mb-2">Öffnungszeiten</p>
                  {settings?.openingHours ? (
                    <ul className="space-y-1 font-nunito text-sm text-brand-mid">
                      {settings.openingHours.map((row) => (
                        <li key={row.days} className="flex gap-4">
                          <span className="min-w-[120px]">{row.days}</span>
                          <span className="font-medium text-brand-dark">{row.hours}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-nunito text-sm text-brand-mid">Mittwoch – Sonntag, 13:00 – 19:00 Uhr</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Link href="/#reservierung" className="btn-teal">
                Tisch online reservieren
              </Link>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-lg aspect-square lg:aspect-auto lg:h-[480px]">
            <iframe
              title="EisManuFaktur Geratal auf Google Maps"
              src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </section>
    </>
  )
}
