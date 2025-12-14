<script setup lang="ts">
import { useAnimationTimerStore } from '@/stores/image-animation'
import { useRecipeStore } from '@/stores/recipe'
import { getItemImageUrl } from '@/utils/image'
import type { ItemId, PossibleItem } from '@shared/types/minecraft'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import ItemTooltip from './ItemTooltip.vue'
import { useSearchStore } from '@/stores/search'
import { recipeExists } from '@/utils/language'

type ItemImageProps = {
  itemData: PossibleItem
  index: number
  align?: 'left' | 'right'
}

const { itemData, index, align = 'right' } = defineProps<ItemImageProps>()

const { setItemId } = useRecipeStore()
const { translationData } = storeToRefs(useSearchStore())

const itemIndex = ref<number>(0)

const itemId = computed<ItemId>(() => {
  if (typeof itemData === 'string') return itemData
  else {
    return itemData[itemIndex.value] as ItemId
  }
})

const imageUrls = computed<string[]>(() => {
  let itemIds: ItemId[]

  if (typeof itemData === 'string') itemIds = [itemData]
  else itemIds = [...itemData]

  return itemIds.map((id) => getItemImageUrl(id))
})

const imageUrl = computed<string>(() => {
  return imageUrls.value[itemIndex.value] as string
})

const doesRecipeExist = computed<boolean>(() => recipeExists(itemId.value))

// Handle item tags
const { imageTick } = storeToRefs(useAnimationTimerStore())

watch(
  imageTick,
  () => {
    if (typeof itemData === 'string') return

    let newItemIndex = itemIndex.value + 1
    if (newItemIndex >= itemData.length) newItemIndex = 0

    itemIndex.value = newItemIndex
  },
  { immediate: true }
)

watch(
  imageUrls,
  () => {
    // // Preload images
    // for (const url of imageUrls.value) {
    //   const image = new Image()
    //   image.src = url
    // }
  },
  { immediate: true }
)

// Tooltip
const tooltipId = computed(() => `item-${index}`)
</script>

<template>
  <div :class="$style.container">
    <ItemTooltip
      :id="tooltipId"
      :class="$style.tooltip"
      :align
    >
      {{ translationData?.translations[itemId] }}
    </ItemTooltip>
    <button
      :aria-labelledby="tooltipId"
      :class="[$style['item-button'], !doesRecipeExist && $style['no-recipe']]"
      :aria-disabled="!doesRecipeExist"
      @click="() => doesRecipeExist && setItemId(itemId)"
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

$item-image-width: calc(var(--table-width) * 0.055);

.container {
  position: relative;

  display: flex;
  width: 100%;
  height: 100%;

  &:has(:hover),
  &:has(:focus-visible) {
    .tooltip {
      display: flex;

      animation: tooltip-enter-animation 0.4s both ease-out;
    }
  }
}

@keyframes tooltip-enter-animation {
  0% {
    transform: translateY(-90%);
  }
  100% {
    transform: translateY(-100%);
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

    &.no-recipe {
      background-color: rgba(palette.$red, 0.1);
    }
  }
}
</style>
