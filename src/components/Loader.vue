<template>
  <div class="loader-wrapper" :class="{ admin: isAdmin, dark: dark, opaque: opaque }">
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Loader",
  props: ["isAdmin", "dark", "opaque"]
};
</script>
<style lang="scss" scoped>
.loader-wrapper {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 5;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;

  &.admin {
    z-index: 10;
  }

  &.dark {
    background: none;

    .lds-ring div {
      border-color: #000 transparent transparent transparent;
    }
  }

  &.opaque {
    background-color: rgba(0, 0, 0, 1);
  }
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
