<template>
  <div :class="$style['loading-container']">
    <div :class="$style['loading-line-container']">
      <span />
    </div>
  </div>
</template>

<style lang="scss" module>
@use '@/assets/styles/value' as value;
@use '@/assets/styles/palette' as palette;

.loading-container {
  position: absolute;
  z-index: 10;
  top: calc(var(--table-width) * 0.025);
  left: 0;

  display: flex;
  justify-content: center;

  width: 100%;

  pointer-events: none;
}

.loading-line-container {
  display: flex;

  width: calc(var(--table-width) * 0.25);
  height: calc(var(--table-width) * 0.004);

  box-sizing: content-box;

  background-color: palette.$gray-2;

  border: solid calc(var(--table-width) * 0.0025) palette.$black;

  span {
    display: block;
    transform-origin: left;

    width: 100%;
    height: 100%;

    background-color: palette.$green-3;

    animation: loading-animation 7s both linear;
  }
}

@keyframes loading-animation {
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
}
</style>
