import type { ItemId } from '@shared/types/minecraft'
import type { RecipeData, RecipeFileData } from '@shared/types/recipe'
import { getRecipeData } from '@/utils/recipe'
import { defineStore } from 'pinia'

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    itemId: null as null | ItemId,

    recipeFileData: null as null | RecipeFileData,
    recipeVariantIndex: null as null | number,
  }),
  actions: {
    /** @todo add abort controller */
    async setItemId(newItemId: null | ItemId): Promise<void> {
      if (newItemId === null) {
        this.itemId = null
        this.recipeFileData = null
        this.recipeVariantIndex = null
        return
      }

      const recipeData = await getRecipeData(newItemId)

      this.itemId = newItemId
      this.recipeFileData = recipeData
      this.recipeVariantIndex = 0
    },
  },
  getters: {
    currentRecipeData(): RecipeData | null {
      if (this.recipeFileData === null || this.recipeVariantIndex === null)
        return null

      return this.recipeFileData[this.recipeVariantIndex] as RecipeData
    },
  },
})
