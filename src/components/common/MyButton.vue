<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue'

type MyButtonProps = /* @vue-ignore */ ButtonHTMLAttributes

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

  background-color: palette.$green-2;
  color: palette.$text-color;

  box-shadow: inset 0 value.$button-inset-shadow-offset 0 0 palette.$green-3,
    inset 0 (-1 * value.$button-inset-shadow-offset) 0 0 palette.$green-1;

  font-size: value.$button-font-size;
  font-weight: value.$button-font-weight;

  cursor: pointer;

  border: solid value.$border-width-normal palette.$black;

  @include mixin.hover-animation($hovered-background-color: palette.$green-1);
}
</style>
