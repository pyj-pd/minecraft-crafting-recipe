<script setup lang="ts">
import { useRecipeStore } from '@/stores/recipe'
import type { PossibleItem } from '@shared/types/minecraft'
import { storeToRefs } from 'pinia'
import RightArrowIcon from '../../../common/icons/RightArrowIcon.vue'
import ItemGrid from './ItemGrid/ItemGrid.vue'
import type { CraftingTableReactantGrid } from '@/types/crafting-table'
import {
  REACTANT_ROW_NUMBER,
  REACTANT_COLUMN_NUMBER,
} from '@shared/constants/minecraft'
import { EMPTY_REACTANT_GRID } from '@/constants/crafting-table'
import AnimationPauseButton from '../AnimationPauseButton.vue'

const { currentRecipeData, recipeVariantIndex, itemId } = storeToRefs(
  useRecipeStore()
)

const getReactantItemGrid = (): CraftingTableReactantGrid | null => {
  if (currentRecipeData.value === null) return null

  const recipe = currentRecipeData.value.recipe

  if ('grid' in recipe) {
    // Shaped recipe
    return recipe.grid
  } else if ('items' in recipe) {
    // Shapeless recipe
    const itemGrid: CraftingTableReactantGrid =
      structuredClone(EMPTY_REACTANT_GRID)

    for (let rowIndex = 0; rowIndex < REACTANT_ROW_NUMBER; rowIndex++) {
      for (
        let columnIndex = 0;
        columnIndex < REACTANT_COLUMN_NUMBER;
        columnIndex++
      ) {
        const itemIndex = rowIndex * REACTANT_ROW_NUMBER + columnIndex

        if (itemIndex + 1 > recipe.items.length) break // All items were iterated

        // @ts-expect-error Array must exist
        itemGrid[rowIndex][columnIndex] = recipe.items[
          itemIndex
        ] as PossibleItem
      }
    }

    return itemGrid
  }

  return null
}
</script>

<template>
  <div :class="$style['table-content-container']">
    <div :class="$style['reactant-grid-container']">
      <AnimationPauseButton :class="$style['pause-button']" />
      <ItemGrid
        :key="`${itemId},${recipeVariantIndex}`"
        :grid="getReactantItemGrid() ?? EMPTY_REACTANT_GRID"
      />
    </div>
    <RightArrowIcon :style="$style.arrow" />
    <ItemGrid
      :key="`${itemId},${recipeVariantIndex}`"
      :grid="[[itemId]]"
      size="large"
    />
  </div>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;
@use '@/styles/palette' as palette;

.table-content-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: calc(var(--table-width) * 0.04);
}

.reactant-grid-container {
  position: relative;
  display: flex;
  justify-content: center;

  .pause-button {
    position: absolute;
    top: calc(var(--table-width) * -0.065);
    z-index: 1;
  }
}

.arrow {
  width: calc(var(--table-width) * 0.05);

  color: palette.$dark-gray-5;
}
</style>
