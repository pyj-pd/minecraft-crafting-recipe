/** @todo support multiple languages */
import type { LanguageData, SearchLanguageData } from '@/types/language'
import type { ItemId } from '@/types/minecraft'
import defaultLanguageFile from '@public/data/translations/en_us.json'

/**
 * Gets array of items' translations that can be used for fuzzy searching.
 * @param languageData Optional. Array of language data that will be merged together. Default language data will be always included and be prioritized over other language data.
 * @returns Array of translations.
 */
export function getTranslationsForSearching(languageData?: LanguageData[]) {
  const data: SearchLanguageData = []

  const allLanguageData: LanguageData[] = [
    defaultLanguageFile,
    ...(languageData ?? []),
  ]

  for (const itemId of Object.keys(defaultLanguageFile.translations)) {
    const itemData: SearchLanguageData[number] = {
      itemId: itemId as ItemId,
      translations: [],
    }

    /** @todo optimize? */
    for (const translation of allLanguageData) {
      const translationString = translation.translations[itemId as ItemId]
      if (translationString) itemData.translations.push(translationString)
    }

    if (itemData.translations.length > 0) data.push(itemData)
  }

  return data
}
