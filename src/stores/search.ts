import { DEFAULT_LANGUAGE_ID } from '@/constants/default'
import type { LanguageData } from '@shared/types/language'
import type { ItemId } from '@shared/types/minecraft'
import {
  fetchTranslationData,
  getTranslationsForSearching,
  inko,
} from '@/utils/language'
import Fuse from 'fuse.js'
import { defineStore, storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const SEARCH_RESULT_LIMIT = 15

export const useSearchStore = defineStore('search', {
  state: () => ({
    // Language
    languageId: DEFAULT_LANGUAGE_ID,
    _DEFAULT_TRANSLATION_DATA: null as null | LanguageData,
    translationData: null as null | LanguageData,

    // Search
    searchResults: null as null | ItemId[],
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
  getters: {
    fuseInstance: (state) => {
      const translationDataList: LanguageData[] = []

      if (state._DEFAULT_TRANSLATION_DATA)
        translationDataList.push(state._DEFAULT_TRANSLATION_DATA)
      if (state.translationData) translationDataList.push(state.translationData)

      const translationDataForSearching =
        getTranslationsForSearching(translationDataList)

      const fuseInstance = new Fuse(translationDataForSearching, {
        isCaseSensitive: false,
        keys: ['itemId', 'translations'],
      })

      return fuseInstance
    },
  },
})

export const initSearchStore = (): void => {
  const { _DEFAULT_TRANSLATION_DATA, translationData } = storeToRefs(
    useSearchStore()
  )

  onMounted(async () => {
    if (_DEFAULT_TRANSLATION_DATA.value !== null) return

    // Fetch default language data
    const fetchedData = await fetchTranslationData(DEFAULT_LANGUAGE_ID)

    _DEFAULT_TRANSLATION_DATA.value = fetchedData
    translationData.value = structuredClone(fetchedData)
  })
}
