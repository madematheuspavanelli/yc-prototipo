<template>
  <div class="pos-r">
    <div>
      <router-view @toggleLoader="toggleLoader()"></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: "Reservations",

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
<style lang="scss" scoped>
.module-wrapper {
  background-color: $yckDarkGrey;
}
</style>
