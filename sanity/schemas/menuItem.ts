import { defineField, defineType } from 'sanity'

export const menuItem = defineType({
  name: 'menuItem',
  title: 'Speisekarte',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Beschreibung',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'price',
      title: 'Preis (€)',
      type: 'number',
    }),
    defineField({
      name: 'category',
      title: 'Kategorie',
      type: 'string',
      options: {
        list: [
          { title: 'Flammkuchen', value: 'flammkuchen' },
          { title: 'Pizza',       value: 'pizza' },
          { title: 'Besonderes',  value: 'besonderes' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'vegetarian',
      title: 'Vegetarisch',
      type: 'boolean',
      initialValue: false,
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
  ],
  preview: {
    select: { title: 'name', subtitle: 'category' },
  },
})
