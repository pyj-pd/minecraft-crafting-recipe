import 'server-only'
import { readdir, readFile } from 'fs/promises'
import path from 'path'
import {
  ITEM_TAG_PREFIX,
  ItemId,
  ItemTag,
  minecraftNamespace,
} from '../shared/types/minecraft'
import { RawTagFile, TagsData } from '../shared/types/tags'
import {
  getFileNameWithoutExtension,
  parseRawFile,
  PARSING_TAG_TYPES,
  RAW_TAGS_DATA_FOLDER,
} from './common'

const TAG_PREFIX = `${ITEM_TAG_PREFIX}${minecraftNamespace}:`

/**
 * This one loop through the tag files and replaces all recursive tags into items inside the files for easier development and usage.
 * This function will NOT write any files, but return processed data only.
 * @see https://minecraft.wiki/w/Tag_(Java_Edition)
 */
export async function getTagData(): Promise<TagsData> {
  const rawTagFileList = await readdir(RAW_TAGS_DATA_FOLDER, {
    withFileTypes: true,
  })

  const tagPaths: Record<string, string> = {}

  // Remember path of every tag
  for (const tagTypeNameFile of rawTagFileList) {
    if (!tagTypeNameFile.isDirectory()) continue // Only parse directories

    const tagTypeName = tagTypeNameFile.name
    if (!PARSING_TAG_TYPES.includes(tagTypeName)) continue // Only parse useful tags

    const tagTypePath = path.join(RAW_TAGS_DATA_FOLDER, tagTypeName)
    const tagList = await readdir(tagTypePath, { withFileTypes: true })

    for (const fileInfo of tagList) {
      if (!fileInfo.isFile()) continue // Only read files

      const fileName = fileInfo.name
      const filePath = path.join(tagTypePath, fileName)

      const tagName = TAG_PREFIX + getFileNameWithoutExtension(fileName)

      tagPaths[tagName] = filePath
    }
  }

  // Parse all tags
  const tagData: TagsData = {}

  async function getTagItems(tagName: string): Promise<ItemId[]> {
    const itemIds: ItemId[] = []

    if (!(tagName in tagPaths)) throw new Error('No such file.')

    const fileContent = await readFile(tagPaths[tagName], { encoding: 'utf-8' })
    const rawTagData = await parseRawFile(fileContent, RawTagFile)

    if (rawTagData === null) throw new Error('Invalid file format.')

    const { values } = rawTagData

    for (const value of values) {
      if (!value.startsWith(ITEM_TAG_PREFIX))
        itemIds.push(value as ItemId) // It is pure item id
      else {
        // It is tag name
        try {
          const tagItemIds =
            tagData[value as ItemTag] || (await getTagItems(value as ItemTag))
          itemIds.push(...tagItemIds)
        } catch {
          continue
        }
      }
    }

    return itemIds
  }

  for (const tagName of Object.keys(tagPaths) as ItemTag[]) {
    try {
      const itemIds = await getTagItems(tagName)
      tagData[tagName] = itemIds
    } catch {
      continue
    }
  }

  return tagData
}
