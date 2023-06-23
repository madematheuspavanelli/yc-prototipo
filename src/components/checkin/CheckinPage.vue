<template>
  <app-page :pageTitle="$t('message.doCheckin')" variant="top-bottom">
    <div class="loader-holder">
      <app-loader v-if="isLoading" :dark="true" />
    </div>
    <h2 class="processing-message">{{ $t("message.realizingCheckin") }}</h2>
  </app-page>
</template>
<script>
export default {
  name: "CheckinPage",
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    userId() {
      return this.$store.getters.getUserId;
    },
    bookingId() {
      return this.$store.getters.getBookingId;
    },
    guestId() {
      return this.$store.getters.guestId;
    },
    transactionId() {
      return this.$store.getters.transactionId;
    },
    shouldMagnetizeOnTotem() {
      return localStorage.getItem("settings.shouldMagniteze") === "1";
    },
    totalValueToPay() {
      return this.$store.getters.bookingExpenses
        .filter(item => !item.isPaid)
        .map(item => item.value)
        .reduce((total, currentExpense) => total + currentExpense, 0);
    }
  },
  methods: {
    submitCheckin() {
      this.isLoading = true;
      const params = {
        bookingId: this.bookingId,
        userId: this.userId,
        guestId: this.guestId,
        transactionId: this.totalValueToPay > 0 ? this.transactionId : -1
      };
      this.$API.hotel
        .checkin(params)
        .then(() => {
          if (this.shouldMagnetizeOnTotem) {
            this.$router.push({ name: "KeyConfig" });
          } else {
            this.showSkipMagnetizeMessage();
          }
        })
        .catch(() => {
          this.$router.push({ name: "DisagreeInvoice" });
        });
    },
    showSkipMagnetizeMessage() {
      this.$alert("success", this.$t("message.skipMagnetize")).then(this.finishCheckin);
    },
    finishCheckin() {
      this.$router.push({ name: "EndCheckin" });
    }
  },
  mounted() {
    this.submitCheckin();
  }
};
</script>
