import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutz — EisManuFaktur Geratal',
  alternates: { canonical: '/datenschutz' },
}

export default function DatenschutzPage() {
  return (
    <article
      className="py-16 px-6 min-h-[60vh]"
      style={{ backgroundImage: "url('/images/background_pink.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="max-w-2xl mx-auto space-y-10">
        <h1 className="font-kaushan text-4xl text-brand-dark">Datenschutzerklärung</h1>

        <section aria-labelledby="verantwortliche-heading">
          <h2 id="verantwortliche-heading" className="font-kaushan text-2xl text-brand-teal mb-3">1. Verantwortliche Stelle</h2>
          <p className="font-nunito text-base text-brand-mid leading-relaxed">
            Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br />
            EisManuFaktur Geratal, Musterstraße 1, 99330 Gräfenroda
            {/* Bitte vollständige Angaben ergänzen */}
          </p>
        </section>

        <section aria-labelledby="erhebung-heading">
          <h2 id="erhebung-heading" className="font-kaushan text-2xl text-brand-teal mb-3">2. Erhebung und Verarbeitung personenbezogener Daten</h2>
          <p className="font-nunito text-base text-brand-mid leading-relaxed mb-3">
            Wir erheben personenbezogene Daten, wenn Sie uns diese im Rahmen einer Tischreservierung freiwillig mitteilen.
            Dies umfasst: Vor- und Nachname, E-Mail-Adresse, Telefonnummer, gewünschtes Datum und Uhrzeit sowie
            optional Anmerkungen zu Ihrer Reservierung.
          </p>
          <p className="font-nunito text-base text-brand-mid leading-relaxed">
            Diese Daten werden ausschließlich zur Bearbeitung Ihrer Reservierungsanfrage verwendet und nach
            Abwicklung der Reservierung gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
          </p>
        </section>

        <section aria-labelledby="rechtsgrundlage-heading">
          <h2 id="rechtsgrundlage-heading" className="font-kaushan text-2xl text-brand-teal mb-3">3. Rechtsgrundlage</h2>
          <p className="font-nunito text-base text-brand-mid leading-relaxed">
            Die Verarbeitung Ihrer Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
            sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Verwaltung von Reservierungen).
          </p>
        </section>

        <section aria-labelledby="hosting-heading">
          <h2 id="hosting-heading" className="font-kaushan text-2xl text-brand-teal mb-3">4. Hosting</h2>
          <p className="font-nunito text-base text-brand-mid leading-relaxed">
            Diese Website wird bei Vercel Inc. gehostet. Beim Aufruf unserer Website werden automatisch
            Verbindungsdaten (z. B. IP-Adresse, Datum und Uhrzeit des Abrufs) in Server-Logs gespeichert.
            Diese Daten sind technisch notwendig für den Betrieb der Website und werden nach 30 Tagen automatisch gelöscht.
          </p>
        </section>

        <section aria-labelledby="cookies-heading">
          <h2 id="cookies-heading" className="font-kaushan text-2xl text-brand-teal mb-3">5. Cookies</h2>
          <p className="font-nunito text-base text-brand-mid leading-relaxed">
            Diese Website verwendet keine Tracking-Cookies oder Analyse-Tools von Drittanbietern.
            Technisch notwendige Cookies (z. B. für die Sitzungsverwaltung) können verwendet werden.
          </p>
        </section>

        <section aria-labelledby="google-maps-heading">
          <h2 id="google-maps-heading" className="font-kaushan text-2xl text-brand-teal mb-3">6. Google Maps</h2>
          <p className="font-nunito text-base text-brand-mid leading-relaxed">
            Auf unserer Kontaktseite binden wir Google Maps (Google LLC, 1600 Amphitheatre Parkway, Mountain View,
            CA 94043, USA) ein. Bei Nutzung dieser Karte kann Google Daten über Ihren Standort und Ihr Gerät verarbeiten.
            Weitere Informationen finden Sie in der{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-teal hover:text-brand-red transition-colors"
            >
              Datenschutzerklärung von Google (öffnet in neuem Fenster)
            </a>.
          </p>
        </section>

        <section aria-labelledby="rechte-heading">
          <h2 id="rechte-heading" className="font-kaushan text-2xl text-brand-teal mb-3">7. Ihre Rechte</h2>
          <p className="font-nunito text-base text-brand-mid leading-relaxed mb-3">
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
            Datenübertragbarkeit sowie das Widerspruchsrecht gemäß Art. 15–21 DSGVO.
          </p>
          <p className="font-nunito text-base text-brand-mid leading-relaxed">
            Für Anfragen wenden Sie sich bitte an: {/* E-Mail-Adresse eintragen */}
            <span className="text-brand-dark font-medium">info@eismanufaktur-geratal.de</span>
          </p>
          <p className="font-nunito text-base text-brand-mid leading-relaxed mt-3">
            Sie haben außerdem das Recht, sich bei der zuständigen Datenschutzbehörde zu beschweren.
          </p>
        </section>
      </div>
    </article>
  )
}
