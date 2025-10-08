import { ZodType } from 'zod'
import { ItemId, minecraftPrefix } from '../src/types/minecraft'
import path from 'path'
import {
  LANGUAGE_DATA_FILE_URL,
  RECIPE_DATA_FILE_URL,
} from '../shared/constants/path'

// Paths
// Recipe files
export const RAW_RECIPE_DATA_FOLDER = path.resolve(
  import.meta.dirname,
  '../data/raw_data/recipe'
)
export const PROCESSED_RECIPE_DATA_FOLDER = path.resolve(
  import.meta.dirname,
  '../public',
  `.${RECIPE_DATA_FILE_URL}`
)

// Language files
export const RAW_LANGUAGE_DATA_FOLDER = path.resolve(
  import.meta.dirname,
  '../data/raw_data/lang'
)
export const PROCESSED_LANGUAGE_DATA_FOLDER = path.resolve(
  import.meta.dirname,
  '../public',
  `.${LANGUAGE_DATA_FILE_URL}`
)

// Tag files
export const RAW_TAGS_DATA_FOLDER = path.resolve(
  import.meta.dirname,
  '../data/raw_data/tags'
)

// Strings
export const PARSING_TAG_TYPES = ['block', 'item']

export async function parseRawFile<DataType extends ZodType>(
  fileContent: string,
  Schema: DataType
) {
  try {
    const rawLanguageData = await Schema.parseAsync(JSON.parse(fileContent))

    return rawLanguageData
  } catch {
    return null
  }
}

const EXTENSION_SEPARATOR = '.'

export function getFileNameWithoutExtension(fileName: string) {
  const lastIndex = fileName.lastIndexOf(EXTENSION_SEPARATOR)

  if (lastIndex < 0) return fileName
  else return fileName.substring(0, lastIndex)
}

/**
 * Removes `minecraft:` prefix from item id.
 */
export function getPureItemName(itemId: ItemId): string {
  const index = itemId.indexOf(minecraftPrefix)

  if (index < 0) return itemId
  else return itemId.substring(index + minecraftPrefix.length)
}
