import { readdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { LanguageData, RawLanguageFile } from '../types/language'
import { minecraftPrefix } from '../types/minecraft'
import {
  getFileNameWithoutExtension,
  parseRawFile,
  PARSING_TAG_TYPES,
} from './common'
import { getTagData } from './process-tags'

// Paths
const RAW_LANGUAGE_DATA_FOLDER = path.resolve(
  import.meta.dirname,
  '../data/raw_data/lang'
)
const PROCESSED_LANGUAGE_DATA_FOLDER = path.resolve(
  import.meta.dirname,
  '../public/data/translations/'
)

// Strings
const TRANSLATION_SEPARATOR = '.'
const ITEM_SEPARATOR = ':'

export async function processRawLanguageData() {
  const rawLanguageFileList = await readdir(RAW_LANGUAGE_DATA_FOLDER)

  let processed = 0

  for (const fileName of rawLanguageFileList) {
    const filePath = path.join(RAW_LANGUAGE_DATA_FOLDER, fileName)
    const fileContent = await readFile(filePath, { encoding: 'utf-8' })

    const rawLanguageData = await parseRawFile(fileContent, RawLanguageFile)

    if (rawLanguageData === null) continue // Invalid file format

    const languageId = getFileNameWithoutExtension(fileName)

    const languageData: LanguageData = { languageId, translations: {} }

    for (const [key, translation] of Object.entries(rawLanguageData)) {
      const splitKeys = key.split(TRANSLATION_SEPARATOR)

      if (!PARSING_TAG_TYPES.includes(splitKeys[0])) continue // Only useful translations

      const itemKeys = splitKeys.slice(1) // Remove key types(such as `item.`, `block.`)

      if (itemKeys.length !== 2) continue // Items such as banner have several types of items, so exclude these things
      if (itemKeys[0] !== minecraftPrefix) continue

      const itemId = itemKeys.join(ITEM_SEPARATOR)
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
