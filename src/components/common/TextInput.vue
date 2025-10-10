<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'

/* @vue-ignore */
interface TextInputProps extends InputHTMLAttributes {
  type?: 'text' | 'search'
}

withDefaults(defineProps<TextInputProps>(), {
  type: 'text',
})
</script>

<template>
  <input :type="$props.type" />
</template>

<style lang="scss" scoped>
@use '@/styles/value' as value;
@use '@/styles/palette' as palette;

input {
  padding: value.$text-input-padding;

  background-color: palette.$dark-gray-3;
  color: palette.$text-color;

  border: solid value.$border-width-normal palette.$light-gray;
  box-shadow: inset 0 value.$inset-shadow-offset 0 0 palette.$dark-gray-2;

  font-size: value.$button-font-size;

  &::placeholder {
    color: palette.$gray-1;
  }
}
</style>
