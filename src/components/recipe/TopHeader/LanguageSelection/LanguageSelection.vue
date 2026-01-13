<script setup lang="ts">
import MyButton from '@/components/common/MyButton.vue'
import { languageList } from '@/constants/language'
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'

const searchStore = useSearchStore()
const { setLanguage } = searchStore
const { languageId, isLanguageLoading } = storeToRefs(useSearchStore())
</script>

<template>
  <div :class="$style['language-selection-container']">
    <div
      :class="$style['language-container']"
      role="radiogroup"
      aria-label="Language selection"
    >
      <MyButton
        v-for="languageData in languageList"
        :key="languageData.languageId"
        :class="[
          $style['language-button'],
          languageData.languageId === languageId && $style.selected,
        ]"
        role="radio"
        :aria-checked="languageData.languageId === languageId"
        :disabled="isLanguageLoading"
        @click="() => setLanguage(languageData.languageId)"
      >
        {{ languageData.languageName }}
      </MyButton>
    </div>
  </div>
</template>

<style lang="scss" module>
@use '@/assets/styles/value' as value;
@use '@/assets/styles/palette' as palette;
@use '@/assets/styles/mixin' as mixin;

.language-selection-container {
  display: flex;
  gap: 5px;
  align-items: center;
}

.language-container {
  display: flex;
}

.language-button {
  font-size: value.$x-small-button-font-size;

  &:not(.selected) {
    @include mixin.gray-button-color-style;
  }

  &.selected {
    @include mixin.button-color-style(
      $shadow-color-bright: transparent,
      $shadow-color-dark: transparent
    );
  }
}
</style>
