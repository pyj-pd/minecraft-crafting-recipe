<script setup lang="ts">
const tableWidth = ref<string>()
const tableRef = useTemplateRef('table-ref')

// Loading handling
const { isItemRecipeLoading } = storeToRefs(useRecipeStore())

const LOADING_VISIBLE_DEBOUNCE_MS = 200 // Prevent loading overlay from 'flickering'
let loadingVisibleTimeout: ReturnType<typeof setTimeout> | null = null

const isLoadingOverlayVisible = ref<boolean>(false)

watch(
  isItemRecipeLoading,
  () => {
    if (loadingVisibleTimeout !== null) clearTimeout(loadingVisibleTimeout)

    if (isItemRecipeLoading.value) {
      // Loading started
      loadingVisibleTimeout = setTimeout(() => {
        isLoadingOverlayVisible.value = true
      }, LOADING_VISIBLE_DEBOUNCE_MS)
    } else {
      // Loading complete
      isLoadingOverlayVisible.value = false
      return
    }
  },
  { immediate: true }
)

let tableResizeObserver: ResizeObserver | null = null

onMounted(() => {
  tableResizeObserver = new ResizeObserver((entries) => {
    const width = entries[0]?.contentRect.width

    if (typeof width === 'number') tableWidth.value = `${width}px`
  })

  if (tableRef.value) tableResizeObserver.observe(tableRef.value)
})

onBeforeUnmount(() => {
  tableResizeObserver?.disconnect()
})

initImageAnimationTimer()
</script>

<template>
  <div
    ref="table-ref"
    :class="$style['crafting-table']"
  >
    <LoadingOverlay v-if="isLoadingOverlayVisible" />
    <CraftingTableBackground :class="$style['crafting-table-background-svg']" />
    <div :class="$style['table-grid-container']">
      <CraftingTableContent />
    </div>
  </div>
</template>

<style lang="scss" module>
@use '@/assets/styles/value' as value;
@use '@/assets/styles/palette' as palette;

.crafting-table {
  --table-width: v-bind(tableWidth); // For width-relative sizes

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
