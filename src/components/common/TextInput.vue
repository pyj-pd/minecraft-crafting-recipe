<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import XIcon from './icons/XIcon.vue'
import SearchIcon from './icons/SearchIcon.vue'

type TextInputProps = /* @vue-ignore */ {
  type?: 'text' | 'search'
}

withDefaults(defineProps<TextInputProps>(), {
  type: 'text',
})

defineEmits(['clear']) // @todo scroll to top when cleared

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
    <div
      v-if="$attrs.type === 'search'"
      :class="$style['left-icon-container']"
    >
      <SearchIcon :class="$style['search-icon']" />
    </div>
    <input
      ref="input-element"
      v-model="model"
      v-bind="$attrs"
      :class="$style.input"
    />
    <button
      :class="[$style['clear-button'], !isInputValueEmpty && $style.visible]"
      type="reset"
      aria-label="Clear"
      @click="$emit('clear')"
    >
      <XIcon :class="$style['x-icon']" />
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

  border: solid value.$border-width-thick palette.$light-gray;
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
  font-weight: value.$input-font-weight;

  padding: value.$text-input-padding;
  padding-left: 0;

  &::placeholder {
    color: palette.$dark-gray-5;
  }
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

  padding: 0;

  &:hover {
    filter: brightness(70%);
  }

  .x-icon {
    width: 15px;
  }
}

.left-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
  aspect-ratio: 1 / 1;

  color: palette.$light-gray;

  .search-icon {
    height: 45%;
  }
}
</style>
