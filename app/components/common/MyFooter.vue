<template>
  <footer :class="$style.footer">
    <p>
      NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH
      MOJANG OR MICROSOFT.
    </p>
  </footer>
</template>

<style lang="scss" module>
@use '@/assets/styles/value' as value;
@use '@/assets/styles/palette' as palette;

.footer {
  color: palette.$dark-gray-5;

  font-size: value.$footer-font-size;
}
</style>
