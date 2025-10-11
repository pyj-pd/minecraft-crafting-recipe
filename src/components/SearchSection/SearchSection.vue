<script setup lang="ts">
import { useSearchStore } from '@/stores/search'
import MyButton from '../common/MyButton.vue'
import SearchTextInput from './SearchTextInput/SearchTextInput.vue'
import { useTemplateRef } from 'vue'

let searchRawQuery = ''

const { searchItem } = useSearchStore()

const searchTextInputRef = useTemplateRef('text-input')

const onClickSearch = (): void => {
  searchItem(searchRawQuery)
  searchTextInputRef.value?.focusText()
}
</script>

<template>
  <section :class="$style['search-section']">
    <h1 :class="$style.title">Minecraft Crafting Recipe</h1>
    <form
      :class="$style['input-container']"
      @submit.prevent="onClickSearch"
    >
      <SearchTextInput
        ref="text-input"
        v-model="searchRawQuery"
      />
      <MyButton type="submit">Search</MyButton>
    </form>
  </section>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;

.search-section {
  display: flex;
  gap: 30px;
  flex-direction: column;
  align-items: center;

  width: 100%;
}

.title {
  font-size: value.$main-title;
  font-weight: value.$bold-weight;

  text-align: center;
}

.input-container {
  display: flex;
  gap: 10px;

  width: 100%;
  max-width: 600px;
}
</style>
