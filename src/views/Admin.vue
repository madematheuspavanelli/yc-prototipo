<template>
  <div class="admin-wrapper module-wrapper pos-r">
    <router-view />
  </div>
</template>

<script>
import { clearToken } from "@/libs/axios";

export default {
  name: "Admin",
  destroyed() {
    clearToken(this);
  }
};
</script>
<style lang="scss" scoped>
.admin-wrapper {
  background-color: $yckDarkGrey;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
</style>
