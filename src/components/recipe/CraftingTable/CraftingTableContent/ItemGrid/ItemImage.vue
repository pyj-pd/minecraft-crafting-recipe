<script setup lang="ts">
import { useAnimationTimerStore } from '@/stores/image-animation'
import { getItemImageUrl } from '@/utils/image'
import type { ItemId, PossibleItem } from '@shared/types/minecraft'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

type ItemImageProps = {
  itemData: PossibleItem
}

const { itemData } = defineProps<ItemImageProps>()

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
</script>

<template>
  <img
    v-if="imageUrl !== null"
    :src="imageUrl"
  />
</template>
