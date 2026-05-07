import type { PortableTextBlock } from '@portabletext/types'

export interface ReservationFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  date: string
  timeSlot: string
  guests: number
  seatingPreference?: 'TERRACE' | 'INSIDE' | 'OTHER'
  notes?: string
}

export interface ReservationResponse {
  id: string
  confirmationCode: string
  name: string
  email: string
  date: string
  timeSlot: string
  guests: number
  status: string
}

export interface AvailabilityResponse {
  date: string
  availableSlots: string[]
}

export interface SanityImage {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  alt?: string
}

export interface SiteSettings {
  _id: string
  phone?: string
  email?: string
  address?: string
  openingHours?: Array<{ days: string; hours: string }>
}

export interface IceFlavor {
  _id: string
  name: string
  category: 'milk' | 'sorbet' | 'special'
  available: boolean
  vegan?: boolean
  tags?: string[]
  image?: SanityImage
}

export interface MenuItem {
  _id: string
  name: string
  description?: string
  price?: number
  category: 'flammkuchen' | 'pizza' | 'besonderes'
  vegetarian?: boolean
  vegan?: boolean
  tags?: string[]
}

export interface NewsPost {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  excerpt?: string
  image?: SanityImage
  body?: PortableTextBlock[]
}
