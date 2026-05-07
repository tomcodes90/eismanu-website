import Image from 'next/image'
import Link from 'next/link'

export function MenuSection() {
  return (
    <section
      aria-labelledby="menu-heading"
      className="py-20 px-6"
      style={{ backgroundImage: "url('/images/background_orange.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <Image
          src="/images/eiscafe-flammkuchen.jpg"
          alt="Frischer Flammkuchen — EisManuFaktur Geratal"
          width={1200}
          height={1200}
          className="w-full h-auto rounded-2xl shadow-lg"
        />

        <div>
          <p className="section-label text-brand-red">Mehr als nur Eis</p>
          <h2 id="menu-heading" className="section-title mb-6">Speisen & Getränke</h2>
          <p className="font-nunito text-base text-brand-mid leading-relaxed mb-4">
            Knuspriger Flammkuchen frisch aus dem Ofen, herzhafte Pizza und hausgemachte
            Spezialitäten — bei uns wird aus jedem Besuch ein Genusserlebnis.
          </p>
          <p className="font-nunito text-base text-brand-mid leading-relaxed mb-8">
            Dazu hausgerösteter Kaffee, heiße Waffeln und kühle Erfrischungen für
            die ganze Familie.
          </p>
          <Link href="/speisen-getraenke" className="btn-primary">
            Speisekarte entdecken
          </Link>
        </div>
      </div>
    </section>
  )
}
