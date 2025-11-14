<script setup lang="ts">
import { computed, useTemplateRef, type InputHTMLAttributes } from 'vue'
import XIcon from './icons/XIcon.vue'

type TextInputProps = /* @vue-ignore */ InputHTMLAttributes & {
  type?: 'text' | 'search'
}

withDefaults(defineProps<TextInputProps>(), {
  type: 'text',
})

const model = defineModel<string>()
const isInputValueEmpty = computed(() => model.value?.length ?? 0 < 1)

const inputRef = useTemplateRef('input-element')

defineExpose({ inputRef })
</script>

<template>
  <form
    :class="$style['input-container']"
    @submit.prevent
  >
    <input
      ref="input-element"
      v-model="model"
      v-bind="$attrs"
      :class="$style.input"
      :type="$props.type"
    />
    <button
      :class="[$style['clear-button'], !isInputValueEmpty && $style.visible]"
      type="reset"
      aria-label="Clear"
    >
      <XIcon />
    </button>
  </form>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;
@use '@/styles/palette' as palette;

.input-container {
  display: flex;

  background-color: palette.$dark-gray-3;
  color: palette.$text-color;

  border: solid value.$border-width-normal palette.$light-gray;
  box-shadow: inset 0 value.$inset-shadow-offset 0 0 palette.$dark-gray-2;

  &:has(.input:placeholder-shown) {
    .clear-button {
      display: none;
    }
  }
}

.input {
  background: none;
  border: none;

  width: 100%;

  color: currentColor;
  font-size: value.$button-font-size;

  padding: value.$text-input-padding;
}

.clear-button {
  &.visible {
    display: flex;
  }
  justify-content: center;
  align-items: center;

  background: none;
  border: none;

  aspect-ratio: 1 / 1;
  height: 100%;

  color: currentColor;

  cursor: pointer;

  padding: 20px;
}
</style>
