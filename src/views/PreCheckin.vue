<template>
  <div class="module-wrapper pos-r">
    <div>
      <router-view></router-view>
    </div>
    <app-loader v-if="isLoading" :opaque="true"></app-loader>
  </div>
</template>
<script>
export default {
  name: "PreCheckin",
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    loadHotelSettings() {
      // this.isLoading = true;
      this.$API.hotel.getSettings().then(response => {
        const settings = (response.data || {}).options || {
          configs: {}
        };
        this.$store.dispatch("SET_HOTEL_SETTINGS", settings);
        this.isLoading = false;
      });
    }
  },
  mounted() {
    this.loadHotelSettings();
  }
};
</script>
<style lang="scss" scoped>
.module-wrapper {
  background-color: $yckDarkGrey;
  overflow: hidden;

  & > div {
    width: 100%;
  }
}
</style>
