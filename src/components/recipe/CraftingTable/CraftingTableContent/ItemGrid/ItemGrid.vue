<script setup lang="ts">
import { useRecipeStore } from '@/stores/recipe'
import ItemImage from './ItemImage.vue'
import type { ItemId, PossibleItem } from '@shared/types/minecraft'

type ItemGridProps = {
  grid: (PossibleItem | null)[][]
  size?: 'normal' | 'large'
}

withDefaults(defineProps<ItemGridProps>(), {
  size: 'normal',
})

const { setItemId } = useRecipeStore()
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
        <!-- @todo add animation pause button -->
        <!-- @todo fix this  -->
        <!-- @todo add tooltip -->
        <button
          v-if="column !== null"
          :class="$style['item-button']"
          @click="() => setItemId(typeof column === 'string' ? column : (column[0] as ItemId))"
        >
          <ItemImage :item-data="column" />
        </button>
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

$item-image-width: calc($item-original-width * 0.73);

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

.item-button {
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  border: none;
  margin: 0;
  padding: 0;

  cursor: pointer;

  background: none;

  img {
    display: block;
    width: $item-image-width;
    height: $item-image-width;
  }

  &:hover,
  &:focus-visible {
    background-color: rgba(palette.$light-gray, 0.1);
  }
}
</style>
