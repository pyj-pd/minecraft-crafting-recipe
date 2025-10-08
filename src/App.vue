<script setup lang="ts">
import { storeToRefs } from 'pinia'
import SearchBar from './components/SearchBar/SearchBar.vue'
import { useRecipeStore } from './stores/recipe'

const { itemId, recipeData } = storeToRefs(useRecipeStore())
</script>

<template>
  <SearchBar />
  <p>{{ itemId }}</p>
  <textarea readonly>{{ JSON.stringify(recipeData, undefined, 2) }}</textarea>
</template>

<style scoped></style>
