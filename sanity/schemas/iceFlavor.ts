import { defineField, defineType } from 'sanity'

export const iceFlavor = defineType({
  name: 'iceFlavor',
  title: 'Eissorten',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategorie',
      type: 'string',
      options: {
        list: [
          { title: 'Milcheis', value: 'milk' },
          { title: 'Sorbet', value: 'sorbet' },
          { title: 'Spezialität', value: 'special' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'available',
      title: 'Verfügbar',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'vegan',
      title: 'Vegan',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alternativtext', type: 'string' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category', media: 'image' },
  },
})
