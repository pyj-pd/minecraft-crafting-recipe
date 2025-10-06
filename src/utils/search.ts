import Fuse from 'fuse.js'
import { getTranslationsForSearching } from './language'

/** @todo support multiple languages */
const translations = getTranslationsForSearching()

export const fuse = new Fuse(translations, {
  isCaseSensitive: false,
  keys: ['itemId', 'translations'],
})
