import { minecraftPrefix, type ItemId } from '@/types/minecraft'
import { RecipeFileData } from '@/types/recipe'
import {
  DATA_FILE_EXTENSION,
  RECIPE_DATA_FILE_URL,
} from '@shared/constants/path'

export async function getRecipeData(itemId: ItemId) {
  const pureItemId = itemId.replace(minecraftPrefix, '') // @todo
  const response = await fetch(
    `${RECIPE_DATA_FILE_URL}${pureItemId}${DATA_FILE_EXTENSION}`
  )
  const data = RecipeFileData.parse(await response.json())

  return data
}
