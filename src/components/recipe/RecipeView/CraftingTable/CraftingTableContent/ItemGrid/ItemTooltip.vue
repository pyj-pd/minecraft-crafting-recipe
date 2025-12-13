<script setup lang="ts">
defineProps<{
  id: string
}>()

defineSlots()
</script>

<template>
  <div :class="$style['tooltip-container']">
    <div
      :id="$props.id"
      role="tooltip"
      :class="$style.tooltip"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;
@use '@/styles/mixin' as mixin;
@use '@/styles/palette' as palette;

// Tooltips should have absolute sizes
.tooltip-container {
  position: absolute;
  transform: translateY(-100%);
  top: 0;
  left: 0;
  z-index: 10;

  display: none;

  box-shadow: value.$slight-shadow;
}

.tooltip {
  display: flex;
  justify-content: center;
  align-items: center;

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
</style>
