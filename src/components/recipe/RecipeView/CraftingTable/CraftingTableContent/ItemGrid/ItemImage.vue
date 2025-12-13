<script setup lang="ts">
import { useAnimationTimerStore } from '@/stores/image-animation'
import { useRecipeStore } from '@/stores/recipe'
import { getItemImageUrl } from '@/utils/image'
import type { ItemId, PossibleItem } from '@shared/types/minecraft'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import ItemTooltip from './ItemTooltip.vue'
import { useSearchStore } from '@/stores/search'

type ItemImageProps = {
  itemData: PossibleItem
  index: number
}

const { itemData, index } = defineProps<ItemImageProps>()

const { setItemId } = useRecipeStore()
const { translationData } = storeToRefs(useSearchStore())

const itemIndex = ref<number>(0)

const itemId = computed<ItemId>(() => {
  if (typeof itemData === 'string') return itemData
  else {
    return itemData[itemIndex.value] as ItemId
  }
})

const imageUrl = computed(() => getItemImageUrl(itemId.value))

// Handle item tags
const { imageTick } = storeToRefs(useAnimationTimerStore())

watch(imageTick, () => {
  let newItemIndex = itemIndex.value + 1
  if (newItemIndex >= (itemData?.length ?? 0)) newItemIndex = 0

  itemIndex.value = newItemIndex
})

// Tooltip
const tooltipId = computed(() => `item-${index}`)
</script>

<template>
  <div :class="$style.container">
    <ItemTooltip
      :id="tooltipId"
      :class="$style.tooltip"
    >
      {{ translationData?.translations[itemId] }}
    </ItemTooltip>
    <button
      :aria-labelledby="tooltipId"
      :class="$style['item-button']"
      @click="() => setItemId(itemId)"
    >
      <img
        v-if="imageUrl !== null"
        :src="imageUrl"
      />
    </button>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/palette' as palette;

$item-image-width: calc(var(--table-width) * 0.065);

.container {
  position: relative;

  display: flex;
  width: 100%;
  height: 100%;

  &:has(:hover),
  &:has(:focus-visible) {
    .tooltip {
      display: flex;
    }
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
    aspect-ratio: 1 / 1;
  }

  &:hover,
  &:focus-visible {
    background-color: rgba(palette.$light-gray, 0.1);
  }
}
</style>
