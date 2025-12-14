import { readdir, readFile, writeFile, mkdir, access } from 'fs/promises'
import path from 'path'
import {
  RawRecipeData,
  RawShapedRecipeData,
  RawShapelessRecipeData,
  RecipeData,
  RecipeFileData,
  ShapedRecipe,
  ShapedRecipeGrid,
  ShapelessRecipe,
} from '../shared/types/recipe'
import * as z from 'zod'
import {
  parseRawFile,
  PROCESSED_RECIPE_DATA_FOLDER,
  RAW_RECIPE_DATA_FOLDER,
  RECIPE_LIST_DATA_FILE_PATH,
} from './common'
import { getTagData } from './process-tags'
import {
  ITEM_TAG_PREFIX,
  ItemId,
  ItemTag,
  PossibleItem,
} from '../shared/types/minecraft'
import { DATA_FILE_EXTENSION } from '../shared/constants/path'
import { getPureItemName } from '../shared/utils/string'
import {
  SHAPED_RECIPE_TAG,
  SHAPELESS_RECIPE_TAG,
} from '../shared/constants/minecraft'

// Recipe
const DEFAULT_ITEM_COUNT = 1

// Tags
const tagData = await getTagData()

/**
 * @see https://minecraft.wiki/w/Recipe
 */
export async function processRawRecipeData(): Promise<void> {
  const rawRecipeFileList = await readdir(RAW_RECIPE_DATA_FOLDER, {
    withFileTypes: true,
  })

  // Create processed data folder if not exists
  try {
    await access(PROCESSED_RECIPE_DATA_FOLDER)
  } catch {
    await mkdir(PROCESSED_RECIPE_DATA_FOLDER)
  }

  // Temporary object before actually writing to files
  const fileData: Record<ItemId, RecipeFileData> = {}

  let processedItems = 0,
    processedRecipes = 0, // Because there are duplicated recipes sometimes
    processedFiles = 0

  const processedItemIds: ItemId[] = []

  const failedToParseFileNames: string[] = []

  for (const fileInfo of rawRecipeFileList) {
    if (!fileInfo.isFile()) continue // Only parse files

    const fileName = fileInfo.name
    const filePath = path.join(RAW_RECIPE_DATA_FOLDER, fileName)
    const fileContent = await readFile(filePath, { encoding: 'utf-8' })

    const rawRecipeData = await parseRawFile(fileContent, RawRecipeData)

    if (rawRecipeData === null) {
      // Invalid file format
      if (
        fileContent.includes(SHAPED_RECIPE_TAG) ||
        fileContent.includes(SHAPELESS_RECIPE_TAG)
      )
        failedToParseFileNames.push(fileName)

      continue
    }

    let processedData: ProcessedDataReturnType | null = null

    switch (rawRecipeData.type) {
      case SHAPED_RECIPE_TAG:
        processedData = await processShapedRecipeData(rawRecipeData)
        break

      case SHAPELESS_RECIPE_TAG:
        processedData = await processShapelessRecipeData(rawRecipeData)
        break

      default:
        break
    }

    if (processedData === null) continue // The data was not parsed

    const { itemId, allItemIds, recipeData } = processedData

    if (!(itemId in fileData)) {
      processedItems++
      fileData[itemId] = {
        itemId,
        allItemIds: [],
        variants: [],
      }
    }

    for (const involvedItemId of allItemIds) {
      if (!fileData[itemId].allItemIds.includes(involvedItemId))
        fileData[itemId].allItemIds.push(involvedItemId)
    }

    fileData[itemId].variants.push(recipeData)

    processedRecipes++
  }

  // Write to files
  for (const [itemId, recipeFileData] of Object.entries(fileData)) {
    const itemName = getPureItemName(itemId as ItemId)

    const processedFilePath = path.join(
      PROCESSED_RECIPE_DATA_FOLDER,
      itemName + DATA_FILE_EXTENSION
    )
    await writeFile(processedFilePath, JSON.stringify(recipeFileData))

    processedFiles++
    processedItemIds.push(itemId as ItemId)
  }

  // Write recipe list data file
  await writeFile(RECIPE_LIST_DATA_FILE_PATH, JSON.stringify(processedItemIds))

  console.log(`Processed files: ${processedFiles}`)
  console.log(`Processed items: ${processedItems}`)
  console.log(`Processed recipes: ${processedRecipes}`)
  console.log(
    `\nThese files couldn't be parsed for some reasons: ${failedToParseFileNames.join(
      ', '
    )}`
  )
}

type ProcessedDataReturnType<RecipeDataType = RecipeData> = {
  itemId: ItemId
  allItemIds: Set<ItemId>
  recipeData: RecipeDataType
}

/**
 * Processes raw shaped recipe data.
 * @param data Raw recipe data
 * @returns Processed shaped recipe data
 * @see https://minecraft.wiki/w/Recipe#crafting_shaped
 */
async function processShapedRecipeData(
  data: RawShapedRecipeData
): Promise<ProcessedDataReturnType<ShapedRecipe>> {
  const recipe = {
    grid: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ] as z.infer<typeof ShapedRecipeGrid>,
  }

  const allItemIds = new Set<ItemId>()

  for (
    let patternIndex = 0;
    patternIndex < data.pattern.length;
    patternIndex++
  ) {
    const rawPatternRow = data.pattern[patternIndex]

    for (let keyIndex = 0; keyIndex < rawPatternRow.length; keyIndex++) {
      const key = rawPatternRow[keyIndex]

      if (!(key in data.key)) continue

      const rawItemData = data.key[key]
      let itemData: PossibleItem

      if (typeof rawItemData === 'string') {
        if (rawItemData.startsWith(ITEM_TAG_PREFIX))
          // Convert tag into array of items
          itemData = tagData[rawItemData as ItemTag]
        // It's normal item
        else itemData = rawItemData as ItemId
      }
      // Array of items
      // @todo optimize repeated code
      else
        itemData = rawItemData.flatMap((value) =>
          value.startsWith(ITEM_TAG_PREFIX)
            ? tagData[value as ItemTag]
            : (value as ItemId)
        )

      recipe.grid[patternIndex][keyIndex] = itemData

      if (typeof itemData === 'string') allItemIds.add(itemData)
      else itemData.forEach((id) => allItemIds.add(id))
    }
  }

  // Result
  const itemId = data.result.id
  allItemIds.add(itemId)

  const recipeData: ShapedRecipe = {
    type: 'shaped',
    count: data.result.count ?? DEFAULT_ITEM_COUNT,
    recipe,
  }

  return { itemId, allItemIds, recipeData }
}

/**
 * Processes raw shapeless recipe data.
 * @param data Raw recipe data
 * @returns Processed shapeless recipe data
 * @see https://minecraft.wiki/w/Recipe#crafting_shapeless
 */
async function processShapelessRecipeData(
  data: RawShapelessRecipeData
): Promise<ProcessedDataReturnType<ShapelessRecipe>> {
  const ingredientItems: PossibleItem[] = []

  const allItemIds = new Set<ItemId>()

  for (const rawItemData of data.ingredients) {
    let currentItem: PossibleItem

    if (typeof rawItemData === 'string') {
      if (rawItemData.startsWith(ITEM_TAG_PREFIX))
        // Convert tag id into array of items
        currentItem = tagData[rawItemData as ItemTag]
      // Normal item id
      else currentItem = rawItemData as ItemId
    }
    // Array of items
    else
      currentItem = rawItemData.flatMap((value) =>
        value.startsWith(ITEM_TAG_PREFIX)
          ? tagData[value as ItemTag]
          : (value as ItemId)
      )

    ingredientItems.push(currentItem)

    if (typeof currentItem === 'string') allItemIds.add(currentItem)
    else currentItem.forEach((id) => allItemIds.add(id))
  }

  // Result
  const itemId = data.result.id

  const recipeData: ShapelessRecipe = {
    type: 'shapeless',
    count: data.result.count ?? DEFAULT_ITEM_COUNT,
    recipe: {
      items: ingredientItems,
    },
  }

  return { itemId, allItemIds, recipeData }
}

await processRawRecipeData()
