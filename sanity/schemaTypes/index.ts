import { type SchemaTypeDefinition } from 'sanity'
import { siteSettings } from '../schemas/siteSettings'
import { iceFlavor } from '../schemas/iceFlavor'
import { menuItem } from '../schemas/menuItem'
import { newsPost } from '../schemas/newsPost'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings, iceFlavor, menuItem, newsPost],
}
