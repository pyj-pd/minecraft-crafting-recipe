import type { ItemId } from '@/types/minecraft'
import type { RecipeFileData } from '@/types/recipe'
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
    },
  },
})
