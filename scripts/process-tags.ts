import { readdir, readFile } from 'fs/promises'
import path from 'path'
import { ITEM_TAG_PREFIX, minecraftPrefix } from '../types/minecraft'
import { RawTagFile, TagsData } from '../types/tags'
import {
  getFileNameWithoutExtension,
  parseRawFile,
  PARSING_TAG_TYPES,
} from './common'

// Paths
const RAW_TAGS_DATA_FOLDER = path.resolve(
  import.meta.dirname,
  '../data/raw_data/tags'
)

const TAG_PREFIX = `${ITEM_TAG_PREFIX}${minecraftPrefix}:`

/**
 * This one loop through the tag files and removes all recursive tags inside the files for easier development and usage.
 * This function will NOT write any files, but return processed data only.
 * @see https://minecraft.wiki/w/Tag_(Java_Edition)
 */
export async function getTagData() {
  const rawTagFileList = await readdir(RAW_TAGS_DATA_FOLDER)

  const tagPaths: Record<string, string> = {}

  // Remember path of every tag
  for (const tagTypeName of rawTagFileList) {
    if (!PARSING_TAG_TYPES.includes(tagTypeName)) continue // Only parse useful tags

    const tagTypePath = path.join(RAW_TAGS_DATA_FOLDER, tagTypeName)
    const tagList = await readdir(tagTypePath, { withFileTypes: true })

    for (const fileInfo of tagList) {
      if (!fileInfo.isFile) continue // Only read files

      const fileName = fileInfo.name
      const filePath = path.join(tagTypePath, fileName)

      const tagName = TAG_PREFIX + getFileNameWithoutExtension(fileName)

      tagPaths[tagName] = filePath
    }
  }

  // Parse all tags
  async function getTagItems(tagName) {
    const itemIds: string[] = []

    if (!(tagName in tagPaths)) throw new Error('No such file.')

    const fileContent = await readFile(tagPaths[tagName], { encoding: 'utf-8' })
    const rawTagData = await parseRawFile(fileContent, RawTagFile)

    if (rawTagData === null) throw new Error('Invalid file format.')

    const { values } = rawTagData

    for (const value of values) {
      if (!value.startsWith(ITEM_TAG_PREFIX))
        itemIds.push(value) // It is pure item id
      else {
        // It is tag name
        try {
          const tagItemIds = await getTagItems(value)
          itemIds.push(...tagItemIds)
        } catch (error) {
          continue
        }
      }
    }

    return itemIds
  }

  const tagData: TagsData = {}

  for (const tagName of Object.keys(tagPaths)) {
    try {
      const itemIds = await getTagItems(tagName)
      tagData[tagName] = itemIds
    } catch {
      continue
    }
  }

  return tagData
}
