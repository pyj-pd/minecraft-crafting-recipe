import { ZodType } from 'zod'

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
