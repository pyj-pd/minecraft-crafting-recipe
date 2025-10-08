<script setup lang="ts">
import { useLanguageStore } from '@/stores/language'
import { useRecipeStore } from '@/stores/recipe'
import type { ItemId } from '@/types/minecraft'
import { getTranslationsForSearching } from '@/utils/language'
import Fuse from 'fuse.js'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const { translationData } = storeToRefs(useLanguageStore())
const { setItemId } = useRecipeStore()

const translations = computed(() =>
  getTranslationsForSearching(
    translationData.value ? [translationData.value] : undefined
  )
)

const fuse = computed(
  () =>
    new Fuse(translations.value, {
      isCaseSensitive: false,
      keys: ['itemId', 'translations'],
    })
)

let resultIds = ref<ItemId[]>([])

const onInput = (event: InputEvent) => {
  const query = (event.target as HTMLInputElement).value

  resultIds.value = fuse.value
    .search(query, { limit: 10 })
    .map((result) => result.item.itemId)
}
</script>

<template>
  <input
    type="search"
    @input="onInput"
  />
  <ul v-for="itemId in resultIds">
    <li>
      <button @click="() => setItemId(itemId)">{{ itemId }}</button>
    </li>
  </ul>
</template>
