<script setup lang="ts">
import { initMetaTags } from '@/composables/initMetaTags'

initMetaTags()
</script>

<template>
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
  gap: value.$section-gap;
}
</style>
