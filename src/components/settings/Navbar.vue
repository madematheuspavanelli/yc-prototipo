<template>
  <div class="navbar">
    <img src="@/assets/youcheckin_logo_full_yellow.svg" alt="Youcheckin Logo" class="logo" />
    <div class="router-links">
      <router-link to="/" exact>Home</router-link>
      <router-link to="/settings/facecamera">{{ $t("message.faceCameraNav") }}</router-link>
      <router-link to="/settings/documentcamera">{{ $t("message.documentCameraNav") }}</router-link>
      <router-link to="/settings/hotelsettings">{{ $t("message.hotelConfigNav") }}</router-link>
      <router-link to="/settings/languagesettings">{{ $t("message.languageNav") }}</router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: "SettingsNavbar"
};
</script>
<style lang="scss" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  width: 100%;
  height: fit-content;
  margin-bottom: 50px;

  .logo {
    height: 5rem;
  }

  .router-links {
    display: flex;

    a {
      font-size: 1.7rem;
      margin-right: 2rem;
      text-decoration: none;
      color: $yckYellow;
      font-weight: 300;

      &:last-child {
        margin-right: 0;
      }
      &.router-link-active {
        font-weight: 500;
      }
    }
  }
}
</style>
