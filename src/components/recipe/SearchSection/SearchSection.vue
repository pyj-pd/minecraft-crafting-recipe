<script setup lang="ts">
import SearchTextInput from './SearchTextInput/SearchTextInput.vue'

let searchRawQuery = ''
</script>

<template>
  <section :class="$style['search-section']">
    <a
      href="/"
      :class="$style['title-link']"
    >
      <h1 :class="$style.title">Minecraft Crafting Recipe</h1>
    </a>
    <form
      :class="$style['input-container']"
      @submit.prevent
    >
      <SearchTextInput
        ref="text-input"
        v-model="searchRawQuery"
      />
    </form>
  </section>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;

.title-link {
  color: currentColor;
  text-decoration: none;
}

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

@media screen and (max-width: value.$small-screen-width) {
  .search-button {
    display: none;
  }
}
</style>
