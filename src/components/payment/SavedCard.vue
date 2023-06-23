<template>
  <app-page :pageTitle="$t('message.invoicePayment')" variant="top-bottom" :isLoading="isLoading">
    <div class="content">
      <div class="credit-card">
        <div>
          <span>{{ $t("message.registeredCard") }}</span>
          <div class="card-number">
            <img v-if="cardImg !== null" :src="cardImg" />
            <span>{{ cardString }}</span>
          </div>
        </div>
        <div class="new-card-action">
          <b-button @click="openCardRegistrationHandler">{{
            $t("message.registerNewCard")
          }}</b-button>
        </div>
        <div class="alert-message">
          <img src="@/assets/icons/ic_alert.svg" />
          {{ $t("message.registerHint") }}
        </div>
      </div>
      <div class="btn-container">
        <!-- <b-button @click="openCardRegistrationHandler">{{ $t("message.other") }}</b-button> -->
        <b-button @click="openPaymentHandler" variant="primary">{{ $t("message.next") }}</b-button>
      </div>
    </div>
  </app-page>
</template>

<script>
import { validateCard } from "@/scripts/creditCardValidator";

export default {
  name: "SavedCard",
  data() {
    return {
      cardNumber: null,
      isLoading: false,
      validCardImages: [
        "elo",
        "aura",
        "jcb",
        "visa",
        "mastercard",
        "amex",
        "dinnersclub",
        "hipercard"
      ]
    };
  },
  computed: {
    userId() {
      return this.$store.getters.getUserId;
    },
    cardType() {
      return (validateCard(this.cardNumber || "") || {}).type || "";
    },
    cardString() {
      return `**** **** **** ${this.cardNumber || "****"}`;
    },
    cardImg() {
      if (this.validCardImages.find(item => item === this.cardType)) {
        return require(`@/assets/icons/${this.cardType}.svg`);
      }
      return null;
    },
    totalValueToPay() {
      return this.$store.getters.bookingExpenses
        .filter(item => !item.isPaid)
        .map(item => item.value)
        .reduce((total, currentExpense) => total + currentExpense, 0);
    },
    isDoingCheckin() {
      return this.$store.getters.currentProcess === "checkin";
    }
  },
  methods: {
    loadCard() {
      this.isLoading = true;
      this.$API.users
        .getCard(this.userId)
        .then(response => {
          const { last4Digits } = response.data;
          this.cardNumber = last4Digits.toString() || "";
          this.isLoading = false;
        })
        .catch(this.noCardFoundHandler);
    },
    noCardFoundHandler() {
      this.goToCardRegistration();
    },
    openPaymentHandler() {
      if (this.isDoingCheckin && this.totalValueToPay > 0) {
        this.$router.push({ name: "PaymentPage" });
      } else if (!this.isDoingCheckin && this.totalValueToPay > 0) {
        // this.doYouHadExtraExpenses("PaymentPage");
        this.$router.push({ name: "PaymentPage" });
      } else {
        this.skipPaymentHandler();
      }
    },
    skipPaymentHandler() {
      if (this.isDoingCheckin) {
        this.$router.push({ name: "CheckinPage" });
      } else {
        // this.doYouHadExtraExpenses("CheckoutPage");

        this.$router.push({ name: "CheckoutPage" });
      }
    },
    async doYouHadExtraExpenses(route) {
      const result = await this.$swal.fire({
        title: "Houve algum consumo extra em sua hospedagem?",
        icon: "info",
        width: 500,
        showCloseButton: false,
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        confirmButtonText: `<label style="font-size:18px; color: white; cursor: pointer;">${this.$t(
          "message.yes"
        )}</label>`,
        cancelButtonText: `<label style="font-size:18px; color: white; cursor: pointer;">${this.$t(
          "message.no"
        )}</label>`,
        cancelButtonColor: "black",
        confirmButtonColor: "black",
        iconColor: "black",
        background: "#ffd400"
      });

      const { isConfirmed } = result;

      if (isConfirmed) {
        this.$alert("error", this.$t("alert.hadExtraExpenses")).then(() => {
          this.$router.push({ name: "Home" });
        });
      } else {
        this.$router.push({ name: route });
      }
    },
    openCardRegistrationHandler() {
      this.goToCardRegistration();
    },
    goToCardRegistration() {
      this.$router.push({ name: "CardRegistration" });
    }
  },
  mounted() {
    const isRede = this.$store.state.hotel.paymentType === 2;
    this.loadCard();
    if (isRede) {
      this.goToCardRegistration();
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  font-size: 1.8rem;

  .credit-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;

    div {
      width: 100%;
    }

    img {
      width: 50px;
      height: 50px;
    }

    .card-number {
      border: 1px solid $yckLightGrey;
      border-radius: 10px;
      margin-top: 10px;
      padding: 5px;
      justify-content: center;
      align-items: center;
      display: flex;

      span {
        font-weight: bold;
      }
    }
  }

  .alert-message {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 252px;
    font-size: 10px;
    img {
      width: 22px;
      height: 19px;
      margin-right: 9px;
    }
  }

  .new-card-action {
    display: flex;
    width: 100%;
    justify-content: center;
    button {
      width: 80%;
      margin: 0;
      padding: 12px 20px;
      border: 2px solid #343639;
      border-radius: 5px;
      font-size: 14px;
      color: #343639;
      background-color: white;
      margin: 0;
      min-width: 150px;
      margin-top: 30px;
      margin-bottom: 10px;
    }
  }
}
</style>
