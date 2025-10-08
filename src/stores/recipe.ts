import type { ItemId } from '@shared/types/minecraft'
import type { RecipeFileData } from '@shared/types/recipe'
import { getRecipeData } from '@/utils/recipe'
import { defineStore } from 'pinia'

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    itemId: null as null | ItemId,
    recipeData: null as null | RecipeFileData,
  }),
  actions: {
    async setItemId(newItemId: null | ItemId) {
      if (newItemId === null) {
        this.itemId = null
        this.recipeData = null
        return
      }

      const recipeData = await getRecipeData(newItemId)

      this.itemId = newItemId
      this.recipeData = recipeData
    },
  },
})
