<template>
  <div class="module-wrapper pos-r bg-white">
    <router-view @toggleLoader="toggleLoader()"></router-view>
    <transition name="fade">
      <Loader v-if="isLoading" />
    </transition>
  </div>
</template>
<script>
import Loader from "@/components/Loader";

export default {
  name: "Checkin",
  components: {
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
}
</style>
