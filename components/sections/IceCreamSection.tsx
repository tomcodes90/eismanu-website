import Image from 'next/image'
import Link from 'next/link'

export function IceCreamSection() {
  return (
    <section
      aria-labelledby="ice-cream-heading"
      className="py-20 px-6"
      style={{ backgroundImage: "url('/images/background_orange.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="section-label text-brand-teal">Frisch & Hausgemacht</p>
          <h2 id="ice-cream-heading" className="section-title mb-6">Eis mit Herz und Seele</h2>
          <p className="font-nunito text-base text-brand-mid leading-relaxed mb-4">
            Jede Kugel erzählt eine Geschichte. Täglich von Hand zubereitet — mit frischen Zutaten
            aus der Region und Rezepten, die wir mit echter Leidenschaft weiterentwickeln.
          </p>
          <p className="font-nunito text-base text-brand-mid leading-relaxed mb-8">
            Von samtigem Milcheis über fruchtige Sorbets bis hin zu unseren hausgemachten
            Spezialitäten: Entdecken Sie Ihre neue Lieblingssorte.
          </p>
          <Link href="/eis" className="btn-teal">
            Alle Eissorten entdecken
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center lg:justify-end">
          <div className="rounded-2xl overflow-hidden shadow-lg bg-brand-yellow-light p-4">
            <Image
              src="/images/eis-granatapfel.png"
              alt="Granatapfel-Eis — EisManuFaktur Geratal"
              width={400}
              height={260}
              className="rounded-xl object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg bg-brand-teal-light p-4">
            <Image
              src="/images/eiskugel-lacht.jpg"
              alt="Hausgemachtes Eis — EisManuFaktur Geratal"
              width={400}
              height={260}
              className="rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
