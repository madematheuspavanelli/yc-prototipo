<template>
  <div class="module-wrapper pos-r">
    <div class="container">
      <Navbar />
      <router-view @toggleLoader="toggleLoader()"></router-view>
    </div>
    <transition name="fade">
      <Loader v-if="isLoading" />
    </transition>
  </div>
</template>
<script>
import Navbar from "@/components/settings/Navbar";
import Loader from "@/components/Loader";

export default {
  name: "Settings",
  components: {
    Navbar,
    Loader
  },
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

  .container {
    overflow-y: auto;
  }
}
</style>
