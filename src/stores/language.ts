import { DEFAULT_LANGUAGE_ID } from '@/constants/default'
import type { LanguageData } from '@/types/language'
import { getTranslationData } from '@/utils/language'
import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    languageId: DEFAULT_LANGUAGE_ID,
    translationData: null as null | LanguageData,
  }),
  actions: {
    async setLanguage(newLanguageId: string) {
      const data = await getTranslationData(newLanguageId)

      this.languageId = newLanguageId
      this.translationData = data
    },
  },
})
