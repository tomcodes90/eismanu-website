import Image from 'next/image'
import { Calendar, Clock, Users } from 'lucide-react'
import { ReservationForm } from '@/components/reservation/ReservationForm'

export function ReservationSection() {
  return (
    <section
      id="reservierung"
      aria-labelledby="reservation-heading"
      className="py-20 px-6"
      style={{ backgroundImage: "url('/images/background_blue.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-stretch">
        {/* Left: info */}
        <div className="flex flex-col h-full">
          {/* Image — top on mobile, hidden on desktop */}
          <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-8 lg:hidden">
            <Image
              src="/images/eismanu_innen.jpg"
              alt="EisManuFaktur von innen"
              fill
              className="object-cover"
            />
          </div>

          <p className="section-label text-brand-yellow">Einen Tisch sichern</p>
          <h2 id="reservation-heading" className="font-kaushan text-4xl text-brand-dark leading-tight mb-6">
            Tisch reservieren
          </h2>
          <p className="font-nunito text-base text-brand-dark leading-relaxed mb-8">
            Reservieren Sie bequem online — wir freuen uns auf Ihren Besuch.<br />
            Für Gruppen ab 7 Personen bitten wir um telefonische Anfrage.
          </p>

          <ul className="space-y-3 font-nunito text-sm text-gray-700 mb-8">
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-yellow/20 flex items-center justify-center text-brand-yellow">
                <Calendar aria-hidden="true" size={16} />
              </span>
              Mittwoch bis Sonntag geöffnet
            </li>
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-yellow/20 flex items-center justify-center text-brand-yellow">
                <Clock aria-hidden="true" size={16} />
              </span>
              13:00 – 19:00 Uhr
            </li>
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-yellow/20 flex items-center justify-center text-brand-yellow">
                <Users aria-hidden="true" size={16} />
              </span>
              Bis zu 6 Personen online buchbar
            </li>
          </ul>

          {/* Image — below info on desktop, hidden on mobile */}
          <div className="relative hidden lg:block grow rounded-2xl overflow-hidden">
            <Image
              src="/images/eismanu_innen.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Right: form */}
        <div className="bg-white rounded-2xl p-8">
          <h3 id="reservation-form-title" className="sr-only">Reservierungsformular</h3>
          <ReservationForm />
        </div>
      </div>
    </section>
  )
}
