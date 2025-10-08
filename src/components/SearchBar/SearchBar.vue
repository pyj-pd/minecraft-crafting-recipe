<script setup lang="ts">
import { useSearchStore } from '@/stores/search'
import { useRecipeStore } from '@/stores/recipe'
import type { ItemId } from '@shared/types/minecraft'
import { ref } from 'vue'

const searchStore = useSearchStore()
const { setLanguage, searchItem } = searchStore

const { setItemId } = useRecipeStore()

let resultIds = ref<ItemId[]>([])

const onInput = (event: InputEvent) => {
  const query = (event.target as HTMLInputElement).value

  resultIds.value = searchItem(query)
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
