<script setup lang="ts">
defineProps<{ count: number }>()

const MINIMUM_COUNT_DISPLAY = 2
</script>

<template>
  <div
    v-if="count >= MINIMUM_COUNT_DISPLAY"
    :class="$style['item-count-container']"
  >
    <span>{{ $props.count }}</span>
    <span :class="$style.outline">{{ $props.count }}</span>
  </div>
</template>

<style lang="scss" module>
@use '@/assets/styles/palette' as palette;

.item-count-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: calc(var(--table-width) * 0.022 * var(--size-multiplier));

  pointer-events: none;

  span {
    color: palette.$white;

    text-align: right;
    font-size: calc(var(--table-width) * 0.023 * var(--size-multiplier));
    font-weight: 600;
    letter-spacing: -5%;
    font-variant-numeric: tabular-nums;

    &.outline {
      position: absolute;
      z-index: -1;

      -webkit-text-stroke: calc(
          var(--table-width) * 0.0025 * var(--size-multiplier)
        )
        palette.$black;
    }
  }
}
</style>
