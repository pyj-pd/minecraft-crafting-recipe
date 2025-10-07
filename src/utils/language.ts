/** @todo support multiple languages */
import { DEFAULT_LANGUAGE_ID } from '@/constants/default'
import { DATA_FILE_EXTENSION } from '@/constants/files'
import { LanguageData, SearchLanguageData } from '@/types/language'
import type { ItemId } from '@/types/minecraft'

const TRANSLATION_DATA_URL = '/data/translations/'

export async function getTranslationData(
  languageId: string
): Promise<LanguageData> {
  const response = await fetch(
    `${TRANSLATION_DATA_URL}${languageId}${DATA_FILE_EXTENSION}`
  )
  const data = LanguageData.parse(await response.json())

  return data
}

export const defaultLanguageData = await getTranslationData(DEFAULT_LANGUAGE_ID)

/**
 * Gets array of items' translations that can be used for fuzzy searching.
 * @param languageData Optional. Array of language data that will be merged together. Default language data will be always included and be prioritized over other language data.
 * @returns Array of translations.
 */
export function getTranslationsForSearching(
  languageData?: LanguageData[]
): SearchLanguageData {
  const data: SearchLanguageData = []

  const allLanguageData: LanguageData[] = [
    defaultLanguageData,
    ...(languageData ?? []),
  ]

  for (const itemId of Object.keys(defaultLanguageData.translations)) {
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
