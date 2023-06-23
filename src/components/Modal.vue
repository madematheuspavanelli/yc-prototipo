<template>
  <div class="modal">
    <slot name="title"></slot>
    <slot name="center"></slot>
    <slot name="bottom"></slot>
  </div>
</template>
<script>
export default {
  name: "Modal"
};
</script>
<style lang="scss" scoped>
.modal {
  padding: 10px 15px;
  background-color: $white;
  display: flex;
  flex-direction: column;
  width: fit-content;
  border-radius: 4px;
  z-index: 3;
}
</style>
