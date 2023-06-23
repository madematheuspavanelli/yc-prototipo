<template>
  <PreCheckinStructure
    :dotActive="'seven'"
    :backButton="true"
    :form="true"
    :isLoading="isLoading"
    class="precheckin-cardRegistration"
  >
    <div class="title" slot="title">
      <span>{{ $t("message.confirmDetails") }}</span>
    </div>
    <div slot="center">
      <div class="content">
        <CreditCard
          :number="cardNumber"
          :name="cardHolderName"
          :validity="cardValidity"
          :cvv="securityNumber"
          :cardType="cardType"
          class="credit-card"
        />
        <form @submit.prevent="submitHandler" autocomplete="off" class="card-info">
          <b-card>
            <ValidationObserver slim ref="validator">
              <keyboard-flow v-slot="{ nextFieldHandler }" @done="submitHandler">
                <app-input
                  name="cardNumber"
                  :mask="['#### #### #### ####', '#### #### #### #### ###']"
                  :label="`${$t('message.cardNumber')}*`"
                  v-model="cardNumber"
                  :inputType="'text'"
                  ref="flow_1"
                  validationRules="required"
                  class="mb-5"
                  @confirmed="nextFieldHandler($refs.flow_2)"
                />
                <app-input
                  name="cardHolderName"
                  :label="`${$t('message.cardOwner')}*`"
                  v-model="cardHolderName"
                  ref="flow_2"
                  validationRules="required"
                  @confirmed="nextFieldHandler($refs.flow_3)"
                />
                <div class="d-flex">
                  <app-input
                    name="cardValidity"
                    :mask="['##/##']"
                    :label="`${$t('message.cardValidity')}*`"
                    v-model="cardValidity"
                    ref="flow_3"
                    class="flex-grow-1 mr-5"
                    validationRules="required|min-length:5"
                    @confirmed="nextFieldHandler($refs.flow_4)"
                  />
                  <app-input
                    name="securityNumber"
                    :mask="['####']"
                    :inputType="'text'"
                    :label="`${$t('message.cardCVV')}*`"
                    v-model="securityNumber"
                    ref="flow_4"
                    validationRules="required|min-length:3"
                    @confirmed="nextFieldHandler"
                  />
                </div>
              </keyboard-flow>
              <div class="btn-container">
                <b-button @click="clean">{{ $t("message.cleanBtn") }}</b-button>
                <b-button type="submit" variant="primary">{{ $t("message.next") }}</b-button>
              </div>
            </ValidationObserver>
          </b-card>
        </form>
      </div>
    </div>
  </PreCheckinStructure>
</template>

<script>
import PreCheckinStructure from "@/components/PreCheckinStructure";
import CreditCard from "@/components/CreditCard";
import { validateCard } from "@/scripts/creditCardValidator";

export default {
  name: "CardPreRegistration",
  components: {
    PreCheckinStructure,
    CreditCard
  },
  data() {
    return {
      cardNumber: null,
      cardHolderName: null,
      cardValidity: null,
      securityNumber: null,
      isLoading: false
    };
  },

  computed: {
    userId() {
      return this.$store.getters.precheckinUserId;
    },
    cardType() {
      const cardInfo = validateCard(this.cardNumber || "") || {};
      return cardInfo.type || "default";
    }
  },
  methods: {
    submitHandler() {
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
          this.$router.push({ name: "EndPreCheckin" });
        })
        .catch(() => {
          this.isLoading = false;
          this.$alert("error", this.$t("alert.tryAgain"));
        });
    },
    getSendData() {
      const [monht, year] = this.cardValidity.split("/");
      const { cardHolderName, securityNumber } = this;
      const cardNumber = this.cardNumber.replace(/\s+/g, "");
      const expirationMonth = parseInt(monht)
        .toString()
        .padStart(2, "0");
      const expirationYear = parseInt(`20${year}`);
      return {
        cardHolderName,
        securityNumber,
        cardNumber,
        expirationMonth,
        expirationYear
      };
    },
    clean() {
      this.cardNumber = null;
      this.cardHolderName = null;
      this.cardValidity = null;
      this.securityNumber = null;
    }
  }
};
</script>
<style lang="scss" scoped>
.precheckin-cardRegistration {
  .content {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
  }

  form {
    padding-left: 20px;
  }

  ::v-deep {
    .virtual-keyboard-input {
      margin-bottom: 25px;
    }
  }
  .title {
    display: flex;
    flex-direction: column;
    margin: 0 auto;

    span {
      font-size: 16px;
      color: $white;
      font-weight: 500;
      text-align: center;
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    text-align: start;
    margin-bottom: 20px;
    position: relative;

    input,
    select {
      padding: 5px 10px;
      border: 0px;
      border-radius: 0;
      border-bottom: 1px solid $yckLightGrey;
      width: 100%;
      outline: none;
      font-size: 14px;

      &.custom-select {
        min-width: unset;
      }
    }

    label {
      font-size: 12px;
      margin-bottom: 0;
    }

    .invalid-feedback {
      position: absolute;
    }
  }

  .btn-container {
    display: flex;
    margin-top: 10px;
  }

  .card {
    padding: 20px;
    margin: 20px 0;
    border-radius: 0.4rem;
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  }
}

@media screen and (max-width: 767px) {
  .precheckin-cardRegistration {
    .content {
      flex-direction: column;
      overflow: hidden;
    }
    form {
      padding: 0;
    }

    .precheckin-address {
      .title {
        margin-bottom: 15px;
        span {
          font-size: 20px;
        }
      }

      .form-group {
        align-items: center;

        input,
        select {
          margin: 0;
          padding: 0;
          font-size: 16px;
        }

        label {
          margin: 0;
          padding: 0;
          font-size: 14px;
        }

        input [type="Number"] {
          max-width: 767px;
        }

        &:last-child {
          padding-top: 20px;
        }

        .card {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }
      }
    }
  }
}
@media screen and (min-width: 768px) {
  .precheckin-address {
    .title {
      span {
        font-size: 20px;
      }
    }

    .form-group {
      input,
      select {
        font-size: 16px;
      }

      label {
        font-size: 14px;
      }

      &:last-child {
        margin-bottom: 20px;
      }
    }

    .card {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .form-group {
        margin-right: 20px;

        &:nth-child(2n) {
          margin-right: 0;
        }
      }
    }

    .btn-container {
      button {
        width: 300px;
        margin-left: auto;
        margin-right: 0;
      }
    }
  }
}

@media screen and (min-width: 1400px) {
  .precheckin-address {
    .title {
      span {
        font-size: 24px;
      }
    }

    .form-group {
      input,
      select {
        font-size: 18px;
      }

      label {
        font-size: 16px;
      }
    }
  }
}
</style>
