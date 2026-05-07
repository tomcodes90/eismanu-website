'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import { cancelReservation } from '@/lib/reservation'

type Status = 'loading' | 'success' | 'error'

export default function StornierungsPage() {
  const params            = useParams()
  const token             = typeof params?.token === 'string' ? params.token : ''
  const [status, setStatus]   = useState<Status>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setMessage('Kein gültiger Stornierungstoken gefunden.')
      setStatus('error')
      return
    }

    cancelReservation(token)
      .then(() => setStatus('success'))
      .catch((err: unknown) => {
        setMessage(err instanceof Error ? err.message : 'Die Stornierung konnte nicht durchgeführt werden.')
        setStatus('error')
      })
  }, [token])

  return (
    <section
      className="min-h-[60vh] flex items-center justify-center px-6 py-20"
      style={{ backgroundImage: "url('/images/background_blue.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-10 text-center">

        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-6">
              <Loader aria-hidden="true" className="w-12 h-12 text-brand-teal animate-spin" />
            </div>
            <h1 className="font-kaushan text-2xl text-brand-dark mb-2">Stornierung wird verarbeitet…</h1>
            <p className="font-nunito text-sm text-brand-mid">Bitte warten Sie einen Moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-6">
              <CheckCircle aria-hidden="true" className="w-14 h-14 text-brand-green" />
            </div>
            <h1 className="font-kaushan text-3xl text-brand-dark mb-3">Reservierung storniert</h1>
            <p className="font-nunito text-sm text-brand-mid mb-8 leading-relaxed">
              Ihre Reservierung wurde erfolgreich storniert. Wir würden uns freuen, Sie zu einem anderen Zeitpunkt begrüßen zu dürfen.
            </p>
            <Link href="/#reservierung" className="btn-teal">
              Neu reservieren
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-6">
              <XCircle aria-hidden="true" className="w-14 h-14 text-brand-red" />
            </div>
            <h1 className="font-kaushan text-3xl text-brand-dark mb-3">Stornierung fehlgeschlagen</h1>
            <p className="font-nunito text-sm text-brand-mid mb-8 leading-relaxed">
              {message || 'Die Stornierung konnte nicht durchgeführt werden. Möglicherweise wurde die Reservierung bereits storniert oder der Link ist abgelaufen.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/kontakt" className="btn-outline bg-brand-dark text-white">
                Kontakt aufnehmen
              </Link>
              <Link href="/" className="btn-primary">
                Zur Startseite
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
