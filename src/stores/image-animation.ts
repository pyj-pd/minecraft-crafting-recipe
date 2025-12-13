import { defineStore } from 'pinia'
import { onBeforeUnmount, onMounted } from 'vue'

export const ITEM_IMAGE_ANIMATION_INTERVAL = 1000

export const useAnimationTimerStore = defineStore('animation-timer-store', {
  state: () => ({
    imageTick: 0, // Increase this value to tick image changes to image components

    _interval: null as null | number,
  }),
  getters: {
    isAnimationOn(): boolean {
      return this._interval !== null
    },
  },
  actions: {
    startInterval(): void {
      if (this._interval !== null) return

      this._interval = setInterval(() => {
        this.imageTick++
      }, ITEM_IMAGE_ANIMATION_INTERVAL)
    },
    stopInterval(): void {
      if (this._interval === null) return

      clearInterval(this._interval)
      this._interval = null
    },
    toggleInterval(): void {
      if (this._interval === null) this.startInterval()
      else this.stopInterval()
    },
  },
})

/**
 * Initializes first timer for image animations. This will be used to implement animations on item images that have multiple variants; item tags.
 */
export const initImageAnimationTimer = (): void => {
  const animationTimerStore = useAnimationTimerStore()
  const { startInterval, stopInterval } = animationTimerStore

  onMounted(() => {
    startInterval()
  })

  onBeforeUnmount(() => {
    stopInterval()
  })
}
