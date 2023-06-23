<template>
  <b-navbar toggleable="lg" type="dark" variant="dark" class="navbar">
    <b-navbar-brand>
      <router-link to="/admin/dashboard">
        <img src="@/assets/youcheckin_logo_full_yellow.svg" alt="Youcheckin Logo" class="logo" />
      </router-link>
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/admin/dashboard">
          {{ $t("message.dashboard") }}
        </b-nav-item>
        <b-nav-item to="/admin/reservations">
          {{ $t("message.reservationList") }}
        </b-nav-item>
        <b-nav-item to="/admin/guests">
          {{ $t("message.guestList") }}
        </b-nav-item>
        <b-nav-item to="/admin/settings">
          {{ $t("message.settings") }}
        </b-nav-item>
        <b-nav-item>
          <img
            src="@/assets/icons/ic_logout.svg"
            alt="Logout icon"
            class="logout"
            @click="logoutHandler"
          />
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script>
export default {
  name: "Navbar",
  methods: {
    logoutHandler() {
      this.$store.dispatch("LOGOUT");
      this.$router.push({ name: "Login" });
    }
  }
};
</script>
<style lang="scss" scoped>
.navbar {
  padding: 20px 40px;
  box-shadow: 0 10px 10px 0 rgba(30, 30, 30, 0.4);
  z-index: 2;
  position: relative;

  .navbar-brand {
    height: 50px;

    .logo {
      height: 100%;
    }
  }

  .nav-item {
    width: 150px;

    &:last-child {
      width: 50px;
    }

    a {
      color: $white;
      font-size: 14px;
    }
  }
}

@media screen and (min-width: 992px) {
  .navbar {
    .nav-item {
      a {
        text-align: center;
      }
    }
  }
}
</style>
