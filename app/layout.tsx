import type { Metadata } from 'next'
import { Lobster, Nunito } from 'next/font/google'
import './globals.css'

const kaushan = Lobster({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-kaushan',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
})

const BASE_URL = 'https://eismanufaktur-geratal.de'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'EisManuFaktur Geratal — Hausgemachtes Eis in Gräfenroda',
  description: 'Genießen Sie unser selbstgemachtes Eis, Flammkuchen und Kaffee mitten in der Natur des Geratal in Gräfenroda, Thüringen.',
  alternates: {
    canonical: '/',
    languages: { 'de-DE': BASE_URL },
  },
  openGraph: {
    title: 'EisManuFaktur Geratal — Hausgemachtes Eis in Gräfenroda',
    description: 'Selbstgemachtes Eis, Flammkuchen & Kaffee im Geratal, Gräfenroda.',
    url: BASE_URL,
    siteName: 'EisManuFaktur Geratal',
    locale: 'de_DE',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={`${kaushan.variable} ${nunito.variable}`}>
      <body className="min-h-screen flex flex-col font-nunito">
        {children}
      </body>
    </html>
  )
}
