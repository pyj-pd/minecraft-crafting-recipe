<script setup lang="ts">
import languageList from '@/assets/data/language-list.json'

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
