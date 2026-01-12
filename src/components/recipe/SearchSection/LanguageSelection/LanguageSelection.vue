<script setup lang="ts">
import { useSearchStore } from '@/stores/search'
import languageList from '@/assets/data/language-list.json'
import { computed } from 'vue'

const searchStore = useSearchStore()

const currentLanguageId = computed({
  get: () => searchStore.languageId,
  set: (value) => searchStore.setLanguage(value),
})

// @todo add design
// @todo localstorage to make the language section persist
</script>

<template>
  <select v-model="currentLanguageId">
    <option
      v-for="languageData in languageList"
      :key="languageData.languageId"
      :value="languageData.languageId"
    >
      {{ languageData.languageName }}
    </option>
  </select>
</template>
