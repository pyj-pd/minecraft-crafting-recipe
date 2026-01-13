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
import { onMounted, watch } from 'vue'
import { LocalStorageUtil } from '@/utils/local-storage'
import { LanguageId } from '@/types/language'

const SEARCH_RESULT_LIMIT = 15

const LANGUAGE_ID_LOCAL_STORAGE_KEY = 'languageId'

export const useSearchStore = defineStore('search', {
  state: () => ({
    // Language
    languageId: DEFAULT_LANGUAGE_ID as LanguageId,
    _DEFAULT_TRANSLATION_DATA: null as null | LanguageData,
    translationData: null as null | LanguageData,

    // Search
    searchResults: null as null | ItemId[],
    lastQuery: null as null | string,

    _languageAbortController: null as AbortController | null,
  }),
  actions: {
    async setLanguage(newLanguageId: string): Promise<void> {
      if (this.isLanguageLoading) this._languageAbortController?.abort()

      this._languageAbortController = new AbortController()

      const translationData = await fetchTranslationData(
        newLanguageId,
        this._languageAbortController.signal
      )

      this._languageAbortController = null

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
    isLanguageLoading: (state) => state._languageAbortController !== null,
  },
})

export const initSearchStore = (): void => {
  const searchStore = useSearchStore()
  const { setLanguage } = searchStore
  const { _DEFAULT_TRANSLATION_DATA, translationData, languageId } =
    storeToRefs(searchStore)
  let languageLocalStorageUtil: null | LocalStorageUtil<string> = null

  /**
   * Fetches default language data.
   */
  const fetchDefaultLanguageData = async (): Promise<void> => {
    const fetchedData = await fetchTranslationData(DEFAULT_LANGUAGE_ID)

    _DEFAULT_TRANSLATION_DATA.value = fetchedData

    if (translationData.value === null)
      translationData.value = structuredClone(fetchedData)
  }

  /**
   * Initializes language from local storage.
   * @todo add loading indicator for this
   */
  const initLanguageLocalStorage = async (): Promise<void> => {
    if (languageLocalStorageUtil === null)
      languageLocalStorageUtil = new LocalStorageUtil(
        LANGUAGE_ID_LOCAL_STORAGE_KEY,
        LanguageId
      )

    const storedLanguageId = languageLocalStorageUtil.getData()
    if (storedLanguageId !== null && storedLanguageId !== DEFAULT_LANGUAGE_ID)
      await setLanguage(storedLanguageId)
  }

  // Watch language id data and store it in local storage
  watch(languageId, (newLanguageId) => {
    if (languageLocalStorageUtil === null) return

    languageLocalStorageUtil.setData(newLanguageId)
  })

  onMounted(async () => {
    await fetchDefaultLanguageData()

    await initLanguageLocalStorage()
  })
}
