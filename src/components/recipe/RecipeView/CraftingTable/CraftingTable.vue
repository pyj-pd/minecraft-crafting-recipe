<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import CraftingTableBackground from './CraftingTableBackground.vue'
import CraftingTableContent from './CraftingTableContent/CraftingTableContent.vue'
import { initImageAnimationTimer } from '@/stores/image-animation'

const tableWidth = ref<string>()
const tableRef = useTemplateRef('table-ref')

const tableResizeObserver = new ResizeObserver((entries) => {
  const width = entries[0]?.contentRect.width

  if (typeof width === 'number') tableWidth.value = `${width}px`
})

onMounted(() => {
  if (tableRef.value) tableResizeObserver.observe(tableRef.value)
})

onBeforeUnmount(() => {
  tableResizeObserver.disconnect()
})

initImageAnimationTimer()
</script>

<template>
  <div
    ref="table-ref"
    :class="$style['crafting-table']"
  >
    <CraftingTableBackground :class="$style['crafting-table-background-svg']" />
    <div :class="$style['table-grid-container']">
      <CraftingTableContent />
    </div>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;
@use '@/styles/palette' as palette;

.crafting-table {
  --table-width: v-bind(tableWidth);

  position: relative;

  display: flex;

  width: 100%;

  border: solid value.$border-width-normal palette.$black;

  overflow: hidden;
}

.crafting-table-background-svg {
  width: 100%;
}

.table-grid-container {
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
}
</style>
