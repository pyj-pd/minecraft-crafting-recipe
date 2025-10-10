<script setup lang="ts">
import MyButton from '../common/MyButton.vue'
import SearchTextInput from './SearchTextInput/SearchTextInput.vue'
</script>

<template>
  <section :class="$style['search-section']">
    <h2 :class="$style.title">Minecraft Crafting Recipe</h2>
    <div :class="$style['input-container']">
      <SearchTextInput />
      <MyButton>Search</MyButton>
    </div>
  </section>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;

.search-section {
  display: flex;
  gap: 23px;
  flex-direction: column;
  align-items: center;

  width: 100%;
}

.title {
  font-size: value.$main-title;
  font-weight: value.$bold-weight;
}

.input-container {
  display: flex;
  gap: 10px;

  width: 100%;
  max-width: 600px;
}
</style>
