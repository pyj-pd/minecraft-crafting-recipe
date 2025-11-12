<script setup lang="ts">
import TextInput from '@/components/common/TextInput.vue'
import SearchResult from './SearchResultList.vue'
import { useTemplateRef } from 'vue'

const model = defineModel<string>()

const input = useTemplateRef('text-input')

const focusText = (): void => input.value?.inputRef?.focus()

defineExpose({ focusText })
</script>

<template>
  <div :class="$style['search-text-input-container']">
    <TextInput
      ref="text-input"
      v-model="model"
      placeholder="Search for items"
      :class="$style.input"
      type="search"
    />
    <SearchResult :class="$style['search-result']" />
  </div>
</template>

<style lang="scss" module>
.search-text-input-container {
  position: relative;

  display: flex;
  width: 100%;

  &:not(:focus-within) {
    .search-result {
      display: none;
    }
  }
}

.input {
  width: 100%;
}
</style>
