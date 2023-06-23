<template>
  <app-page
    :pageTitle="$t('message.registerCard')"
    :isLoading="isLoading"
    variant="top-bottom"
    showRequired
  >
    <transition name="fade">
      <Loader v-show="isLoading" />
    </transition>

    <p class="content">{{ $t("message.cardSafe") }}</p>

    <div class="content">
      <div>
        <CreditCard
          :number="cardNumber"
          :name="cardHolderName"
          :validity="cardValidity"
          :cvv="securityNumber"
          :cardType="cardType"
        />
        <MessageSecurity />
      </div>
      <form @submit.prevent="submitHandler" autocomplete="off" class="card-info">
        <ValidationObserver slim ref="validator">
          <keyboard-flow v-slot="{ nextFieldHandler }" @done="submitHandler">
            <app-totem-input
              name="cardNumber"
              keyboardLayout="numeric"
              :mask="['XXXX XXXXXX XXXXX', 'XXXX XXXX XXXX XXXX', 'XXXXX XXXX XXXX XXXX XXX']"
              :label="`${$t('message.cardNumber')}*`"
              v-model="cardNumber"
              ref="flow_1"
              validationRules="required|min-length:15"
              class="mb-5"
              @confirmed="nextFieldHandler($refs.flow_2)"
              @blur="hideCardNumber"
              @focus="showCardNumber"
              @hide-data="handleHideNumber"
              @show-data="handleShowNumber"
              :has-hide-buttons="true"
            />
            <app-totem-input
              name="cardHolderName"
              keyboardLayout="name"
              :label="`${$t('message.cardOwner')}*`"
              v-model="cardHolderName"
              ref="flow_2"
              validationRules="required"
              @confirmed="nextFieldHandler($refs.flow_3)"
            />
            <div class="d-flex">
              <app-totem-input
                placement="top"
                name="cardValidity"
                keyboardLayout="numeric"
                :mask="['##/##']"
                :label="`${$t('message.cardValidity')}*`"
                v-model="cardValidity"
                ref="flow_3"
                class="flex-grow-1 mr-5"
                validationRules="required|min-length:5"
                @confirmed="nextFieldHandler($refs.flow_4)"
              />
              <app-totem-input
                placement="top"
                name="securityNumber"
                keyboardLayout="numeric"
                :mask="['XXXX']"
                :label="`${$t('message.cardCVV')}*`"
                v-model="securityNumber"
                ref="flow_4"
                validationRules="required|min-length:3"
                :has-hide-buttons="true"
                @blur="hideSecurityNumber"
                @focus="showSecurityNumber"
                @hide-data="handleHideSecurity"
                @show-data="handleShowSecurity"
              />
            </div>
            {{ installmentsDisabled }}
            <app-totem-select
              placement="top"
              :disabled="installmentsDisabled"
              name="documentType"
              :label="`${$t('message.installment')}*`"
              :options="installmentOptions"
              v-model="selectedInstallment"
              validationRules="required"
            />
          </keyboard-flow>
          <div class="btn-container">
            <b-button @click="clean">{{ $t("message.cleanBtn") }}</b-button>
            <b-button type="submit" variant="primary">{{ $t("message.next") }}</b-button>
          </div>
        </ValidationObserver>
      </form>
    </div>
  </app-page>
</template>

<script>
import CreditCard from "@/components/CreditCard";
import { validateCard } from "@/scripts/creditCardValidator";
import MessageSecurity from "@/components/MessageSecurity";
import Loader from "@/components/Loader";

import { getCardBrand } from "@/utils/getCardBrand.js";

export default {
  name: "CardRegistration",
  components: {
    CreditCard,
    MessageSecurity,
    Loader
  },
  data() {
    return {
      neverHideCardNumber: false,
      neverHideSecurityNumber: false,
      realCardNumber: null,
      cardNumber: null,
      cardHolderName: null,
      cardValidity: null,
      realSecurityNumber: null,
      securityNumber: null,
      isLoading: false,
      cardBrand: null,
      selectedInstallment: { label: "1x", value: 1 }
    };
  },
  computed: {
    shouldPayOnCheckin() {
      return this.$store.getters.hotelSettingUsePayOnCheckin;
    },
    userId() {
      return this.$store.getters.getUserId;
    },
    isDoingCheckin() {
      return this.$store.getters.currentProcess === "checkin";
    },
    totalValueToPay() {
      return this.$store.getters.bookingExpenses
        .filter(item => !item.isPaid)
        .map(item => item.value)
        .reduce((total, currentExpense) => total + currentExpense, 0);
    },
    cardType() {
      if (this.cardNumber !== null && this.cardNumber.includes("X")) {
        const cardInfo = validateCard(this.realCardNumber || "") || {};
        return cardInfo.type || "default";
      }
      const cardInfo = validateCard(this.cardNumber || "") || {};
      return cardInfo.type || "default";
    },
    bookingId() {
      return this.$store.getters.getBookingId;
    },
    installmentsDisabled() {
      return !this.$store.getters.hotelInstallmentsOption;
    },
    installmentOptions() {
      if (this.$store.getters.hotelInstallmentsOption) {
        return [
          { label: "1x", value: 1 },
          { label: "2x", value: 2 },
          { label: "3x", value: 3 },
          { label: "4x", value: 4 },
          { label: "5x", value: 5 },
          { label: "6x", value: 6 },
          { label: "7x", value: 7 },
          { label: "8x", value: 8 },
          { label: "9x", value: 9 },
          { label: "10x", value: 10 }
        ];
      }
      return [{ label: "1x", value: 1, selected: true }];
    }
  },
  methods: {
    handleHideNumber() {
      this.neverHideCardNumber = !this.neverHideCardNumber;
      this.hideCardNumber();
    },
    hideCardNumber() {
      if (this.cardNumber.includes("X")) {
        return;
      }
      this.realCardNumber = this.cardNumber;
      if (this.neverHideCardNumber) {
        return;
      }
      this.cardNumber = "XXXX XXXX XXXX" + this.cardNumber.slice(this.cardNumber.length - 4);
    },
    handleShowNumber() {
      this.neverHideCardNumber = !this.neverHideCardNumber;
      this.showCardNumber();
    },
    showCardNumber() {
      this.cardNumber = this.realCardNumber;
    },
    handleHideSecurity() {
      this.neverHideSecurityNumber = !this.neverHideSecurityNumber;
      this.hideSecurityNumber();
    },
    hideSecurityNumber() {
      if (this.securityNumber.includes("X")) {
        return;
      }
      this.realSecurityNumber = this.securityNumber;
      if (this.neverHideSecurityNumber) {
        return;
      }
      this.securityNumber = "XXX";
    },
    handleShowSecurity() {
      this.neverHideSecurityNumber = !this.neverHideSecurityNumber;
      this.showSecurityNumber();
    },
    showSecurityNumber() {
      this.securityNumber = this.realSecurityNumber;
    },
    submitHandler() {
      const data = this.getSendData();
      const brand = getCardBrand(data.cardNumber);

      const params = {
        ...data,
        securityCode: data.securityNumber,
        cardBrand: brand || "no info"
      };

      this.$store.dispatch("SET_CREDIT_CARD", { value: params });

      this.$refs.validator.validate().then(res => {
        if (res) {
          this.saveCard();
        } else {
          this.$alert("warning", this.$t("alert.invalidFields"));
        }
      });
    },
    saveCard() {
      this.isLoading = true;
      const data = this.getSendData();
      this.$API.users
        .registerCard(data, this.userId)
        .then(() => {
          if (this.isDoingCheckin && !this.shouldPayOnCheckin) {
            this.$router.push({ name: "CheckinPage" });
          } else {
            this.$API.booking
              .getBooking(this.bookingId, this.$store.getters.currentProcess)
              .then(response => {
                const {
                  guestEnabledFor,
                  shouldPayOnCheckin,
                  requirePrimaryPayment
                } = response.data;
                if (
                  guestEnabledFor.includes("CHECKIN") &&
                  shouldPayOnCheckin &&
                  requirePrimaryPayment
                ) {
                  this.$router.push({ name: "PaymentPage" });
                } else {
                  this.skipPaymentHandler();
                }
              })
              .catch(() => {});

            // if (this.totalValueToPay > 0) {
            //   this.$router.push({ name: "InvoicePage" });
            // } else {
            //   this.skipPaymentHandler();
            // }
          }
        })
        .catch(() => {
          this.$alert("erro", this.$t("alert.cardError"));
          this.isLoading = false;
        });
    },
    getSendData() {
      const [monht, year] = this.cardValidity.split("/");
      const { cardHolderName, realSecurityNumber } = this;
      const securityNumber = realSecurityNumber;
      const cardNumber = this.realCardNumber.replace(/\s+/g, "");
      const expirationMonth = parseInt(monht)
        .toString()
        .padStart(2, "0");
      const expirationYear = parseInt(`20${year}`);
      const cardBrand = this.cardType;
      const installments = this.selectedInstallment.value;
      return {
        cardHolderName,
        securityNumber,
        cardNumber,
        expirationMonth,
        expirationYear,
        cardBrand,
        installments
      };
    },
    skipPaymentHandler() {
      if (this.isDoingCheckin) {
        this.$router.push({ name: "CheckinPage" });
      } else {
        this.$router.push({ name: "CheckoutPage" });
      }
    },
    clean() {
      this.cardNumber = null;
      this.cardHolderName = null;
      this.cardValidity = null;
      this.securityNumber = null;
      this.cardBrand = null;
      this.realCardNumber = null;
      this.realSecurityNumber = null;
    }
  }
};
</script>
<style lang="scss" scoped>
p {
  font-size: 16px;
  text-align: justify;
  width: 100%;
  margin-bottom: 20px;
}

.content {
  display: flex;
  flex-direction: row;
  align-items: center;
}

form {
  padding-left: 20px;
}

::v-deep {
  .virtual-keyboard-input {
    margin-bottom: 25px;
  }
}
</style>
