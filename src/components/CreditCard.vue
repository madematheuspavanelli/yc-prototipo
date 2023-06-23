<template>
  <div>
    <div :class="`credit-card ${cardType}`">
      <div class="row">
        <label>{{ number == null ? "#### #### #### ####" : number }}</label>
      </div>
      <div class="row">
        <label>{{ name == null ? this.$t("message.cardOwner") : name }}</label>
      </div>
      <div class="row">
        <label>{{ validity == null ? "##/##" : validity }}</label>
        <label>{{ cvv == null ? "###" : cvv }}</label>
        <img v-if="cardType == 'visa'" class="back-button" src="@/assets/icons/visa.svg" />
        <img
          v-if="cardType == 'mastercard'"
          class="back-button"
          src="@/assets/icons/mastercard.svg"
        />
        <img v-if="cardType == 'amex'" class="back-button" src="@/assets/icons/amex.svg" />
        <img
          v-if="cardType == 'dinnersclub'"
          class="back-button"
          src="@/assets/icons/dinersclub.svg"
        />
        <img
          v-if="cardType == 'hipercard'"
          class="back-button"
          src="@/assets/icons/hipercard.svg"
        />
        <img v-if="cardType == 'elo'" class="back-button" src="@/assets/icons/elo.svg" />
        <img v-if="cardType == 'jcb'" class="back-button" src="@/assets/icons/jcb.svg" />
        <img v-if="cardType == 'aura'" class="back-button" src="@/assets/icons/aura.svg" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreditCard",
  props: {
    number: {
      required: true,
      default: "#### #### #### ####"
    },
    name: {
      required: true,
      default: "Your Name"
    },
    validity: {
      required: true,
      default: "##/##"
    },
    cvv: {
      required: true,
      default: "###"
    },
    cardType: {
      required: true
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.credit-card {
  width: 270px;
  height: 160px;
  background: $yckLightGrey;
  border: 2px solid $yckLightGrey;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .default {
    background: $yckLightGrey;
    border: 2px solid $yckLightGrey;

    label {
      color: $white;
    }
  }

  .dinnersclub {
    background: #ddd;
    border: 2px solid #ddd;

    label {
      color: $white;
    }
  }

  .amex {
    background: #27ade4;
    border: 2px solid #27ade4;

    label {
      color: $white;
    }
  }

  .elo {
    background: #27ade4;
    border: 2px solid #27ade4;

    label {
      color: $white;
    }
  }

  .visa {
    background: #08529e;
    border: 2px solid #08529e;
    border: 1px solid red;
    label {
      color: $white;
    }
  }

  .mastercard {
    background: #bba242;
    border: 2px solid #bba242;

    label {
      color: $white;
    }
  }

  .row {
    display: flex;
    margin: 0;
    height: 40px;

    &:last-child {
      height: 50px;
    }
  }

  .back-button {
    margin-right: 7px;
  }
  .mt-5 {
    margin-top: 30px;
  }

  label {
    text-transform: uppercase;
    font-size: 15px;
    color: $white;
    padding: 6px 10px;
  }

  img {
    width: 50px;
    height: 50px;
    margin-left: auto;
  }
}
</style>
