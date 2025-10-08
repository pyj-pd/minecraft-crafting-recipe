import { type ItemId } from '@shared/types/minecraft'
import { RecipeFileData } from '@shared/types/recipe'
import {
  DATA_FILE_EXTENSION,
  RECIPE_DATA_FILE_URL,
} from '@shared/constants/path'
import { getPureItemName } from '@shared/utils/string'

export async function getRecipeData(itemId: ItemId) {
  const pureItemId = getPureItemName(itemId)
  const response = await fetch(
    `${RECIPE_DATA_FILE_URL}${pureItemId}${DATA_FILE_EXTENSION}`
  )
  const data = RecipeFileData.parse(await response.json())

  return data
}
