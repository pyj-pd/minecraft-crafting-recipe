import { DEFAULT_LANGUAGE_ID } from '@/constants/default'
import { LanguageData, SearchLanguageData } from '@shared/types/language'
import type { ItemId } from '@shared/types/minecraft'
import {
  DATA_FILE_EXTENSION,
  LANGUAGE_DATA_FILE_URL,
} from '@shared/constants/path'
import Inko from 'inko'
import recipeList from '@/data/recipe-list.json'

export async function getTranslationData(
  languageId: string
): Promise<LanguageData> {
  const response = await fetch(
    `${LANGUAGE_DATA_FILE_URL}${languageId}${DATA_FILE_EXTENSION}`
  )
  const data = LanguageData.parse(await response.json())

  return data
}

export const defaultLanguageData = await getTranslationData(DEFAULT_LANGUAGE_ID)

export const inko = new Inko()

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

  for (const itemId of recipeList) {
    const itemData: SearchLanguageData[number] = {
      itemId: itemId as ItemId,
      translations: [],
    }

    for (const translation of allLanguageData) {
      const rawTranslationString = translation.translations[itemId as ItemId]
      if (!rawTranslationString) continue

      const translationString = inko.ko2en(rawTranslationString) // For korean search
      itemData.translations.push(translationString)
    }

    if (itemData.translations.length > 0) data.push(itemData)
  }

  return data
}
