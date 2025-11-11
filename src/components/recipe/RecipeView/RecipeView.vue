<script setup lang="ts">
import CraftingTable from './CraftingTable.vue'
</script>

<template>
  <section :class="$style['recipe-view-section']">
    <CraftingTable />
  </section>
</template>

<style lang="scss" module>
.recipe-view-section {
  display: flex;
  justify-content: center;

  width: 100%;
}
</style>
