<script setup lang="ts">
import { storeToRefs } from 'pinia'
import CraftingTable from './CraftingTable.vue'
import TabButton from './TabButton/TabButton.vue'
import { useRecipeStore } from '@/stores/recipe'

const recipeStore = useRecipeStore()
const { setRecipeVariantIndex } = recipeStore
const { variantNumbers, recipeVariantIndex } = storeToRefs(recipeStore)
</script>

<template>
  <section :class="$style['recipe-view-section']">
    <div :class="$style['tab-button-container']">
      <template v-if="variantNumbers !== null && variantNumbers >= 1">
        <TabButton
          v-for="(num, index) in variantNumbers"
          :key="index"
          :is-selected="index == recipeVariantIndex"
          @click="() => setRecipeVariantIndex(index)"
        >
          Method {{ num }}
        </TabButton>
      </template>
    </div>
    <CraftingTable />
  </section>
</template>

<style lang="scss" module>
.recipe-view-section {
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  max-width: 900px;
}

.tab-button-container {
  display: flex;
  align-items: end;

  width: 100%;
  height: 60px;

  overflow-x: auto;
}
</style>
