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
    ><slot
  /></MyButton>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;
@use '@/styles/palette' as palette;
@use '@/styles/mixin' as mixin;

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
    @include mixin.button-color-style(
      $background-color: palette.$dark-gray-4,
      $active-background-color: palette.$dark-gray-2,
      $color: palette.$text-color,

      $shadow-color-bright: palette.$dark-gray-5,
      $shadow-color-dark: palette.$dark-gray-2
    );
  }

  @media screen and (max-width: value.$small-screen-width) {
    padding: value.$small-button-padding;

    font-size: value.$small-button-font-size;
  }
}
</style>
