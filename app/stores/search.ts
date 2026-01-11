import { DEFAULT_LANGUAGE_ID } from '@/constants/default'
import type { LanguageData, SearchLanguageData } from '#shared/types/language'
import type { ItemId } from '#shared/types/minecraft'
import {
  fetchTranslationData,
  getTranslationsForSearching,
} from '@/utils/language'
import Fuse from 'fuse.js'
import { defineStore } from 'pinia'

const SEARCH_RESULT_LIMIT = 15

const createFuseInstance = (
  translationData: LanguageData[]
): Fuse<SearchLanguageData[number]> => {
  const translationDataForSearching =
    getTranslationsForSearching(translationData)

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
    _defaultTranslationData: null as null | LanguageData,
    translationData: null as null | LanguageData,

    // Search
    searchResults: null as null | ItemId[],
    fuseInstance: null as null | Fuse<SearchLanguageData[number]>,
    lastQuery: null as null | string,

    _languageAbortController: null as AbortController | null,
  }),
  actions: {
    async _fetchInitialData(): Promise<void> {
      const defaultTranslationData = await fetchTranslationData(
        DEFAULT_LANGUAGE_ID
      )
      this._defaultTranslationData = defaultTranslationData
      this.translationData = defaultTranslationData

      this._createFuseInstance()
    },
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
      this._createFuseInstance()
    },
    _createFuseInstance(): void {
      const translationDataList = []
      if (this._defaultTranslationData)
        translationDataList.push(this._defaultTranslationData)
      if (this.translationData) translationDataList.push(this.translationData)

      this.fuseInstance = createFuseInstance(translationDataList)
    },
    searchItem(rawQuery: string): void {
      if (this.fuseInstance === null) return

      const trimmedRawQuery = rawQuery.trim()
      if (trimmedRawQuery.length < 1) return // Empty query

      // @todo
      const query = trimmedRawQuery //inko.ko2en(trimmedRawQuery)
      if (this.lastQuery === query) return // Skip same query

      this.lastQuery = query

      const results = this.fuseInstance
        .search(query, { limit: SEARCH_RESULT_LIMIT })
        .map((result) => result.item.itemId)

      this.searchResults = results
    },
  },
})
