<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue'

export type MyButtonProps = /* @vue-ignore */ ButtonHTMLAttributes

defineSlots()

withDefaults(defineProps<MyButtonProps>(), {
  type: 'button',
})
</script>

<template>
  <button><slot /></button>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;
@use '@/styles/palette' as palette;
@use '@/styles/mixin' as mixin;

button {
  padding: value.$button-padding;

  font-size: value.$button-font-size;
  font-weight: value.$button-font-weight;

  cursor: pointer;

  @include mixin.button-color-style;
}
</style>
