<script setup lang="ts">
import { languageList } from '@/constants/language'
import { useSearchStore } from '@/stores/search'
import { computed } from 'vue'

const searchStore = useSearchStore()

const currentLanguageId = computed({
  get: () => searchStore.languageId,
  set: (value) => searchStore.setLanguage(value),
})

// @todo add design
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
