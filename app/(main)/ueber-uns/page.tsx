import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Leaf, Heart, IceCreamCone, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Über uns — EisManuFaktur Geratal',
  description: 'Lernen Sie das Team hinter dem EisManuFaktur Geratal kennen — handgemachtes Eis mit Leidenschaft, mitten in der Natur des Geratal.',
  alternates: { canonical: '/ueber-uns' },
}

const values = [
  {
    Icon: IceCreamCone,
    title: 'Handwerkliche Qualität',
    text: 'Jede Eissorte wird täglich frisch nach eigenen Rezepten zubereitet — ohne Fertigmischungen, ohne Kompromisse.',
    color: 'text-brand-teal',
    bg: 'bg-brand-teal-light',
  },
  {
    Icon: Leaf,
    title: 'Regionale Zutaten',
    text: 'Wir beziehen unsere Rohstoffe so lokal wie möglich — frische Früchte, hochwertige Milch und Sahne aus der Region.',
    color: 'text-brand-green',
    bg: 'bg-brand-green-light',
  },
  {
    Icon: Heart,
    title: 'Familiäre Atmosphäre',
    text: 'Unser Café ist ein Ort der Begegnung — für Familien, Wanderer und alle, die einen Moment innehalten möchten.',
    color: 'text-brand-pink',
    bg: 'bg-brand-pink-light',
  },
  {
    Icon: MapPin,
    title: 'Mitten im Geratal',
    text: 'Eingebettet in die grüne Natur Thüringens liegt unser Eiscafé direkt im Herzen von Gräfenroda.',
    color: 'text-brand-red',
    bg: 'bg-brand-red-light',
  },
]

export default function UeberUnsPage() {
  return (
    <>
      {/* Page hero with team photo */}
      <section
        className="py-24 px-6"
        style={{ backgroundImage: "url('/images/background_blue.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-label text-brand-teal">Unsere Geschichte</p>
            <h1 className="font-kaushan text-5xl text-brand-dark leading-tight mb-4">
              Mit Liebe gemacht —<br />seit dem ersten Löffel
            </h1>
            <p className="font-nunito text-lg text-brand-mid max-w-xl leading-relaxed">
              Ein kleines Café mit großem Herz, mitten in der Natur des Geratal.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/images/eiscafe-team.jpg"
              alt="Das Team des EisManuFaktur Geratal"
              width={560}
              height={420}
              className="rounded-2xl w-full max-w-lg object-contain"
            />
          </div>
        </div>
      </section>

      {/* Story */}
      <section
        className="py-20 px-6"
        aria-labelledby="story-heading"
        style={{ backgroundImage: "url('/images/background_orange.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 id="story-heading" className="font-kaushan text-3xl text-brand-dark mb-6">Wie alles begann</h2>
            <p className="font-nunito text-base text-brand-mid leading-relaxed mb-4">
              Mitten im Geratal, eingebettet in die grüne Natur Thüringens, entstand der Wunsch nach einem besonderen Ort —
              einem Ort, an dem man echtes, handwerklich gefertigtes Eis genießen kann, ohne auf Fertigprodukte zurückgreifen zu müssen.
            </p>
            <p className="font-nunito text-base text-brand-mid leading-relaxed mb-4">
              Was als Leidenschaft für handwerkliches Eis begann, ist heute eine gelebte Familientradition.
              Jeden Tag bereiten wir unsere Eissorten frisch zu — von klassischem Milcheis über fruchtige Sorbets
              bis zu unseren hausgemachten Spezialitäten.
            </p>
            <p className="font-nunito text-base text-brand-mid leading-relaxed">
              Dazu bieten wir knusprigen Flammkuchen, Pizza und heiße Getränke —
              alles mit der gleichen Sorgfalt und Liebe zum Detail.
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden aspect-square">
            <Image
              src="/images/eiscafe-uberuns-opening.jpg"
              alt="Eröffnung des EisManuFaktur Geratal"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        className="py-20 px-6"
        aria-labelledby="values-heading"
        style={{ backgroundImage: "url('/images/background_pink.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="section-label text-brand-teal">Was uns antreibt</p>
          <h2 id="values-heading" className="section-title mb-12">Unsere Werte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ Icon, title, text, color, bg }) => (
              <div key={title} className={`${bg} rounded-2xl p-6`}>
                <div className={`${color} mb-4`}>
                  <Icon aria-hidden="true" size={32} />
                </div>
                <h3 className="font-kaushan text-lg text-brand-dark mb-2">{title}</h3>
                <p className="font-nunito text-sm text-brand-mid leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section
        className="py-16 px-6 text-center"
        style={{ backgroundImage: "url('/images/background_blue.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <p className="section-label text-brand-teal mx-auto">Besuchen Sie uns</p>
        <h2 className="section-title mb-4">Wir freuen uns auf Sie</h2>
        <p className="section-sub mb-8 mx-auto">
          Mittwoch bis Sonntag von 13:00 bis 19:00 Uhr in Gräfenroda, Thüringen.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/#reservierung" className="btn-teal">Tisch reservieren</Link>
          <Link href="/kontakt" className="btn-primary">Anfahrt & Kontakt</Link>
        </div>
      </section>
    </>
  )
}
