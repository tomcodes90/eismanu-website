import Link from 'next/link'
import type { SiteSettings } from '@/types'

interface FooterProps {
  settings: SiteSettings | null
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <p className="font-kaushan text-2xl text-brand-red mb-3">EisManuFaktur</p>
          <p className="font-kaushan text-brand-teal mb-1">Geratal</p>
          <p className="font-nunito text-sm text-gray-500 leading-relaxed">
            Hausgemachtes Eis & Eiscafé<br />in Gräfenroda, Thüringen
          </p>
        </div>

        {/* Navigation */}
        <nav aria-label="Footer Navigation">
          <p className="font-kaushan text-brand-teal text-lg mb-4">Navigation</p>
          <ul className="space-y-2 font-nunito text-sm text-gray-600">
            {[
              { href: '/eis',               label: 'Unsere Eissorten' },
              { href: '/speisen-getraenke', label: 'Speisen & Getränke' },
              { href: '/ueber-uns',         label: 'Über uns' },
              { href: '/news',              label: 'News & Events' },
              { href: '/kontakt',           label: 'Kontakt' },
              { href: '/impressum',         label: 'Impressum' },
              { href: '/datenschutz',       label: 'Datenschutz' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-brand-red transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Opening hours */}
        <div>
          <p className="font-kaushan text-brand-teal text-lg mb-4">Öffnungszeiten</p>
          {settings?.openingHours ? (
            <ul className="space-y-1 font-nunito text-sm text-gray-600">
              {settings.openingHours.map((row) => (
                <li key={row.days} className="flex justify-between gap-4">
                  <span>{row.days}</span>
                  <span className="font-medium text-brand-dark">{row.hours}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-nunito text-sm text-gray-500">Mi – So geöffnet</p>
          )}
        </div>

        {/* Contact */}
        <div>
          <p className="font-kaushan text-brand-teal text-lg mb-4">Kontakt</p>
          <address className="not-italic">
            <ul className="space-y-2 font-nunito text-sm text-gray-600">
              {settings?.address && (
                <li className="whitespace-pre-line">{settings.address}</li>
              )}
              {settings?.phone && (
                <li>
                  <a
                    href={`tel:${settings.phone}`}
                    aria-label={`Anrufen: ${settings.phone}`}
                    className="hover:text-brand-red transition-colors"
                  >
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    aria-label={`E-Mail an: ${settings.email}`}
                    className="hover:text-brand-red transition-colors"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </address>
        </div>

      </div>

      <div className="border-t border-gray-100 px-6 py-4 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 font-nunito text-xs text-gray-600">
        <p>© {new Date().getFullYear()} EisManuFaktur Geratal</p>
        <p>Handgemacht mit Liebe in Thüringen</p>
      </div>
    </footer>
  )
}
