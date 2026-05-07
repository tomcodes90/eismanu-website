import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum — EisManuFaktur Geratal',
  alternates: { canonical: '/impressum' },
}

export default function ImpressumPage() {
  return (
    <article
      className="py-16 px-6 min-h-[60vh]"
      style={{ backgroundImage: "url('/images/background_pink.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="font-kaushan text-4xl text-brand-dark mb-10">Impressum</h1>

        <section className="mb-8" aria-labelledby="angaben-heading">
          <h2 id="angaben-heading" className="font-kaushan text-2xl text-brand-teal mb-3">Angaben gemäß § 5 TMG</h2>
          <address className="not-italic font-nunito text-base text-brand-mid leading-relaxed">
            EisManuFaktur Geratal<br />
            {/* Bitte vollständige Adresse eintragen */}
            Musterstraße 1<br />
            99330 Gräfenroda<br />
            Deutschland
          </address>
        </section>

        <section className="mb-8" aria-labelledby="kontakt-heading">
          <h2 id="kontakt-heading" className="font-kaushan text-2xl text-brand-teal mb-3">Kontakt</h2>
          <dl className="font-nunito text-base text-brand-mid space-y-1">
            <div className="flex gap-3">
              <dt className="font-medium text-brand-dark min-w-[80px]">Telefon:</dt>
              <dd>{/* Telefonnummer eintragen */}—</dd>
            </div>
            <div className="flex gap-3">
              <dt className="font-medium text-brand-dark min-w-[80px]">E-Mail:</dt>
              <dd>{/* E-Mail-Adresse eintragen */}—</dd>
            </div>
          </dl>
        </section>

        <section className="mb-8" aria-labelledby="verantwortlich-heading">
          <h2 id="verantwortlich-heading" className="font-kaushan text-2xl text-brand-teal mb-3">Verantwortlich für den Inhalt</h2>
          <p className="font-nunito text-base text-brand-mid leading-relaxed">
            {/* Name des/der Verantwortlichen eintragen */}
            Inhaber/in EisManuFaktur Geratal<br />
            Musterstraße 1, 99330 Gräfenroda
          </p>
        </section>

        <section aria-labelledby="haftung-heading">
          <h2 id="haftung-heading" className="font-kaushan text-2xl text-brand-teal mb-3">Haftungsausschluss</h2>
          <p className="font-nunito text-base text-brand-mid leading-relaxed mb-4">
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit
            und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
          </p>
          <p className="font-nunito text-base text-brand-mid leading-relaxed">
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den
            allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.
          </p>
        </section>
      </div>
    </article>
  )
}
