import Image from 'next/image'
import Link from 'next/link'

export function AboutSection() {
  return (
    <section
      aria-labelledby="about-heading"
      className="py-20 px-6"
      style={{ backgroundImage: "url('/images/background_blue.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div>
          <p className="section-label text-brand-teal">Unsere Geschichte</p>
          <h2 id="about-heading" className="section-title mb-6">Mit Liebe gemacht — seit dem ersten Löffel</h2>
          <p className="font-nunito text-base text-brand-mid leading-relaxed mb-4">
            Mitten im Geratal, eingebettet in die grüne Natur Thüringens, haben wir unser kleines Eiscafé
            als Ort der Begegnung geschaffen. Was mit der Leidenschaft für handwerkliches Eis begann,
            ist heute eine Familientradition.
          </p>
          <p className="font-nunito text-base text-brand-mid leading-relaxed mb-8">
            Wir verarbeiten ausschließlich regionale Zutaten und bereiten jeden Tag frisch zu —
            von klassischem Milcheis bis zu fruchtigen Sorbets und unseren hausgemachten Flammkuchen.
          </p>
          <Link href="/ueber-uns" className="btn-teal">
            Mehr über uns
          </Link>
        </div>

        <Image
          src="/images/eismanu-giuly.jpg"
          alt="EisManuFaktur Geratal — Hausgemachtes Eis"
          width={1200}
          height={800}
          className="w-full h-auto rounded-2xl"
        />
      </div>
    </section>
  )
}
