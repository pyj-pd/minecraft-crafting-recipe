<script setup lang="ts">
import LanguageSelection from './LanguageSelection/LanguageSelection.vue'
</script>

<template>
  <header :class="$style.header">
    <LanguageSelection />
  </header>
</template>

<style lang="scss" module>
@use '@/assets/styles/value' as value;

.header {
  position: relative;

  display: flex;

  width: 100%;

  padding: value.$safe-padding;
}
</style>
