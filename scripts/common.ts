import { ZodType, type output } from 'zod'
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

export const RECIPE_LIST_DATA_FILE_PATH = path.resolve(
  import.meta.dirname,
  '../src/data/recipe-list.json'
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
): Promise<null | output<DataType>> {
  try {
    const rawLanguageData = Schema.parse(JSON.parse(fileContent))

    return rawLanguageData
  } catch {
    return null
  }
}

const EXTENSION_SEPARATOR = '.'

export function getFileNameWithoutExtension(fileName: string): string {
  const lastIndex = fileName.lastIndexOf(EXTENSION_SEPARATOR)

  if (lastIndex < 0) return fileName
  else return fileName.substring(0, lastIndex)
}
