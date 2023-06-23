<template>
  <b-card class="form" bg-variant="dark" no-body>
    <b-form @submit.prevent="submitHandler">
      <b-form-group
        id="pet-group"
        :label="$t('message.optionalSettingsPetOption')"
        v-slot="{ ariaDescribedby }"
      >
        <b-form-radio
          v-model="form.pet"
          :aria-describedby="ariaDescribedby"
          size="lg"
          name="pet"
          :value="true"
          stacked
          @change="updateSettings"
          >{{ $t("message.yes") }}</b-form-radio
        >
        <b-form-radio
          v-model="form.pet"
          :aria-describedby="ariaDescribedby"
          name="pet"
          :value="false"
          size="lg"
          stacked
          @change="updateSettings"
          >{{ $t("message.no") }}</b-form-radio
        >
      </b-form-group>
      <b-form-group
        id="covid-group"
        :label="$t('message.optionalSettingsCovidOption')"
        v-slot="{ ariaDescribedby }"
      >
        <b-form-radio
          v-model="form.covid"
          :aria-describedby="ariaDescribedby"
          size="lg"
          name="covid"
          :value="true"
          stacked
          @change="updateSettings"
          >{{ $t("message.yes") }}</b-form-radio
        >
        <b-form-radio
          v-model="form.covid"
          :aria-describedby="ariaDescribedby"
          name="covid"
          :value="false"
          size="lg"
          stacked
          @change="updateSettings"
          >{{ $t("message.no") }}</b-form-radio
        >
      </b-form-group>

      <b-form-group
        id="paymentByGuest-group"
        :label="$t('message.optionalSettingsPaymentByGuest')"
        v-slot="{ ariaDescribedby }"
      >
        <b-form-radio
          v-model="form.paymentByGuest"
          :aria-describedby="ariaDescribedby"
          size="lg"
          name="paymentByGuest"
          :value="true"
          stacked
          @change="updateSettings"
          >{{ $t("message.yes") }}</b-form-radio
        >
        <b-form-radio
          v-model="form.paymentByGuest"
          :aria-describedby="ariaDescribedby"
          name="paymentByGuest"
          :value="false"
          size="lg"
          stacked
          @change="updateSettings"
          >{{ $t("message.no") }}</b-form-radio
        >
      </b-form-group>

      <b-form-group
        id="pay-group"
        :label="$t('message.optionalSettingsPayOption')"
        v-slot="{ ariaDescribedby }"
      >
        <b-form-radio
          v-model="form.pay"
          :aria-describedby="ariaDescribedby"
          size="lg"
          name="pay"
          :value="true"
          stacked
          @change="updateSettings"
          >{{ $t("message.yes") }}</b-form-radio
        >
        <b-form-radio
          v-model="form.pay"
          :aria-describedby="ariaDescribedby"
          name="pay"
          :value="false"
          size="lg"
          stacked
          @change="updateSettings"
          >{{ $t("message.no") }}</b-form-radio
        >
      </b-form-group>
      <b-form-group
        id="signature-group"
        :label="$t('message.optionalSettingsSignatureOption')"
        v-slot="{ ariaDescribedby }"
      >
        <b-form-radio
          v-model="form.signature"
          :aria-describedby="ariaDescribedby"
          size="lg"
          name="signature"
          :value="true"
          stacked
          @change="updateSettings"
          >{{ $t("message.yes") }}</b-form-radio
        >
        <b-form-radio
          v-model="form.signature"
          :aria-describedby="ariaDescribedby"
          name="signature"
          :value="false"
          size="lg"
          stacked
          @change="updateSettings"
          >{{ $t("message.no") }}</b-form-radio
        >
      </b-form-group>
      <b-form-group
        id="document-group"
        :label="$t('message.optionalSettingsDocumentOption')"
        v-slot="{ ariaDescribedby }"
      >
        <b-form-radio
          v-model="form.document"
          :aria-describedby="ariaDescribedby"
          size="lg"
          name="document"
          :value="true"
          stacked
          @change="updateSettings"
          >{{ $t("message.yes") }}</b-form-radio
        >
        <b-form-radio
          v-model="form.document"
          :aria-describedby="ariaDescribedby"
          name="document"
          :value="false"
          size="lg"
          stacked
          @change="updateSettings"
          >{{ $t("message.no") }}</b-form-radio
        >
      </b-form-group>
      <b-form-group
        id="document-group"
        :label="$t('message.doFacialRecognition')"
        v-slot="{ ariaDescribedby }"
      >
        <b-form-radio
          v-model="form.facial"
          :aria-describedby="ariaDescribedby"
          size="lg"
          name="facial"
          :value="true"
          stacked
          @change="updateSettings"
          >{{ $t("message.yes") }}</b-form-radio
        >
        <b-form-radio
          v-model="form.facial"
          :aria-describedby="ariaDescribedby"
          name="facial"
          :value="false"
          size="lg"
          stacked
          @change="updateSettings"
          >{{ $t("message.no") }}</b-form-radio
        >
      </b-form-group>
      <b-form-group
        id="key-group"
        :label="$t('message.updateKeyOption')"
        v-slot="{ ariaDescribedby }"
      >
        <b-form-radio
          v-model="form.key"
          :aria-describedby="ariaDescribedby"
          size="lg"
          name="key"
          :value="true"
          stacked
          @change="updateSettings"
          >{{ $t("message.yes") }}</b-form-radio
        >
        <b-form-radio
          v-model="form.key"
          :aria-describedby="ariaDescribedby"
          name="key"
          :value="false"
          size="lg"
          stacked
          @change="updateSettings"
          >{{ $t("message.no") }}</b-form-radio
        >
      </b-form-group>
      <b-form-group
        id="statement-group"
        :label="$t('message.consultStatementOption')"
        v-slot="{ ariaDescribedby }"
      >
        <b-form-radio
          v-model="form.statement"
          :aria-describedby="ariaDescribedby"
          size="lg"
          name="statement"
          :value="true"
          stacked
          @change="updateSettings"
          >{{ $t("message.yes") }}</b-form-radio
        >
        <b-form-radio
          v-model="form.statement"
          :aria-describedby="ariaDescribedby"
          name="statement"
          :value="false"
          size="lg"
          stacked
          @change="updateSettings"
          >{{ $t("message.no") }}</b-form-radio
        >
      </b-form-group>
    </b-form>
    <transition name="fade">
      <app-loader v-if="isLoading" :isAdmin="true" />
    </transition>
  </b-card>
</template>

<script>
export default {
  name: "OptionalSettings",
  data() {
    return {
      form: {
        pet: null,
        covid: null,
        pay: null,
        paymentByGuest: null,
        signature: null,
        document: null,
        facial: null,
        key: null,
        statement: null
      },
      isLoading: true
    };
  },
  methods: {
    loadData() {
      // this.isLoading = true;
      this.$API.admin.getHotelSettings().then(data => {
        this.form.pet = data.configs.includePreCheckinPet || false;
        this.form.covid = data.configs.covid || false;
        this.form.pay = data.configs.payOnCheckin || false;
        this.form.paymentByGuest = data.configs.paymentByGuest || false;
        this.form.signature = data.configs.signature || false;
        this.form.document = data.configs.documentPhoto || false;
        this.form.facial = data.configs.includeFaceRekognition || false;
        this.isLoading = false;
      });
    },
    updateSettings() {
      const data = {
        configs: {
          includePreCheckinPet: this.form.pet,
          includeFaceRekognition: this.form.facial,
          covid: this.form.covid,
          signature: this.form.signature,
          documentPhoto: this.form.document,
          payOnCheckin: this.form.pay,
          paymentByGuest: this.form.paymentByGuest,
          key: this.form.key,
          statement: this.form.statement
        }
      };
      this.$API.admin.updateHotelSettings(data);
    }
  },
  mounted() {
    // this.loadData();
    this.isLoading = false;
  }
};
</script>

<style lang="scss" scoped>
.form {
  padding: 20px;

  .form-group {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
