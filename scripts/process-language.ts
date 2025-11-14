import { access, mkdir, readdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { LanguageData, RawLanguageFile } from '../shared/types/language'
import { ItemId } from '../shared/types/minecraft'
import {
  getFileNameWithoutExtension,
  parseRawFile,
  PARSING_TAG_TYPES,
  PROCESSED_LANGUAGE_DATA_FOLDER,
  PROCESSED_RECIPE_DATA_FOLDER,
  RAW_LANGUAGE_DATA_FOLDER,
} from './common'
import { DATA_FILE_EXTENSION } from '../shared/constants/path'
import {
  minecraftPrefix,
  minecraftNamespace,
} from '../shared/constants/minecraft'

// Strings
const TRANSLATION_SEPARATOR = '.'
const ITEM_SEPARATOR = ':'

/**
 * Parses raw language files into processed data.
 * This function will remove all other translations that are not included in the recipe data.
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

  // Get item lists from recipe data
  const itemList: ItemId[] = []
  for (const fileInfo of await readdir(PROCESSED_RECIPE_DATA_FOLDER, {
    withFileTypes: true,
  })) {
    const fileName = fileInfo.name
    if (!fileInfo.isFile || !fileName.endsWith(DATA_FILE_EXTENSION)) continue // Only read recipe file

    const itemId: ItemId = `${minecraftPrefix}${getFileNameWithoutExtension(
      fileName
    )}`
    itemList.push(itemId)
  }

  let processed = 0

  // Parse each language file
  for (const fileInfo of rawLanguageFileList) {
    if (!fileInfo.isFile()) continue // Only parse files

    const fileName = fileInfo.name
    const filePath = path.join(RAW_LANGUAGE_DATA_FOLDER, fileName)
    const fileContent = await readFile(filePath, { encoding: 'utf-8' })

    const rawLanguageData = await parseRawFile(fileContent, RawLanguageFile)

    if (rawLanguageData === null) continue // Invalid file format

    const languageId = getFileNameWithoutExtension(fileName)

    const languageData: LanguageData = { languageId, translations: {} }

    // Parse each item
    for (const [key, translation] of Object.entries(rawLanguageData)) {
      const splitKeys = key.split(TRANSLATION_SEPARATOR)

      if (!PARSING_TAG_TYPES.includes(splitKeys[0])) continue // Only useful translations

      const itemKeys = splitKeys.slice(1) // Remove key types(such as `item.`, `block.`)

      if (itemKeys.length !== 2) continue // Items such as banner have several types of items, so exclude these things
      if (itemKeys[0] !== minecraftNamespace) continue

      const itemId = itemKeys.join(ITEM_SEPARATOR) as ItemId
      if (!itemList.includes(itemId)) continue // Only include items that are included in recipe data

      languageData.translations[itemId] = translation
    }

    const processedFilePath = path.join(
      PROCESSED_LANGUAGE_DATA_FOLDER,
      fileName
    )
    await writeFile(processedFilePath, JSON.stringify(languageData))
    processed++
  }

  console.log(
    `Processed ${processed} language file${
      processed > 1 ? 's' : ''
    } successfully.`
  )
}

await processRawLanguageData()
