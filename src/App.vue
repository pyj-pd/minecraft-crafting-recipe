<script setup lang="ts">
import RecipeView from './components/recipe/RecipeView/RecipeView.vue'
import SearchSection from './components/recipe/SearchSection/SearchSection.vue'
</script>

<template>
  <main :class="$style['main-wrapper']">
    <SearchSection />
    <RecipeView />
  </main>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;

.main-wrapper {
  display: flex;
  flex-direction: column;
  gap: value.$section-gap;
}
</style>
