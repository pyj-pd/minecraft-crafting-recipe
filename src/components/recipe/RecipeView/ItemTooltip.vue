<script setup lang="ts">
defineProps<{
  id: string
}>()

defineSlots()
</script>

<template>
  <div
    :id="$props.id"
    role="tooltip"
  >
    <slot />
  </div>
</template>

<style lang="scss" module>
.tooltip {
  display: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}
</style>
