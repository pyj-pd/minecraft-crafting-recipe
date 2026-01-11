<template>
  <section :class="$style['recipe-view-section']">
    <MethodTab />
    <CraftingTable />
  </section>
</template>

<style lang="scss" module>
@use '@/assets/styles/value' as value;

.recipe-view-section {
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  max-width: 900px;
}
</style>
