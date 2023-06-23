<template>
  <div class="background">
    <div class="modal pos-r">
      <slot name="header"></slot>
      <slot name="center"></slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "Modal"
};
</script>
<style lang="scss" scoped>
.background {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 3;
  background-color: rgba(0, 0, 0, 0.4);
  .modal {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: $yckLightGrey;
    padding: 40px;
    border-radius: 8px;
    min-width: 350px;
    min-height: 240px;
    overflow: hidden;
  }
}
</style>
