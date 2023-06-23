<template>
  <PreCheckinStructure
    :dotActive="'six'"
    :backButton="true"
    :form="true"
    :isLoading="isLoading"
    class="precheckin-address"
  >
    <div class="title" slot="title">
      <span>{{ $t("message.confirmDetails") }}</span>
    </div>
    <div slot="center">
      <ValidationObserver slim ref="validator">
        <b-form autocomplete="off" @submit.prevent="submitHandler">
          <b-card no-body>
            <app-input
              name="country"
              :label="`${$t('message.country')}*`"
              v-model="country"
              validationRules="required"
            />
            <app-input
              name="cep"
              :mask="zipMask"
              :label="`${$t('message.cep')}*`"
              v-model="cep"
              :validationRules="zipValidation"
              @input="callCEP"
            />
            <app-input
              name="street"
              :label="`${$t('message.address')}*`"
              v-model="address"
              validationRules="required"
            />
            <app-input
              name="number"
              :label="`${$t('message.addressNumber')}*`"
              :inputType="'number'"
              v-model="addressNumber"
              validationRules="required"
            />
            <app-input
              name="complement"
              :label="`${$t('message.addressComplement')}`"
              v-model="addressComplement"
            />
            <app-input
              name="neighborhood"
              :label="`${$t('message.neighborhood')}*`"
              v-model="neighborhood"
              validationRules="required"
            />
            <app-input
              name="city"
              :label="`${$t('message.city')}*`"
              v-model="city"
              validationRules="required"
            />
            <app-input
              name="state"
              :label="`${$t('message.state')}*`"
              v-model="state"
              validationRules="required"
            />
            <div class="mt-5">
              <AppTerms v-model="terms" />
            </div>
          </b-card>
          <div class="btn-container">
            <button type="submit" class="squared">{{ $t("message.next") }}</button>
          </div>
        </b-form>
      </ValidationObserver>
    </div>
  </PreCheckinStructure>
</template>
<script>
import PreCheckinStructure from "@/components/PreCheckinStructure";
import AppTerms from "@/components/Base/AppTerms.vue";

export default {
  name: "Address",
  components: {
    PreCheckinStructure,
    AppTerms
  },
  data() {
    return {
      cep: null,
      address: null,
      addressNumber: null,
      addressComplement: null,
      neighborhood: null,
      city: null,
      state: null,
      country: null,
      submitted: false,
      isLoading: false,
      terms: false
    };
  },
  computed: {
    userId() {
      return this.$store.getters.precheckinUserId;
    },
    guestId() {
      return this.$store.getters.precheckinGuestId;
    },
    reservationId() {
      return this.$store.getters.precheckinReservationId;
    },
    documentData() {
      return this.$store.getters.precheckinDocumentData;
    },
    userData() {
      return this.$store.getters.precheckinUserForm;
    },
    locationData() {
      return this.$store.getters.precheckinUserAddress;
    },
    photoId() {
      return this.$store.getters.precheckinPhotoId;
    },
    shouldGetPetInfo() {
      return this.$store.getters.hotelSettingUsePreCheckinPet;
    },
    reservationData() {
      return {
        guestId: this.guestId,
        reservationNumber: this.reservationId
      };
    },
    form() {
      const data = {
        location: this.locationData,
        profile: { ...this.userData, photoId: this.photoId },
        reservation: this.reservationData
      };

      if (this.shouldGetPetInfo) {
        data.extraInfo = {
          hasPet: data.profile.pet
        };
      }

      if (typeof data.profile.gender !== "string") {
        data.profile.gender = data.profile.gender.value;
      }

      delete data.profile.pet;
      delete data.profile.phoneNumber;
      delete data.profile.documentType;

      return data;
    },
    isBrazil() {
      return (this.country || "").toUpperCase() === "BRASIL";
    },
    zipMask() {
      return this.isBrazil ? ["#####-###"] : [];
    },
    zipValidation() {
      return this.isBrazil ? "required|min-length:9" : "required";
    }
  },
  methods: {
    submitHandler() {
      this.isLoading = true;
      this.submitted = true;
      this.$refs.validator.validate().then(res => {
        if (res) {
          const data = this.getSendData();
          this.saveAddressForm(data);
          if (!this.userId) {
            this.registerNewUser();
          } else {
            this.updateUser();
          }
        } else {
          this.$alert("warning", this.$t("alert.invalidFields"));
          this.isLoading = false;
        }
      });
    },
    getSendData() {
      return {
        zipCode: this.cep,
        address: this.address,
        number: this.addressNumber,
        complement: this.addressComplement,
        neighborhood: this.neighborhood,
        city: this.city,
        province: this.state,
        country: this.country
      };
    },
    saveAddressForm(data) {
      this.$store.dispatch("SET_PRECHECKIN_USER_ADDRESS", { value: data });
    },
    registerNewUser() {
      this.$API.users
        .newUser(this.form)
        .then(response => {
          const { userId } = response.data;
          this.$store.dispatch("SET_PRECHECKIN_USER_ID", { value: userId });
          this.associateDocumentHandler();
        })
        .catch(() => {
          this.isLoading = false;
          this.$alert("error", this.$t("alert.tryAgain"));
        });
    },
    updateUser() {
      this.$API.users
        .updateUser(this.form, this.userId)
        .then(() => {
          this.associateDocumentHandler();
        })
        .catch(() => {
          this.isLoading = false;
          this.$alert("error", this.$t("alert.tryAgain"));
        });
    },
    associateDocumentHandler() {
      const params = {
        document: this.documentData
      };
      this.$API.users.registerDocument(this.userId, params).finally(() => {
        this.formCompletedHandler();
      });
    },
    formCompletedHandler() {
      this.submitPrecheckinHandler();
    },
    submitPrecheckinHandler() {
      const params = {
        reserveNumber: this.reservationId,
        userId: this.userId,
        guestId: this.guestId
      };
      this.$API.hotel
        .precheckin(params)
        .then(() => {
          const isRede = this.$store.state.hotel.paymentType === 2;
          if (isRede) {
            this.$router.push({ name: "EndPreCheckin" });
          } else this.$router.push({ name: "CardPreRegistration" });
        })
        .catch(() => {
          this.isLoading = false;
          this.$alert("error", this.$t("alert.tryAgain"));
        });
    },
    callCEP() {
      const zipCode = this.cep;
      if (zipCode != null && zipCode.length == 9) {
        const cep = zipCode
          .split("-")
          .join("")
          .trim();

        fetch("https://viacep.com.br/ws/" + cep + "/json/")
          .then(response => {
            if (response.ok) {
              return response.json();
            }
          })
          .then(data => {
            if (data.erro) {
              this.$alert("warning", this.$t("alert.cepNotFound"));
            } else {
              this.address = data.logradouro;
              this.neighborhood = data.bairro;
              this.city = data.localidade;
              this.state = data.uf;
            }
          });
      }
    },
    loadData() {
      if (!this.locationData) {
        this.country = "BRASIL";
        return;
      }
      const {
        cep,
        zipCode,
        address,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        province,
        country
      } = this.locationData;
      this.cep = cep || zipCode;
      this.address = address || street;
      this.addressNumber = number;
      this.addressComplement = complement;
      this.neighborhood = neighborhood;
      this.city = city;
      this.state = state || province;
      this.country = country || "BRASIL";
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>
<style lang="scss" scoped>
.precheckin-address {
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

    &:last-child {
      margin-bottom: 0;
    }

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

@media screen and (min-width: 300px) {
  .precheckin-address .form-group {
    margin-bottom: 0;
  }

  .credit-card {
    display: none;
  }

  .form-group {
    margin-bottom: 0;
  }

  input,
  select {
    padding: 0 10px;
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
}

@media screen and (min-width: 768px) {
  .precheckin-address {
    overflow-y: auto;
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
        width: calc((100% - 20px) / 2);
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
