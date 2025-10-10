<script setup lang="ts">
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'

const searchStore = useSearchStore()
const { searchResults } = storeToRefs(searchStore)
</script>

<template>
  <div :class="$style['search-result-container']">
    <template v-for="searchResult of searchResults">
      {{ searchResult }}
    </template>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;
@use '@/styles/palette' as palette;

.search-result-container {
  position: absolute;
  top: 100%;
  left: 0;

  display: flex;

  border: solid value.$border-width-normal palette.$black;

  width: 100%;
}
</style>
