<script setup lang="ts">
const model = defineModel<string>()

const input = useTemplateRef('text-input')

const focusText = (): void => input.value?.inputRef?.focus()

defineExpose({ focusText })

// Search
const { searchItem } = useSearchStore()

const AUTO_SEARCH_DELAY = 200
let searchTimer: ReturnType<typeof setTimeout> | null = null // setTimeout

const handleSearch = (event: InputEvent): void => {
  if (searchTimer !== null) clearTimeout(searchTimer)

  searchTimer = setTimeout(
    () => doSearch((event.target as HTMLInputElement).value),
    AUTO_SEARCH_DELAY
  )
}

const doSearch = (query: string): void => {
  searchItem(query)
  focusText()
}

const clearQuery = (): void => {
  model.value = ''
}
</script>

<template>
  <div :class="$style['search-text-input-container']">
    <TextInput
      ref="text-input"
      v-model="model"
      placeholder="Search for items"
      :class="$style.input"
      type="search"
      autofocus
      @input="handleSearch"
      @clear="clearQuery"
    />
    <SearchResultList :class="$style['search-result']" />
  </div>
</template>

<style lang="scss" module>
.search-text-input-container {
  position: relative;

  display: flex;
  width: 100%;

  &:not(:focus-within) {
    .search-result {
      visibility: hidden;
    }
  }

  .search-result {
    transition: visibility 0.2s;
  }
}

.input {
  width: 100%;
}
</style>
