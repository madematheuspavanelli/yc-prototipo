<template>
  <router-view @toggleLoader="toggleLoader()"></router-view>
</template>
<script>
export default {
  name: "Guests",
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    toggleLoader() {
      this.isLoading = !this.isLoading;
    }
  }
};
</script>
<style lang="scss" scoped></style>
