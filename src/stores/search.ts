import { DEFAULT_LANGUAGE_ID } from '@/constants/default'
import type { LanguageData, SearchLanguageData } from '@shared/types/language'
import type { ItemId } from '@shared/types/minecraft'
import {
  defaultLanguageData,
  fetchTranslationData,
  getTranslationsForSearching,
  inko,
} from '@/utils/language'
import Fuse from 'fuse.js'
import { defineStore } from 'pinia'

const SEARCH_RESULT_LIMIT = 15

const createFuseInstance = (
  translationData?: LanguageData
): Fuse<SearchLanguageData[number]> => {
  const translationDataForSearching = getTranslationsForSearching(
    translationData
      ? [translationData] // Merge this translation data into default language data
      : undefined // Use default language data if no parameter provided
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
    lastQuery: null as null | string,

    _languageAbortController: null as AbortController | null,
  }),
  actions: {
    async setLanguage(newLanguageId: string): Promise<void> {
      if (this._languageAbortController) this._languageAbortController.abort()

      this._languageAbortController = new AbortController()

      const translationData = await fetchTranslationData(
        newLanguageId,
        this._languageAbortController.signal
      )

      // Set language
      this.languageId = newLanguageId
      this.translationData = translationData

      // Create Fuse instance
      this.fuseInstance = createFuseInstance(translationData)
    },
    searchItem(rawQuery: string): void {
      const trimmedRawQuery = rawQuery.trim()
      if (trimmedRawQuery.length < 1) return // Empty query

      const query = inko.ko2en(trimmedRawQuery)
      if (this.lastQuery === query) return // Skip same query

      this.lastQuery = query

      const results = this.fuseInstance
        .search(query, { limit: SEARCH_RESULT_LIMIT })
        .map((result) => result.item.itemId)

      this.searchResults = results
    },
  },
})
