import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Website Einstellungen',
  type: 'document',
  fields: [
    defineField({
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'email',
      title: 'E-Mail',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'openingHours',
      title: 'Öffnungszeiten',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'days', title: 'Tage', type: 'string' }),
            defineField({ name: 'hours', title: 'Uhrzeit', type: 'string' }),
          ],
          preview: { select: { title: 'days', subtitle: 'hours' } },
        },
      ],
    }),
  ],
  preview: { select: { title: 'phone' }, prepare: () => ({ title: 'Website Einstellungen' }) },
})
