<template>
  <app-page
    :pageTitle="$t('message.address')"
    :isLoading="isLoading"
    variant="top-bottom"
    showRequired
  >
    <ValidationObserver slim ref="validator">
      <b-form @submit.prevent="submitHandler" autocomplete="off" class="w-100 mt-5">
        <keyboard-flow v-slot="{ nextFieldHandler }" @done="submitHandler">
          <div class="d-flex">
            <app-totem-input
              name="country"
              keyboardLayout="name"
              :label="`${$t('message.country')}*`"
              v-model="country"
              validationRules="required"
              class="flex-grow-1 mr-5"
              @confirmed="nextFieldHandler($refs.flow_1)"
            />
            <app-totem-input
              name="cep"
              keyboardLayout="numeric"
              :mask="zipMask"
              :label="`${$t('message.cep')}*`"
              v-model="cep"
              :validationRules="zipValidation"
              ref="flow_1"
              class="flex-grow-1"
              @confirmed="callCEP(nextFieldHandler)"
            />
          </div>
          <app-totem-input
            name="street"
            keyboardLayout="name"
            :label="`${$t('message.address')}*`"
            v-model="street"
            ref="flow_2"
            validationRules="required"
            @confirmed="nextFieldHandler($refs.flow_3)"
          />
          <div class="d-flex">
            <app-totem-input
              name="number"
              keyboardLayout="numeric"
              :label="`${$t('message.addressNumber')}*`"
              v-model="number"
              ref="flow_3"
              class="flex-grow-1G mr-5"
              validationRules="required"
              @confirmed="nextFieldHandler($refs.flow_4)"
            />
            <app-totem-input
              name="complement"
              keyboardLayout="fullLayout"
              :label="`${$t('message.addressComplement')}`"
              v-model="complement"
              ref="flow_4"
              class="flex-grow-1"
              @confirmed="nextFieldHandler($refs.flow_5)"
            />
          </div>
          <app-totem-input
            name="neighborhood"
            keyboardLayout="name"
            :label="`${$t('message.neighborhood')}*`"
            v-model="neighborhood"
            ref="flow_5"
            validationRules="required"
            @confirmed="nextFieldHandler($refs.flow_6)"
          />
          <div class="d-flex">
            <app-totem-input
              name="city"
              keyboardLayout="name"
              :label="`${$t('message.city')}*`"
              v-model="city"
              ref="flow_6"
              validationRules="required"
              class="flex-grow-1 mr-5"
              @confirmed="nextFieldHandler($refs.flow_7)"
            />
            <app-totem-input
              name="state"
              keyboardLayout="name"
              :label="`${$t('message.state')}*`"
              v-model="state"
              ref="flow_7"
              validationRules="required"
              class="flex-grow-1"
              @confirmed="nextFieldHandler"
            />
          </div>
        </keyboard-flow>
        <div>
          <AppTerms v-model="terms" />
        </div>
        <div class="btn-container">
          <b-button type="submit" variant="primary">{{ $t("message.next") }}</b-button>
        </div>
      </b-form>
    </ValidationObserver>
  </app-page>
</template>

<script>
import AppTerms from "@/components/Base/AppTerms.vue";

export default {
  name: "AddressForm",
  components: {
    AppTerms
  },
  data() {
    return {
      cep: null,
      street: null,
      number: null,
      complement: null,
      neighborhood: null,
      city: null,
      state: null,
      country: null,
      isLoading: false,
      terms: false
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
    shouldAnswerCovidForm() {
      return this.$store.getters.hotelSettingUseCovidForm;
    },
    nextStepRoute() {
      return this.shouldAnswerCovidForm ? "CovidForm" : "Signature";
    },
    userAddress() {
      return this.$store.getters.getUserAddress;
    },
    userProfile() {
      return this.$store.getters.userProfile;
    },
    photoId() {
      return this.$store.getters.getPhotoId ? this.$store.getters.getPhotoId : 0;
    },
    documentData() {
      return this.$store.getters.documentData;
    },
    shouldGetUserDocument() {
      return this.$store.getters.hotelSettingUseDocumentPhoto;
    },
    isBrazil() {
      return this.country === "BRASIL";
    },
    zipMask() {
      return this.isBrazil ? ["#####-###"] : [];
    },
    zipValidation() {
      return this.isBrazil ? "required|min-length:9" : "required";
    }
  },
  methods: {
    loadData() {
      if (!this.userAddress) {
        this.country = "BRASIL";
        return;
      }
      const {
        cep,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipCode,
        address,
        province,
        country
      } = this.userAddress;
      this.cep = cep || zipCode;
      this.street = street || address;
      this.number = number;
      this.complement = complement;
      this.neighborhood = neighborhood;
      this.city = city;
      this.state = state || province;
      this.country = country || "BRASIL";
    },
    submitHandler() {
      this.$refs.validator.validate().then(res => {
        if (res) {
          this.isLoading = true;
          this.saveUserAddress();
          const form = this.getSendForm();
          if (this.userId !== null) {
            this.updateUser(form);
            if (this.isPrincipal === "S") {
              this.updateUser(form);
            } else {
              this.$router.push({ name: "Signature" });
            }
          } else {
            this.registerNewUser(form);
          }
        } else {
          this.$alert("warning", this.$t("alert.invalidFields"));
        }
      });
    },
    getSendForm() {
      const location = { ...this.userAddress };
      const profile = { ...this.userProfile, photoId: this.photoId };
      const reservation = {
        guestId: this.guestId,
        bookingId: this.bookingId
      };
      delete profile.documentType;
      return {
        location,
        profile,
        reservation
      };
    },
    validateForm() {
      return new Promise((resolve, reject) => {
        if (
          !this.cep ||
          !this.street ||
          !this.number ||
          !this.neighborhood ||
          !this.city ||
          !this.state
        ) {
          reject(this.$t("alert.fillRequired"));
          return;
        }
        resolve();
      });
    },
    registerNewUser(form) {
      this.$API.users
        .newUser(form)
        .then(response => {
          const { userId } = response.data;
          this.$store.dispatch("SET_USER_ID", { value: userId });
          this.associateDocumentHandler();
        })
        .catch(() => {
          this.isLoading = false;
          this.$alert("error", this.$t("alert.tryAgain"));
        });
    },
    updateUser(form) {
      this.$API.users
        .updateUser(form, this.userId)
        .then(() => {
          this.associateDocumentHandler();
        })
        .catch(() => {
          this.isLoading = false;
          this.$alert("error", this.$t("alert.tryAgain"));
        });
    },
    associateDocumentHandler() {
      if (!this.shouldGetUserDocument) {
        this.formCompletedHandler();
        return;
      }
      const params = {
        document: this.documentData
      };
      this.$API.users
        .registerDocument(this.userId, params)
        .then(() => {
          this.formCompletedHandler();
        })
        .catch(() => {
          this.isLoading = false;
          this.$alert("error", this.$t("alert.tryAgain"));
        });
    },
    formCompletedHandler() {
      this.$router.push({ name: this.nextStepRoute });
    },
    callCEP(nextFieldHandler) {
      if (!this.isBrazil) {
        nextFieldHandler(this.$refs.flow_2);
        return;
      }
      if ((this.cep || "").length === 9) {
        const searchParam = this.cep.replace(/\D/g, "");

        fetch(`https://viacep.com.br/ws/${searchParam}/json/`).then(response => {
          if (!response.ok) {
            return;
          }
          response.json().then(data => {
            this.loadFormFromCep(data);
          });
        });
      }
    },
    loadFormFromCep(data) {
      if (data.erro) {
        return;
      }
      const { logradouro, uf, localidade, bairro } = data;
      this.street = logradouro;
      this.neighborhood = bairro;
      this.city = localidade;
      this.state = uf;
    },
    saveUserAddress() {
      const data = {
        zipCode: this.cep,
        address: this.street,
        number: this.number,
        complement: this.complement,
        neighborhood: this.neighborhood,
        city: this.city,
        province: this.state,
        country: this.country
      };
      this.$store.dispatch("SET_USER_ADDRESS", { value: data });
    },
    returnHandler() {
      this.saveUserAddress();
      this.$router.back();
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>
