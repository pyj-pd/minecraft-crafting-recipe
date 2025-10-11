import { DEFAULT_LANGUAGE_ID } from '@/constants/default'
import type { LanguageData, SearchLanguageData } from '@shared/types/language'
import type { ItemId } from '@shared/types/minecraft'
import {
  defaultLanguageData,
  getTranslationData,
  getTranslationsForSearching,
  inko,
} from '@/utils/language'
import Fuse from 'fuse.js'
import { defineStore } from 'pinia'

const SEARCH_RESULT_LIMIT = 5

const createFuseInstance = (
  translationData?: LanguageData
): Fuse<SearchLanguageData[number]> => {
  const translationDataForSearching = getTranslationsForSearching(
    translationData ? [translationData] : undefined // Use default language data if data not provided
  )
  const fuseInstance = new Fuse(translationDataForSearching, {
    isCaseSensitive: false,
    keys: ['itemId', 'translations'],
  })

  return fuseInstance
}

export const useSearchStore = defineStore('search', {
  state: () => ({
    // Language
    languageId: DEFAULT_LANGUAGE_ID,
    translationData: defaultLanguageData as null | LanguageData,

    // Search
    searchResults: null as null | ItemId[],
    fuseInstance: createFuseInstance(),
  }),
  actions: {
    async setLanguage(newLanguageId: string): Promise<void> {
      const translationData = await getTranslationData(newLanguageId)

      // Set language
      this.languageId = newLanguageId
      this.translationData = translationData

      // Create Fuse instance
      this.fuseInstance = createFuseInstance(translationData)
    },
    searchItem(rawQuery: string): void {
      const query = inko.ko2en(rawQuery)

      const results = this.fuseInstance
        .search(query, { limit: SEARCH_RESULT_LIMIT })
        .map((result) => result.item.itemId)

      this.searchResults = results
    },
  },
})
