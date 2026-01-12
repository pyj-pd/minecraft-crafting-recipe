import { LanguageData, SearchLanguageData } from '#shared/types/language'
import type { ItemId } from '#shared/types/minecraft'
import {
  DATA_FILE_EXTENSION,
  LANGUAGE_DATA_FILE_URL,
} from '#shared/constants/path'
import recipeList from '@/assets/data/recipe-list.json'

export function recipeExists(itemId: ItemId): boolean {
  return recipeList.includes(itemId)
}

export async function fetchTranslationData(
  languageId: string,
  signal?: AbortSignal
): Promise<LanguageData> {
  const response = await $fetch<LanguageData>(
    `${LANGUAGE_DATA_FILE_URL}${languageId}${DATA_FILE_EXTENSION}`,
    { signal }
  )
  const data = LanguageData.parse(response)

  return data
}

/**
 * Gets array of items' translations that can be used for fuzzy searching.
 * @param languageData Optional. Array of language data that will be merged together.
 * @returns Array of translations.
 */
export function getTranslationsForSearching(
  languageData?: LanguageData[]
): SearchLanguageData {
  const data: SearchLanguageData = []

  const allLanguageData: LanguageData[] = [...(languageData ?? [])]

  for (const itemId of recipeList) {
    const itemData: SearchLanguageData[number] = {
      itemId: itemId as ItemId,
      translations: [],
    }

    for (const translation of allLanguageData) {
      const rawTranslationString = translation.translations[itemId as ItemId]
      if (!rawTranslationString) continue

      // @todo add korean to english
      const translationString = rawTranslationString //inko.ko2en(rawTranslationString) // For korean search
      itemData.translations.push(translationString)
    }

    if (itemData.translations.length > 0) data.push(itemData)
  }

  return data
}
