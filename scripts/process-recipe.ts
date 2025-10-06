import { readdir, readFile, writeFile, mkdir, access } from 'fs/promises'
import path from 'path'
import {
  RawRecipeData,
  RawShapedRecipeData,
  RawShapelessRecipeData,
  RecipeFileData,
  RecipeDataTagData,
  ShapedRecipe,
  ShapedRecipeGrid,
  ShapelessRecipe,
} from '../src/types/recipe'
import * as z from 'zod'
import {
  DATA_FILE_EXTENSION,
  getPureItemName,
  parseRawFile,
  PROCESSED_RECIPE_DATA_FOLDER,
  RAW_RECIPE_DATA_FOLDER,
} from './common'
import { getTagData } from './process-tags'
import { ITEM_TAG_PREFIX, ItemId, ItemTag } from '../src/types/minecraft'

// Recipe
const DEFAULT_ITEM_COUNT = 1

// Tags
const tagData = await getTagData()

/**
 * @todo handle duplicated recipes(such as `black_glass_pane`)
 * @see https://minecraft.wiki/w/Recipe
 */
export async function processRawRecipeData() {
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

  for (const fileInfo of rawRecipeFileList) {
    if (!fileInfo.isFile()) continue // Only parse files

    const fileName = fileInfo.name
    const filePath = path.join(RAW_RECIPE_DATA_FOLDER, fileName)
    const fileContent = await readFile(filePath, { encoding: 'utf-8' })

    const rawRecipeData = await parseRawFile(fileContent, RawRecipeData)

    if (rawRecipeData === null) continue // Invalid file format

    let recipeData

    switch (rawRecipeData.type) {
      case 'minecraft:crafting_shaped':
        recipeData = await processShapedRecipeData(rawRecipeData)
        break

      case 'minecraft:crafting_shapeless':
        recipeData = await processShapelessRecipeData(rawRecipeData)
        break

      default:
        break
    }

    if (typeof recipeData !== 'object') continue // The data was not parsed

    const { itemId } = recipeData

    if (!(itemId in fileData)) {
      processedItems++
      fileData[itemId] = []
    }
    fileData[itemId].push(recipeData)

    processedRecipes++
  }

  // Write to files
  for (const [itemId, recipeFileData] of Object.entries(fileData)) {
    const itemName = getPureItemName(itemId as ItemId)

    const processedFilePath = path.join(
      PROCESSED_RECIPE_DATA_FOLDER,
      itemName + DATA_FILE_EXTENSION
    )
    await writeFile(
      processedFilePath,
      JSON.stringify(recipeFileData, undefined, 2)
    )

    processedFiles++
  }

  console.log(`Processed files: ${processedFiles}`)
  console.log(`Processed items: ${processedItems}`)
  console.log(`Processed recipes: ${processedRecipes}`)
}

/**
 * Processes raw shaped recipe data.
 * @param data Raw recipe data
 * @returns Processed shaped recipe data
 * @see https://minecraft.wiki/w/Recipe#crafting_shaped
 */
async function processShapedRecipeData(data: RawShapedRecipeData) {
  const recipe = {
    grid: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ] as z.infer<typeof ShapedRecipeGrid>,
  }

  const tags: RecipeDataTagData = {}

  for (
    let patternIndex = 0;
    patternIndex < data.pattern.length;
    patternIndex++
  ) {
    const rawPatternRow = data.pattern[patternIndex]

    for (let keyIndex = 0; keyIndex < rawPatternRow.length; keyIndex++) {
      const key = rawPatternRow[keyIndex]

      if (!(key in data.key)) continue

      const id = data.key[key]
      recipe.grid[patternIndex][keyIndex] = id

      if (id.startsWith(ITEM_TAG_PREFIX) && !(id in tags)) {
        tags[id as ItemTag] = tagData[id as ItemTag]
      }
    }
  }

  const processedData: ShapedRecipe = {
    type: 'shaped',
    itemId: data.result.id,
    count: data.result.count ?? DEFAULT_ITEM_COUNT,
    recipe,
    tags,
  }

  return processedData
}

/**
 * Processes raw shapeless recipe data.
 * @param data Raw recipe data
 * @returns Processed shapeless recipe data
 * @see https://minecraft.wiki/w/Recipe#crafting_shapeless
 */
async function processShapelessRecipeData(data: RawShapelessRecipeData) {
  // Get tag list
  const tags: RecipeDataTagData = {}

  for (const id of data.ingredients) {
    if (id.startsWith(ITEM_TAG_PREFIX) && !(id in tags))
      tags[id as ItemTag] = tagData[id as ItemTag]
  }

  // Result
  const processedData: ShapelessRecipe = {
    type: 'shapeless',
    itemId: data.result.id,
    count: data.result.count ?? DEFAULT_ITEM_COUNT,
    recipe: {
      items: data.ingredients,
    },
    tags,
  }
  return processedData
}

await processRawRecipeData()
