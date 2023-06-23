<template>
  <div>
    <img class="back-button" :src="imgSrc" alt="Back button" @click="clickHandler()" />
  </div>
</template>
<script>
export default {
  name: "BackButton",
  props: {
    isWhite: {
      required: false,
      default: false
    },
    useCustomClick: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    imgSrc() {
      return require(`@/assets/icons/${this.isWhite ? "ic_back_white" : "ic_back_black"}.svg`);
    }
  },
  methods: {
    clickHandler() {
      if (this.useCustomClick) {
        this.$emit("click");
      } else {
        this.goToPreviousRoute();
      }
    },
    goToPreviousRoute() {
      this.$router.back();
    }
  }
};
</script>
<style lang="scss" scoped>
.back-button {
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 3061;
  width: 5rem;
  cursor: pointer;
}
</style>
