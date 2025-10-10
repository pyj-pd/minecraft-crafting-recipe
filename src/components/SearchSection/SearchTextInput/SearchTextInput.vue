<script setup lang="ts">
import TextInput from '@/components/common/TextInput.vue'
import SearchResult from './SearchResult.vue'
</script>

<template>
  <div :class="$style['search-text-input-container']">
    <TextInput
      placeholder="Search for items"
      :class="$style.input"
    />
    <SearchResult />
  </div>
</template>

<style lang="scss" module>
.search-text-input-container {
  position: relative;

  display: flex;
  width: 100%;
}

.input {
  width: 100%;
}
</style>
