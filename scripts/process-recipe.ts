import { readdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import {
  RawRecipeData,
  RawShapedRecipeData,
  RawShapelessRecipeData,
  RecipeDataTagData,
  ShapedRecipe,
  ShapedRecipeGrid,
  ShapelessRecipe,
} from '../types/recipe'
import * as z from 'zod'
import { parseRawFile } from './common'
import { getTagData } from './process-tags'
import { ITEM_TAG_PREFIX, ItemTag } from '../types/minecraft'
import { Console } from 'console'

// Paths
const RAW_RECIPE_DATA_FOLDER = path.resolve(
  import.meta.dirname,
  '../data/raw_data/recipe'
)
const PROCESSED_RECIPE_DATA_FOLDER = path.resolve(
  import.meta.dirname,
  '../public/data/recipes/'
)

// Recipe
const DEFAULT_ITEM_COUNT = 1

// Tags
const tagData = await getTagData()

/**
 * @see https://minecraft.wiki/w/Recipe
 */
export async function processRawRecipeData() {
  const rawRecipeFileList = await readdir(RAW_RECIPE_DATA_FOLDER, {
    withFileTypes: true,
  })

  let processed = 0
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

    const processedFilePath = path.join(PROCESSED_RECIPE_DATA_FOLDER, fileName)
    await writeFile(processedFilePath, JSON.stringify(recipeData))
    processed++
  }

  console.log(
    `Processed ${processed} recipe file${
      processed > 1 ? 's' : ''
    } successfully.`
  )
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
