<template>
  <div class="admin-inner-content">
    <Navbar />
    <section class="admin-section">
      <b-container class="admin-container">
        <router-view />
      </b-container>
    </section>
  </div>
</template>

<script>
import Navbar from "@/components/admin/Navbar";
import { setToken } from "@/libs/axios";

export default {
  name: "AdminContent",
  components: {
    Navbar
  },
  computed: {
    isUserAuthenticated() {
      return this.$store.getters.isUserAuthenticated;
    }
  },
  methods: {
    verifyStoredCredentials() {
      const token = localStorage.getItem("token");
      if (token !== "null") {
        this.loginLastUser(token);
      } else {
        this.$router.push({ name: "Login" });
      }
    },
    loginLastUser(token) {
      this.$store.dispatch("SET_TOKEN", { value: token });
      setToken(this, token);
    }
  },
  created() {
    if (!this.isUserAuthenticated) {
      this.verifyStoredCredentials();
    }
  }
};
</script>
<style lang="scss" scoped>
.admin-inner-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .admin-section {
    flex-grow: 1;
    overflow-x: auto;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
  }

  .container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
}
</style>
