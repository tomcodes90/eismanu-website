import Image from 'next/image'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden h-[calc(100vh-6rem)] flex items-center"
    >
      <Image
        src="/images/icecafe-vetrine.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-white/65" />

      <h1 id="hero-heading" className="sr-only">
        EisManuFaktur Geratal — Eiscafé in Gräfenroda
      </h1>

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: text + buttons */}
        <div>
          <p className="section-label text-brand-teal">Willkommen im Geratal</p>
          <h2 className="font-kaushan text-4xl md:text-5xl text-brand-dark leading-tight mb-6">
            Hausgemachtes Eis mit Herz und Seele
          </h2>
          <p className="font-nunito text-lg text-brand-dark mb-8 max-w-lg leading-relaxed">
            Hausgemachtes Eis, knuspriger Flammkuchen und herzliche Gastfreundschaft —
            mitten in der Natur des Geratal in Gräfenroda, Thüringen.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/eis" className="btn-primary">
              Unsere Eissorten
            </Link>
            <Link href="/#reservierung" className="btn-teal">
              Tisch reservieren
            </Link>
          </div>
        </div>

        {/* Right: logo */}
        <div className="hidden lg:flex items-center justify-center">
          <Image
            src="/images/eismanu-logo.png"
            alt="EisManuFaktur Geratal Logo"
            width={480}
            height={200}
            className="w-full max-w-sm object-contain"
            priority
          />
        </div>
      </div>
    </section>
  )
}
