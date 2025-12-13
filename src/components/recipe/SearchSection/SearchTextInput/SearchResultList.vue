<script setup lang="ts">
import { useRecipeStore } from '@/stores/recipe'
import { useSearchStore } from '@/stores/search'
import { getItemImageUrl } from '@/utils/image'
import type { ItemId } from '@shared/types/minecraft'
import { storeToRefs } from 'pinia'
import { useTemplateRef, watch } from 'vue'

const searchStore = useSearchStore()
const { translationData } = storeToRefs(searchStore)
const { searchResults } = storeToRefs(searchStore)

const { setItemId } = useRecipeStore()

const listRef = useTemplateRef('list-element')

watch(
  searchResults,
  () => {
    listRef.value?.scrollTo({ top: 0 })
  },
  { immediate: true }
)

const onItemSelect = (itemId: ItemId): void => {
  setItemId(itemId)

  // Unfocus search bar
  const currentActiveElement = document.activeElement as HTMLElement | null
  currentActiveElement?.blur()
}
</script>

<template>
  <div
    v-if="searchResults?.length ?? 0 > 0"
    ref="list-element"
    :class="$style['search-result-container']"
  >
    <ul :class="$style['list-container']">
      <li
        v-for="searchResult of searchResults"
        :key="searchResult"
      >
        <button
          type="button"
          :class="$style['search-result-item']"
          @click="() => onItemSelect(searchResult)"
        >
          <div :class="$style['image-container']">
            <img :src="getItemImageUrl(searchResult)" />
          </div>
          <div :class="$style['info-container']">
            <span :class="$style['item-name']">{{
              translationData?.translations[searchResult]
            }}</span>
            <span :class="$style['item-id']">{{ searchResult }}</span>
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;
@use '@/styles/palette' as palette;
@use '@/styles/mixin' as mixin;

.search-result-container {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;

  display: flex;

  border: solid value.$border-width-normal palette.$black;
  box-shadow: value.$slight-shadow;

  color: palette.$text-color;

  overflow-y: auto;

  width: 100%;
  max-height: 300px;
}

.list-container {
  display: flex;
  flex-direction: column;
  list-style: none;
  align-items: stretch;

  width: 100%;
}

.search-result-item {
  display: flex;
  gap: 10px;
  align-items: center;

  padding: 12px 17px;

  width: 100%;

  cursor: pointer;

  @include mixin.button-color-style(
    $background-color: palette.$dark-gray-1,
    $active-background-color: palette.$dark-gray-0,
    $color: palette.$text-color,

    $shadow-width: value.$button-inset-shadow-offset-small,

    $shadow-color-bright: palette.$dark-gray-2,
    $shadow-color-dark: palette.$dark-gray-0,

    $border-width: null,
    $border-color: null
  );
}

.image-container {
  display: flex;

  height: 30px;
  aspect-ratio: 1 / 1;

  img {
    display: block;

    width: 100%;
    height: 100%;

    object-fit: contain;
    image-rendering: pixelated;
  }
}

.info-container {
  display: flex;
  gap: 3px;
  flex-direction: column;
  align-items: flex-start;

  text-align: left;

  .item-name {
    font-family: 'Instrument Sans';
    font-size: 17px;
    font-weight: value.$bold-weight;
  }

  .item-id {
    color: palette.$dark-gray-5;
    font-size: 12px;
    font-weight: value.$bold-weight;
  }
}
</style>
