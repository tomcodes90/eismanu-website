'use client'

import { useState } from 'react'
import Image from 'next/image'
import { IceCreamCone } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import type { IceFlavor } from '@/types'

const FILTERS = [
  { value: 'all',     label: 'Alle' },
  { value: 'milk',    label: 'Milcheis' },
  { value: 'sorbet',  label: 'Sorbet' },
  { value: 'special', label: 'Spezialitäten' },
] as const

type Filter = typeof FILTERS[number]['value']

const categoryLabel: Record<string, string> = {
  milk:    'Milcheis',
  sorbet:  'Sorbet',
  special: 'Spezialität',
}

interface IceCatalogProps {
  flavors: IceFlavor[]
}

export function IceCatalog({ flavors }: IceCatalogProps) {
  const [active, setActive] = useState<Filter>('all')

  const visible = active === 'all'
    ? flavors.filter((f) => f.available)
    : flavors.filter((f) => f.available && f.category === active)

  return (
    <>
      {/* Filter tabs */}
      <div role="group" aria-label="Eissorten filtern" className="flex flex-wrap gap-3 mb-10">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActive(value)}
            aria-pressed={active === value}
            className={`font-kaushan text-base px-5 py-2 rounded-full border-2 transition-colors ${
              active === value
                ? 'bg-brand-teal border-brand-teal text-white'
                : 'border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="font-nunito text-brand-mid text-center py-16">
          Keine Eissorten in dieser Kategorie verfügbar.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((flavor) => (
            <div key={flavor._id} className="card-brand p-5 flex gap-4 items-start">
              {flavor.image ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={urlFor(flavor.image).width(160).height(160).url()}
                    alt={flavor.image.alt ?? flavor.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-brand-yellow-light flex items-center justify-center flex-shrink-0 text-brand-teal">
                  <IceCreamCone aria-hidden="true" size={32} />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-kaushan text-xl text-brand-dark leading-snug">{flavor.name}</h3>
                <p className="font-nunito text-sm text-brand-mid mt-0.5">{categoryLabel[flavor.category] ?? flavor.category}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {flavor.vegan && (
                    <span className="flavor-tag bg-brand-green-light text-brand-green-dark">Vegan</span>
                  )}
                  {flavor.tags?.map((tag) => (
                    <span key={tag} className="flavor-tag bg-brand-red-light text-brand-red">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
