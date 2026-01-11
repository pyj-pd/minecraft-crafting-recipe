<script setup lang="ts">
import { useAnimationTimerStore } from '@/stores/image-animation'
import { storeToRefs } from 'pinia'

const animationTimerStore = useAnimationTimerStore()
const { toggleInterval } = animationTimerStore
const { isAnimationOn } = storeToRefs(animationTimerStore)
</script>

<template>
  <MyButton
    :class="$style['button']"
    :aria-label="`${isAnimationOn ? 'Pause' : 'Play'} image animation`"
    @click="toggleInterval"
  >
    <PauseIcon
      v-if="isAnimationOn"
      :class="$style['pause-icon']"
    />
    <PlayIcon
      v-else
      :class="$style['play-icon']"
    />
  </MyButton>
</template>

<style lang="scss" module>
@use '@/assets/styles/mixin' as mixin;
@use '@/assets/styles/palette' as palette;

.button {
  display: flex;
  justify-content: center;
  align-items: center;

  width: calc(var(--table-width) * 0.06);
  aspect-ratio: 1 / 1;

  padding: 0;

  @include mixin.gray-button-color-style(
    $shadow-width: calc(var(--table-width) * 0.005),
    $border-width: calc(var(--table-width) * 0.0025)
  );

  color: palette.$light-gray;
}

.pause-icon {
  width: 35%;
}

.play-icon {
  height: 45%;
}
</style>
