<script setup lang="ts">
import { useLanguageStore } from '@/stores/language'
import type { ItemId } from '@/types/minecraft'
import { getTranslationsForSearching } from '@/utils/language'
import Fuse from 'fuse.js'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const {translationData} =storeToRefs( useLanguageStore())

const translations = computed(() => getTranslationsForSearching(translationData.value ? [translationData.value] : undefined))

 const fuse = computed(() => new Fuse(translations.value, {
  isCaseSensitive: false,
  keys: ['itemId', 'translations'],
}))


let resultIds = ref<ItemId[]>([])

const onInput = (event:InputEvent) => {
    const query = (event.target as HTMLInputElement).value

    resultIds.value = fuse.value.search(query, {limit:10}).map((result) => result.item.itemId)
}
</script>

<template>
    <input type="search" @input="onInput"></input>
    <ul v-for="itemId in resultIds">
        <li>
            <button>{{ itemId }}</button>
        </li>
    </ul>
</template>