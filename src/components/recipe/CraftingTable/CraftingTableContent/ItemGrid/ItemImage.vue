<script setup lang="ts">
import { useImageAnimation } from '@/composables/useImageAnimation'
import { getItemImageUrl } from '@/utils/image'
import type { ItemId, PossibleItem } from '@shared/types/minecraft'
import { computed, ref, watch } from 'vue'

type ItemImageProps = {
  itemData: PossibleItem | null
}

const { itemData } = defineProps<ItemImageProps>()

const itemIndex = ref<number>(0)

const itemId = computed<ItemId | null>(() => {
  if (itemData === null) return null

  if (typeof itemData === 'string') return itemData
  else {
    return itemData[itemIndex.value] as ItemId
  }
})

const imageUrl = computed(() =>
  itemId.value ? getItemImageUrl(itemId.value) : null
)

// Handle item tags
const imageTick = useImageAnimation()

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
