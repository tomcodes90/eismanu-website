import type { ReservationFormData, ReservationResponse, AvailabilityResponse } from '@/types'

const API_BASE  = process.env.NEXT_PUBLIC_API_URL
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID

function headers(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-Tenant-Id': TENANT_ID ?? '',
  }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    return await fetch(url, { ...options, signal: AbortSignal.timeout(10000) })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      throw new Error('Zeitüberschreitung — bitte versuchen Sie es erneut')
    }
    throw err
  }
}

async function extractError(res: Response): Promise<string> {
  try {
    const body = await res.json() as { message?: string }
    if (body.message) return body.message
  } catch { /* ignore */ }
  return `Fehler ${res.status}`
}

export async function createReservation(data: ReservationFormData): Promise<ReservationResponse> {
  const { firstName, lastName, timeSlot, ...rest } = data
  const payload = {
    ...rest,
    name: `${firstName} ${lastName}`,
    timeSlot: timeSlot.length === 5 ? `${timeSlot}:00` : timeSlot,
  }

  const res = await fetchWithTimeout(`${API_BASE}/reservations`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(await extractError(res))
  }

  return res.json() as Promise<ReservationResponse>
}

export async function getAvailability(date: string, time: string, partySize: number): Promise<AvailabilityResponse> {
  const params = new URLSearchParams({ date, time, partySize: String(partySize) })
  const res = await fetchWithTimeout(`${API_BASE}/availability?${params}`, {
    headers: headers(),
  })

  if (!res.ok) {
    throw new Error(await extractError(res))
  }

  return res.json() as Promise<AvailabilityResponse>
}

export async function cancelReservation(token: string): Promise<void> {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(token)) {
    throw new Error('Ungültiger Stornierungstoken')
  }

  const res = await fetchWithTimeout(`${API_BASE}/reservations/${token}/cancel`, {
    method: 'DELETE',
    headers: headers(),
  })

  if (!res.ok) {
    throw new Error(await extractError(res))
  }
}
