import { ItemId } from '@shared/types/minecraft'
import type { RecipeData, RecipeFileData } from '@shared/types/recipe'
import { getRecipeData } from '@/utils/recipe'
import { defineStore } from 'pinia'
import { DEFAULT_RECIPE_VARIANT_INDEX } from '@/constants/default'
import { onBeforeUnmount, onMounted } from 'vue'

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    itemId: null as null | ItemId,

    recipeFileData: null as null | RecipeFileData,
    recipeVariantIndex: null as null | number,

    _abortController: null as null | AbortController,
  }),
  actions: {
    async setItemId(newItemId: null | ItemId): Promise<void> {
      window.location.hash = newItemId ? `#${newItemId}` : ''
    },
    async _setItemRecipeData(itemId: null | ItemId): Promise<void> {
      if (this._abortController !== null) this._abortController.abort() // Abort previous request

      if (itemId === null) {
        // Reset item id data
        this.itemId = null
        this.recipeFileData = null
        this.recipeVariantIndex = null
        return
      }

      try {
        this._abortController = new AbortController()

        const recipeData = await getRecipeData(
          itemId,
          this._abortController.signal
        )

        this.itemId = itemId
        this.recipeFileData = recipeData
        this.recipeVariantIndex = DEFAULT_RECIPE_VARIANT_INDEX
      } catch {
        // No recipe exist
      }
    },
    /**
     * Sets recipe varaint index.
     * @param newIndex New index to set to.
     * @returns `false` if failed due to unloaded recipe data, `true` if successful.
     */
    setRecipeVariantIndex(newIndex: number): boolean {
      if (this.variantNumbers === null || this.variantNumbers < 1) return false // No variants or recipe not loaded

      this.recipeVariantIndex = Math.min(
        Math.max(newIndex, DEFAULT_RECIPE_VARIANT_INDEX),
        this.variantNumbers
      ) // Range of 0 to variant numbers

      return true
    },
  },
  getters: {
    currentRecipeData(): RecipeData | null {
      if (this.recipeFileData === null || this.recipeVariantIndex === null)
        return null

      return this.recipeFileData[this.recipeVariantIndex] as RecipeData
    },
    variantNumbers(): number | null {
      if (this.recipeFileData === null) return null // Not loaded

      return this.recipeFileData.length
    },
  },
})

/**
 * Handles hash URL to match item id data in the store.
 * Should belong to `SearchSection` component.
 */
export const initRecipeHashHandler = (): void => {
  const { _setItemRecipeData } = useRecipeStore()

  const onHashChange = (): void => {
    const { hash } = window.location

    if (hash.length <= 0) {
      // If URL is empty, reset item id
      _setItemRecipeData(null)
      return
    }

    try {
      const hashItemId = ItemId.parse(hash.slice(1)) // Remove '#' from hash

      _setItemRecipeData(hashItemId)
    } catch {
      // Wrong id
    }
  }

  onMounted(() => {
    window.addEventListener('hashchange', onHashChange)
    onHashChange()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('hashchange', onHashChange)
  })
}
