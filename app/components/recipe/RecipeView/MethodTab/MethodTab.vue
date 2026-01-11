<script setup lang="ts">
import { useRecipeStore } from '@/stores/recipe'
import { storeToRefs } from 'pinia'

const recipeStore = useRecipeStore()
const { setRecipeVariantIndex } = recipeStore
const { variantNumbers, recipeVariantIndex } = storeToRefs(recipeStore)

// @todo add drag
</script>

<template>
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
</template>

<style lang="scss" module>
@use '@/assets/styles/value' as value;

.tab-button-container {
  display: flex;
  align-items: end;

  width: 100%;
  height: 60px;

  overflow-x: auto;

  @media screen and (max-width: value.$small-screen-width) {
    height: 53px;
  }
}
</style>
