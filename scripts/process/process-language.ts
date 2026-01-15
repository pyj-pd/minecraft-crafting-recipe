import { access, mkdir, readdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import {
  LanguageData,
  RawLanguageFile,
  type LanguageListData,
} from '../../shared/types/language'
import { ItemId } from '../../shared/types/minecraft'
import {
  getFileNameWithoutExtension,
  LANGUAGE_LIST_DATA_FILE_PATH,
  LOG_SEPARATOR,
  parseRawFile,
  PARSING_TAG_TYPES,
  PROCESSED_LANGUAGE_DATA_FOLDER,
  RAW_LANGUAGE_DATA_FOLDER,
} from '../common'
import { minecraftNamespace } from '../../shared/constants/minecraft'

// Strings
const TRANSLATION_SEPARATOR = '.'
const ITEM_SEPARATOR = ':'

const LANGUAGE_NAME_KEY = 'language.name'

/**
 * Parses raw language files into processed data.
 * This function will remove all other translations that are not blocks or items.
 */
export async function processRawLanguageData(): Promise<void> {
  const rawLanguageFileList = await readdir(RAW_LANGUAGE_DATA_FOLDER, {
    withFileTypes: true,
  })

  // Create processed data folder if not exists
  try {
    await access(PROCESSED_LANGUAGE_DATA_FOLDER)
  } catch {
    await mkdir(PROCESSED_LANGUAGE_DATA_FOLDER)
  }

  const processedLanguages: LanguageListData[] = []

  // Parse each language file
  for (const fileInfo of rawLanguageFileList) {
    if (!fileInfo.isFile()) continue // Only parse files

    const fileName = fileInfo.name
    const filePath = path.join(RAW_LANGUAGE_DATA_FOLDER, fileName)
    const fileContent = await readFile(filePath, { encoding: 'utf-8' })

    const rawLanguageData = await parseRawFile(fileContent, RawLanguageFile)

    if (rawLanguageData === null) continue // Invalid file format

    const languageId = getFileNameWithoutExtension(fileName)
    const languageName = rawLanguageData[LANGUAGE_NAME_KEY]

    const languageData: LanguageData = {
      languageId,
      languageName,
      translations: {},
    }

    // Parse each item
    for (const [key, translation] of Object.entries(rawLanguageData)) {
      const splitKeys = key.split(TRANSLATION_SEPARATOR)

      const itemType = splitKeys[0]
      if (!PARSING_TAG_TYPES.includes(itemType)) continue // Only include items that are blocks or items

      const itemKeys = splitKeys.slice(1) // Remove key types(such as `item.`, `block.`)

      if (itemKeys.length !== 2) continue // Items such as banner have several types of items, so exclude these things
      if (itemKeys[0] !== minecraftNamespace) continue

      const itemId = itemKeys.join(ITEM_SEPARATOR) as ItemId

      languageData.translations[itemId] = translation
    }

    const processedFilePath = path.join(
      PROCESSED_LANGUAGE_DATA_FOLDER,
      fileName
    )
    await writeFile(processedFilePath, JSON.stringify(languageData))

    processedLanguages.push({
      languageId,
      languageName,
    })
  }

  // Write language list data file
  await writeFile(
    LANGUAGE_LIST_DATA_FILE_PATH,
    JSON.stringify(processedLanguages)
  )

  const processedCount = processedLanguages.length

  console.log(LOG_SEPARATOR)
  console.log(
    `Processed ${processedCount} language file${
      processedCount > 1 ? 's' : ''
    } successfully.`
  )
}
