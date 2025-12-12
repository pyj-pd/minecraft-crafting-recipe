import { defineStore, storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, type Ref } from 'vue'

const _useAnimationTimerStore = defineStore('animation-timer-store', {
  state: () => ({
    tick: 0, // Increase this value to tick image changes to image components
  }),
})

const ITEM_IMAGE_ANIMATION_INTERVAL = 1000

/**
 * Initializes first timer for image animations. This will be used to implement animations on item images that have multiple variants; item tags.
 */
export const initImageAnimationTimer = (): void => {
  const { tick } = storeToRefs(_useAnimationTimerStore())

  let interval: number

  onMounted(() => {
    interval = setInterval(() => {
      tick.value++
    }, ITEM_IMAGE_ANIMATION_INTERVAL)
  })

  onBeforeUnmount(() => {
    clearInterval(interval)
  })
}

/**
 * Uses image animation composable.
 * @returns Tick ref. Use this inside `effect` to change images.
 */
export const useImageAnimation = (): Ref<number> => {
  const { tick } = storeToRefs(_useAnimationTimerStore())

  return tick
}
