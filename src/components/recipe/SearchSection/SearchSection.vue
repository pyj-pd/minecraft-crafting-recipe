<script setup lang="ts">
import { initRecipeHashHandler } from '@/stores/recipe'
import SearchTextInput from './SearchTextInput/SearchTextInput.vue'
import { minecraftVersion } from '@shared/constants/minecraft'
import { ref } from 'vue'

const searchRawQuery = ref()

const resetSearchQuery = (): void => {
  searchRawQuery.value = ''
}

initRecipeHashHandler()
</script>

<template>
  <section :class="$style['search-section']">
    <div :class="$style['title-container']">
      <span :class="$style.version">{{ minecraftVersion }}</span>
      <a
        href="/#"
        :class="$style.title"
        @click="resetSearchQuery"
      >
        <h1>Minecraft Crafting Recipe</h1>
      </a>
    </div>
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
@use '@/assets/styles/value' as value;
@use '@/assets/styles/palette' as palette;

.search-section {
  display: flex;
  gap: 30px;
  flex-direction: column;
  align-items: center;

  width: 100%;
}

// Title
.title-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.version {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 3px 5px;
  border: solid value.$border-width-normal palette.$dark-gray-4;

  background-color: palette.$dark-gray-1;

  font-size: 13px;
  font-weight: value.$bold-weight;
  letter-spacing: -0.02em;
}

.title {
  color: currentColor;
  text-decoration: none;

  > h1 {
    font-size: value.$main-title;
    font-weight: value.$bold-weight;

    text-align: center;
  }
}

// Input
.input-container {
  display: flex;
  gap: 10px;

  width: 100%;
  max-width: value.$small-screen-width;
}
</style>
