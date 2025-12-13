<script setup lang="ts">
import { REACTANT_ROW_NUMBER } from '@shared/constants/minecraft'
import ItemImage from './ItemImage.vue'
import type { PossibleItem } from '@shared/types/minecraft'

type ItemGridProps = {
  grid: (PossibleItem | null)[][]
  size?: 'normal' | 'large'
  align?: 'left' | 'right'
}

withDefaults(defineProps<ItemGridProps>(), {
  size: 'normal',
  align: 'left',
})
</script>

<template>
  <div
    :class="[
      $style['table-container'],
      $props.size === 'large' && $style.large,
    ]"
  >
    <div
      v-for="(row, rowIndex) in $props.grid"
      :key="rowIndex"
      :class="$style.row"
    >
      <div
        v-for="(column, columnIndex) in row"
        :key="columnIndex"
        :class="$style.item"
      >
        <!-- @todo change to URL based navigation -->
        <ItemImage
          v-if="column !== null"
          :item-data="column"
          :index="rowIndex * REACTANT_ROW_NUMBER + columnIndex"
          :align="$props.align"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;
@use '@/styles/palette' as palette;

$table-border-width: calc(var(--table-width) * 0.0025);

$item-original-width: calc(var(--table-width) * 0.09);
$item-large-width: calc($item-original-width * 1.15);

.table-container {
  display: flex;
  gap: $table-border-width;
  flex-direction: column;

  padding: $table-border-width;

  background-color: palette.$black;
}

.row {
  display: flex;
  gap: $table-border-width;
}

.item {
  position: relative;

  display: flex;

  width: $item-original-width;
  aspect-ratio: 1 / 1;

  .large & {
    width: $item-large-width;
  }

  background-color: palette.$dark-gray-2; // Border color

  &::before {
    content: '';

    position: absolute;
    z-index: 0;
    bottom: 0;
    right: 0;

    width: 96%;
    aspect-ratio: 1 / 1;

    background-color: palette.$dark-gray-1; // Real background color
  }
}
</style>
