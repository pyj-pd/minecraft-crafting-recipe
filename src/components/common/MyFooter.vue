<script setup lang="ts">
import { REPOSITORY_URL } from '@/constants/project'
</script>

<template>
  <footer :class="$style.footer">
    <p>
      NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH
      MOJANG OR MICROSOFT.
    </p>
    <p>
      This website is an open-source project and the source code is available on
      <a
        :href="REPOSITORY_URL"
        target="_blank"
        >GitHub repository</a
      >.
    </p>
  </footer>
</template>

<style lang="scss" module>
@use '@/assets/styles/value' as value;
@use '@/assets/styles/palette' as palette;

.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  color: palette.$dark-gray-5;

  text-align: center;
  font-size: value.$footer-font-size;

  a {
    color: currentColor;
  }
}
</style>
