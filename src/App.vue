<template>
  <div id="app">
    <router-view />
    <app-loader v-if="isLoading" />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      iddleTimer: null,
      isLoading: false
    };
  },
  computed: {
    showIddleAlert() {
      if (this.$router.currentRoute.name === "Home") {
        return false;
      }

      const blocked = this.$route.matched.find(
        item => item.path === "/admin" || item.path == "/preCheckin"
      );
      if (blocked) {
        return false;
      }

      return true;
    }
  },
  methods: {
    setIddleTimer() {
      if (this.iddleTimer !== null) {
        clearTimeout(this.iddleTimer);
      }
      this.iddleTimer = setTimeout(() => {
        clearTimeout(this.iddleTimer);
        if (this.showIddleAlert) {
          this.showIddleAlertHandler();
        } else {
          this.setIddleTimer();
        }
      }, 300_000);
    },
    showIddleAlertHandler() {
      this.$alert("warning", this.$t("alert.iddle"), null, {
        timer: 30_000,
        confirmButtonText: this.$t("message.yes")
      }).then(data => {
        if (data.isConfirmed) {
          this.setIddleTimer();
        } else {
          this.resetApplication();
        }
      });
    },
    resetApplication() {
      this.$store.dispatch("RESET_ALL");
      this.$router.push({ name: "Home" });
    },
    setEventListeners() {
      document.addEventListener("click", this.setIddleTimer);
      document.addEventListener("mousemove", this.setIddleTimer);
      document.addEventListener("touchstart", this.setIddleTimer);
      document.addEventListener("keypress", this.setIddleTimer);
    },
    loadHotelSettings() {
      this.isLoading = true;
      this.$API.hotel
        .getSettings()
        .then(response => {
          const settings = (response.data || {}).options || {
            configs: {},
            customization: {}
          };
          const { paymentType, allowInstallments } = response.data;
          this.$store.dispatch("SET_PAYMENT_TYPE", paymentType);
          this.$store.dispatch("SET_HOTEL_SETTINGS", settings);
          this.$store.dispatch("SET_INSTALLMENTS", allowInstallments);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
  mounted() {
    this.setIddleTimer();
    this.setEventListeners();
  },
  created() {
    this.loadHotelSettings();
  }
};
</script>
