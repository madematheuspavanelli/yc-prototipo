<template>
  <app-page :pageTitle="$t('message.invoicePayment')" variant="top-bottom">
    <div class="loader-holder">
      <app-loader v-if="isLoading" :dark="true" />
    </div>
    <h2 class="processing-message">{{ $t("message.processingPayment") }}</h2>
  </app-page>
</template>
<script>
export default {
  name: "PaymentPage",
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
    totalValue() {
      return this.$store.getters.bookingInvoiceValue;
    },
    isDoingCheckin() {
      return this.$store.getters.currentProcess === "checkin";
    },
    cardData() {
      return this.$store.getters.credicCardData;
    },
    installments() {
      return this.$store.getters.installments;
    }
  },
  methods: {
    submitPayment() {
      this.isLoading = true;
      const params = {
        userId: this.userId,
        bookingId: this.bookingId,
        transactionId: this.transactionId,
        amount: Math.floor(this.totalValue * 100),
        type: 1,
        installments: this.installments,
        ...this.cardData
      };

      this.$API.transaction
        .realizeTransaction(params)
        .then(this.paymentDoneHandler)
        .catch(this.paymentErrorHandler)
        .finally(() => {
          this.isLoading = false;
        });
    },
    paymentDoneHandler(response) {
      const id = response.data.id || null;
      this.$store.dispatch("SET_BOOKING_TRANSACTION_ID", { value: id });
      if (this.isDoingCheckin) {
        this.$router.push({ name: "CheckinPage" });
      } else {
        this.$router.push({ name: "CheckoutPage" });
      }
    },
    paymentErrorHandler() {
      this.$alert("error", this.$t("alert.errorPayment")).then(() => {
        this.$router.push({ name: "SavedCard" });
      });
    }
  },
  mounted() {
    this.submitPayment();
    console.log(this.amount);
  }
};
</script>
