import { DEFAULT_LANGUAGE_ID } from '~/constants/default'
import { useSearchStore } from '~/stores/search'
import {
  DATA_FILE_EXTENSION,
  LANGUAGE_DATA_FILE_URL,
} from '~~/shared/constants/path'

export default defineNuxtPlugin(async () => {
  const searchStore = useSearchStore()

  // Load default language data server-side for prerendering
  if (import.meta.server) {
    const { readFile } = await import('fs/promises')
    const path = await import('path')

    // Read the file from the /public folder
    const filePath = path.resolve(
      process.cwd(),
      'public',
      `.${LANGUAGE_DATA_FILE_URL}`,
      `${DEFAULT_LANGUAGE_ID}${DATA_FILE_EXTENSION}`
    )

    // Load file data
    const rawFileData = await readFile(filePath, { encoding: 'utf-8' })
    const translationData = LanguageData.parse(JSON.parse(rawFileData))

    // Save in store
    searchStore._defaultTranslationData = translationData
    searchStore.translationData = translationData
  }
})
