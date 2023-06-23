<template>
  <PreCheckinStructure
    :dotActive="'five'"
    :backButton="true"
    :form="true"
    class="precheckin-personal"
  >
    <div class="title" slot="title">
      <span>{{ $t("message.confirmDetails") }}</span>
    </div>
    <div slot="center">
      <ValidationObserver slim ref="validator">
        <b-form autocomplete="off" @submit.prevent="submitHandler">
          <b-card no-body>
            <app-input
              name="name"
              :label="`${$t('message.fullName')}*`"
              v-model="name"
              validationRules="required|fullName"
            />
            <app-input
              name="birth"
              :label="`${$t('message.birth')}*`"
              :mask="['##/##/####']"
              :inputType="'tel'"
              :placeholder="$t('message.dateFormat')"
              v-model="birth"
              validationRules="required|date"
            />
            <app-select
              name="gender"
              :label="`${$t('message.genre')}*`"
              :options="genreOptions"
              v-model="genre"
              validationRules="required"
            />
            <app-select
              v-if="useDocumentTypeField"
              name="documentType"
              :label="`${$t('message.documentType')}*`"
              :options="documentTypeOptions"
              v-model="documentType"
              validationRules="required"
            />
            <app-input
              name="documentNumber"
              :mask="documentMask"
              :label="`${$t('message.invoiceDoc')}*`"
              v-model="document"
              :validationRules="documentValidation"
            />
            <app-input
              name="phone"
              :mask="['+## (##) ####-####', '+## (##) #####-####']"
              :label="`${$t('message.celNumber')}*`"
              :inputType="'tel'"
              v-model="phone"
              validationRules="required|min-length:14"
            />
            <app-input
              name="email"
              :label="`${$t('message.email')}*`"
              v-model="email"
              validationRules="required|email"
            />
            <app-radio-group
              v-if="showPetRadio"
              name="pet"
              :label="$t('message.pet')"
              v-model="pet"
              validationRules="required"
            />
          </b-card>
          <div class="btn-container">
            <button type="submit" class="squared">
              {{ $t("message.next") }}
            </button>
          </div>
        </b-form>
      </ValidationObserver>
    </div>
  </PreCheckinStructure>
</template>
<script>
import PreCheckinStructure from "@/components/PreCheckinStructure";

export default {
  name: "Personal",
  components: {
    PreCheckinStructure
  },
  data() {
    return {
      name: null,
      birth: null,
      genre: null,
      document: null,
      phone: null,
      email: null,
      pet: null,
      documentType: "",
      genreOptions: [
        { label: this.$t("message.male"), value: "M" },
        { label: this.$t("message.female"), value: "F" }
      ],
      documentTypeOptions: [
        { label: this.$t("message.cpf"), value: "cpf" },
        { label: this.$t("message.passport"), value: "passport" }
      ],
      submitted: false
    };
  },
  computed: {
    dateString() {
      return this.birth
        .split("/")
        .reverse()
        .join("-");
    },
    useBrazilianPhone() {
      return this.$i18n.locale === "pt-BR";
    },
    showPetRadio() {
      return this.$store.getters.hotelSettingUsePreCheckinPet;
    },
    userProfile() {
      return this.$store.getters.precheckinUserForm;
    },
    userId() {
      return this.$store.getters.precheckinUserId;
    },
    useDocumentTypeField() {
      return this.userId === null;
    },
    documentMask() {
      return this.documentType.value === "cpf" ? ["###.###.###-##"] : [];
    },
    documentValidation() {
      return this.documentType.value === "cpf" ? "required|cpf" : "required";
    },
    getDocumentData() {
      return this.$store.getters.document;
    }
  },
  methods: {
    submitHandler() {
      this.submitted = true;
      this.$refs.validator.validate().then(res => {
        if (res) {
          const data = this.getSendData();
          this.saveUserForm(data);
          this.$router.push({ name: "Address" });
        } else {
          this.$alert("warning", this.$t("alert.invalidFields"));
        }
      });
    },
    getSendData() {
      // const phoneNumber = this.useBrazilianPhone ? this.phone.substring(9) : this.phone;
      // const areaCode = this.useBrazilianPhone ? this.phone.split(")")[0].substring(5) : null;
      // const countryCode = this.useBrazilianPhone ? this.phone.substring(1, 3) : null;

      const countryCode = this.useBrazilianPhone ? this.phone.split(" ")[0] : null;
      const areaCode = this.useBrazilianPhone ? this.phone.split(" ")[1] : null;
      const phoneNumber = this.useBrazilianPhone
        ? this.phone.substring(countryCode.length + areaCode.length + 2)
        : this.phone;

      const firstName = this.name.split(" ")[0];
      const lastName = this.name.substr(this.name.indexOf(" ") + 1);
      const birthDate = `${this.dateString}T00:00:00`;
      const gender = this.genre;
      const documentType = this.documentType;

      return {
        firstName,
        lastName,
        phone: {
          phoneNumber,
          areaCode,
          countryCode
        },
        birthDate,
        gender,
        documentNumber: this.document,
        email: this.email,
        pet: this.pet === "Y",
        documentType
      };
    },
    saveUserForm(data) {
      data.documentNumber = data.documentNumber.replace(/\D/g, "");
      const { areaCode, countryCode, phoneNumber } = data.phone;
      // data.phoneNumber = `${countryCode} (${areaCode}) ${phoneNumber}`;
      data.phoneNumber = `${countryCode} ${areaCode} ${phoneNumber}`;
      this.$store.dispatch("SET_PRECHECKIN_USER_PROFILE", { value: data });
    },
    loadData() {
      if (!this.userProfile) {
        this.setDocumentDefaultOption();
        return;
      }
      const {
        name,
        firstName,
        lastName,
        email,
        gender,
        document,
        documentNumber,
        birthDate,
        phoneNumber
      } = this.userProfile;

      this.name = name ? name : `${firstName || ""} ${lastName || ""}`;
      this.email = email;
      // this.genre = gender;
      this.genre = this.getGender(gender);
      this.document = document || documentNumber;
      // this.phone = this.phoneNumber
      // .trim()
      // .substring(4)
      // .replace(/\s/g, "");
      this.phone = `+${phoneNumber.countryCode || ""} (${phoneNumber.areaCode ||
        ""}) ${phoneNumber.phoneNumber || ""}`;

      if (birthDate) {
        this.birth = this.$d(new Date(birthDate), "short");
      }
      this.setDocumentType();
    },
    setDocumentType() {
      const { documentType } = this.userProfile;
      if (documentType) {
        this.documentType = documentType;
      } else {
        this.setDocumentDefaultOption();
      }
    },
    setDocumentDefaultOption() {
      if (this.getDocumentData.itens.passportCode) {
        this.name = this.getDocumentData.itens.name + " " + this.getDocumentData.itens.lastName;
        this.document = this.getDocumentData.itens.passportCode;
        this.birth = this.getDocumentData.itens.birthDay;
        this.documentType = this.documentTypeOptions[1];
      } else {
        this.name = this.getDocumentData.itens.name;
        this.document = this.getDocumentData.itens.cpf;
        this.birth = this.getDocumentData.itens.birthDay;
        this.documentType = this.documentTypeOptions[0];
      }
    },
    getGender(value) {
      return this.genreOptions.find(item => item.value === value) || null;
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>
<style lang="scss">
.precheckin-personal {
  .title {
    display: flex;
    flex-direction: column;
    margin: 0 auto;

    span {
      color: $white;
      font-weight: 500;
      text-align: center;
      font-size: 20px;
    }
  }

  &::v-deep {
    .form-group .form-control {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      text-align: start;
      margin-bottom: 20px;
      position: relative;

      &:last-child:not(.email-group) {
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
        font-size: 60px;

        &.custom-select {
          min-width: unset;
        }
      }

      label {
        font-size: 50px;
        margin-bottom: 0;
      }

      .invalid-feedback {
        position: absolute;
      }
    }
  }

  .btn-container {
    display: flex;
    margin-top: 10px;
  }

  .card {
    padding: 20px;
    /* margin: 20px 0; */
    border-radius: 0.4rem;
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  }

  .custom-control-input:checked ~ .custom-control-label::before,
  .custom-control-input:not(:disabled):active ~ .custom-control-label::before {
    color: $white;
    background-color: $yckDarkGrey;
    border-color: $yckDarkGrey;
  }

  .custom-control-label {
    &::before,
    &::after {
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

@media screen and (min-width: 768px) {
  .precheckin-personal {
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

        &:last-child:not(.email-group) {
          margin-right: 0;
          width: 100%;
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
  .precheckin-personal {
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
