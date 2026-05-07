import { defineField, defineType } from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero Bereich',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Überschrift',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subheadline',
      title: 'Unterüberschrift',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'image',
      title: 'Hintergrundbild',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alternativtext', type: 'string' }),
      ],
    }),
  ],
  preview: { select: { title: 'headline', media: 'image' } },
})
