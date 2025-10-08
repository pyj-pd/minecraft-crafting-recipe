<script setup lang="ts">
import { useLanguageStore } from '@/stores/language'
import { useRecipeStore } from '@/stores/recipe'
import type { ItemId } from '@/types/minecraft'
import { getTranslationsForSearching, inko } from '@/utils/language'
import Fuse from 'fuse.js'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const languageStore = useLanguageStore()
const { setLanguage } = languageStore
const { translationData } = storeToRefs(languageStore)

const { setItemId } = useRecipeStore()

const translations = computed(() =>
  getTranslationsForSearching(
    translationData.value ? [translationData.value] : undefined
  )
)

/** @todo put this in a store */
const fuse = computed(
  () =>
    new Fuse(translations.value, {
      isCaseSensitive: false,
      keys: ['itemId', 'translations'],
    })
)

let resultIds = ref<ItemId[]>([])

const onInput = (event: InputEvent) => {
  const query = inko.ko2en((event.target as HTMLInputElement).value)

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
  <button @click="() => setLanguage('ko_kr')">한국어로</button>
  <ul v-for="itemId in resultIds">
    <li>
      <button @click="() => setItemId(itemId)">{{ itemId }}</button>
    </li>
  </ul>
</template>
