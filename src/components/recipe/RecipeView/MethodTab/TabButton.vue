<script setup lang="ts">
import MyButton, { type MyButtonProps } from '@/components/common/MyButton.vue'

type TabButtonProps = MyButtonProps & {
  isSelected?: boolean
}

defineSlots()

withDefaults(defineProps<TabButtonProps>(), {
  type: 'button',
})
</script>

<template>
  <MyButton
    :class="[$style['tab-button'], $props.isSelected && $style['selected']]"
    :aria-selected="$props.isSelected"
    ><slot
  /></MyButton>
</template>

<style lang="scss" module>
@use '@/assets/styles/value' as value;
@use '@/assets/styles/palette' as palette;
@use '@/assets/styles/mixin' as mixin;

.tab-button {
  display: flex;
  align-items: center;

  border-bottom: none;

  height: 100%;

  white-space: nowrap;

  &.selected {
    @include mixin.button-color-style(
      $shadow-color-bright: transparent,
      $shadow-color-dark: transparent
    );

    height: 85%;
  }
  &:not(.selected) {
    @include mixin.gray-button-color-style;
  }

  @media screen and (max-width: value.$small-screen-width) {
    padding: value.$small-button-padding;

    font-size: value.$small-button-font-size;
  }
}
</style>
