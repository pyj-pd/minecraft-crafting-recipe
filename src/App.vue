<script setup lang="ts">
import MyFooter from './components/common/MyFooter.vue'
import RecipeView from './components/recipe/RecipeView/RecipeView.vue'
import SearchSection from './components/recipe/SearchSection/SearchSection.vue'
import TopHeader from './components/recipe/TopHeader/TopHeader.vue'
import { initMetaTags } from './composables/initMetaTags'
import { initSearchStore } from './stores/search'

initMetaTags()
initSearchStore()
</script>

<template>
  <TopHeader />
  <main :class="$style['main-wrapper']">
    <SearchSection />
    <RecipeView />
    <MyFooter />
  </main>
</template>

<style lang="scss" module>
@use '@/assets/styles/value' as value;

.main-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 55px;

  padding: value.$safe-padding;
}
</style>
