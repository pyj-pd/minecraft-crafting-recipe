import { readdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import {
  RawRecipeData,
  RawShapedRecipeData,
  RawShapelessRecipeData,
} from '../types/recipe/raw'
import {
  ShapedRecipe,
  ShapedRecipeGrid,
  ShapedRecipeItem,
  ShapedRecipeRow,
  ShapelessRecipe,
} from '../types/recipe'
import * as z from 'zod'

// Paths
const RAW_RECIPE_DATA_FOLDER = path.resolve(
  import.meta.dirname,
  '../data/raw_recipes/'
)
const PROCESSED_RECIPE_DATA_FOLDER = path.resolve(
  import.meta.dirname,
  '../public/data/recipes/'
)

// Recipe
const DEFAULT_ITEM_COUNT = 1

async function parseRawRecipeDataFile(fileContent: string) {
  try {
    const rawRecipeData = await RawRecipeData.parseAsync(
      JSON.parse(fileContent)
    )

    return rawRecipeData
  } catch {
    return null
  }
}

/**
 * @see https://minecraft.wiki/w/Recipe
 */
export async function processRawRecipeData() {
  const rawRecipeFileList = await readdir(RAW_RECIPE_DATA_FOLDER)

  let processed = 0

  for (const fileName of rawRecipeFileList) {
    const filePath = path.join(RAW_RECIPE_DATA_FOLDER, fileName)
    const fileContent = await readFile(filePath, { encoding: 'utf-8' })

    const rawRecipeData = await parseRawRecipeDataFile(fileContent)

    if (rawRecipeData === null) continue

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

    if (typeof recipeData !== 'object') continue

    const processedFilePath = path.join(PROCESSED_RECIPE_DATA_FOLDER, fileName)
    await writeFile(processedFilePath, JSON.stringify(recipeData))
    processed++
  }

  console.log(
    `Processed ${processed} file${processed > 1 ? 's' : ''} successfully.`
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

  for (
    let patternIndex = 0;
    patternIndex < data.pattern.length;
    patternIndex++
  ) {
    const rawPatternRow = data.pattern[patternIndex]

    for (let keyIndex = 0; keyIndex < rawPatternRow.length; keyIndex++) {
      const key = rawPatternRow[keyIndex]

      if (key in data.key) recipe.grid[patternIndex][keyIndex] = data.key[key]
    }
  }

  const processedData: ShapedRecipe = {
    type: 'shaped',
    itemId: data.result.id,
    count: data.result.count ?? DEFAULT_ITEM_COUNT,
    recipe,
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
  const processedData: ShapelessRecipe = {
    type: 'shapeless',
    itemId: data.result.id,
    count: data.result.count ?? DEFAULT_ITEM_COUNT,
    recipe: {
      items: data.ingredients,
    },
  }

  return processedData
}

await processRawRecipeData()
