<script setup lang="ts">
withDefaults(
  defineProps<{
    elementId: string
    align?: 'left' | 'right'

    itemName: string
    itemId: string
    doesItemRecipeExists?: boolean
  }>(),
  { align: 'left', doesItemRecipeExists: true }
)
</script>

<template>
  <div
    :class="[
      $style['tooltip-container'],
      $props.align === 'right' && $style.right,
    ]"
  >
    <div
      :id="$props.elementId"
      role="tooltip"
      :class="$style.tooltip"
    >
      <div :class="$style['item-name-container']">
        <span>
          {{ $props.itemName }}
        </span>
        <span
          v-if="!$props.doesItemRecipeExists"
          :class="$style['doesnt-exist']"
        >
          (No recipe)
        </span>
      </div>
      <span :class="$style['item-id']">{{ $props.itemId }}</span>
    </div>
  </div>
</template>

<style lang="scss" module>
@use '@/assets/styles/value' as value;
@use '@/assets/styles/mixin' as mixin;
@use '@/assets/styles/palette' as palette;

// Tooltips should have absolute sizes
.tooltip-container {
  position: absolute;
  transform: translateY(-100%);
  top: 0;
  z-index: 10;

  &:not(.right) {
    left: 0;
  }
  &.right {
    right: 0;
  }

  display: none;

  box-shadow: value.$slight-shadow;
}

.tooltip {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 2px;

  white-space: nowrap;

  padding: value.$tooltip-padding;

  font-size: value.$tooltip-font-size;
  font-weight: value.$tooltip-font-weight;

  @include mixin.button-color-style(
    $background-color: palette.$dark-gray-0,
    $color: palette.$text-color,

    $shadow-width: value.$button-inset-shadow-offset-x-small,

    $shadow-color-bright: palette.$dark-gray-2,
    $shadow-color-dark: palette.$black,

    $border-color: palette.$purple,

    $hover-animation: false
  );
}

.item-name-container {
  display: flex;
  gap: 4px;
  align-items: flex-end;

  .doesnt-exist {
    font-size: value.$tooltip-font-size-no-recipe;
    color: palette.$red;
  }
}

.item-id {
  color: palette.$light-gray;

  font-size: value.$tooltip-font-size-id;
}
</style>
