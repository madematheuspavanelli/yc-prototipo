<template>
  <app-page :pageTitle="$t('message.doCheckout')" variant="top-bottom">
    <div class="loader-holder">
      <app-loader v-if="isLoading" :dark="true" />
    </div>
    <h2 class="processing-message">{{ $t("message.realizingCheckout") }}</h2>
  </app-page>
</template>
<script>
export default {
  name: "CheckoutPage",
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
    transactionId() {
      return this.$store.getters.transactionId;
    },
    totalValueToPay() {
      return this.$store.getters.bookingExpenses
        .filter(item => !item.isPaid)
        .map(item => item.value)
        .reduce((total, currentExpense) => total + currentExpense, 0);
    }
  },
  methods: {
    submitCheckout() {
      this.isLoading = true;
      const params = {
        bookingId: this.bookingId,
        userId: this.userId,
        transactionId: this.totalValueToPay > 0 ? this.transactionId : -1
      };
      this.$API.hotel
        .checkout(params)
        .then(() => {
          this.$router.push({ name: "ReturnKeys" });
        })
        .catch(() => {
          this.$router.push({ name: "DisagreeInvoice" });
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
  mounted() {
    this.submitCheckout();
  }
};
</script>
