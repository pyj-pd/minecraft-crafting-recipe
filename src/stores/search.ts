import { DEFAULT_LANGUAGE_ID } from '@/constants/default'
import type { LanguageData, SearchLanguageData } from '@shared/types/language'
import type { ItemId } from '@shared/types/minecraft'
import {
  getTranslationData,
  getTranslationsForSearching,
  inko,
} from '@/utils/language'
import Fuse from 'fuse.js'
import { defineStore } from 'pinia'

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
    translationData: null as null | LanguageData,

    // Fuse
    fuseInstance: createFuseInstance(),
    selectedItemId: null as null | ItemId,
  }),
  actions: {
    async setLanguage(newLanguageId: string) {
      const translationData = await getTranslationData(newLanguageId)

      // Set language
      this.languageId = newLanguageId
      this.translationData = translationData

      // Create Fuse instance
      this.fuseInstance = createFuseInstance(translationData)
    },
    searchItem(rawQuery: string): ItemId[] {
      const query = inko.ko2en(rawQuery)

      const results = this.fuseInstance
        .search(query, { limit: 10 })
        .map((result) => result.item.itemId)

      return results
    },
  },
})
