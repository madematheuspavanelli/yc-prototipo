<template>
  <app-page :pageTitle="$t('message.confirmDetails')" showRequired>
    <ValidationObserver slim ref="validator">
      <b-form @submit.prevent="submitHandler" autocomplete="off" class="w-100">
        <keyboard-flow v-slot="{ nextFieldHandler }" @done="submitHandler">
          <div class="document-line">
            <app-totem-select
              v-if="useDocumentTypeField"
              name="documentType"
              :label="`${$t('message.documentType')}*`"
              :options="documentTypeData"
              v-model="documentType"
              validationRules="required"
              @confirmed="nextFieldHandler($refs.flow_1)"
            />
            <app-totem-input
              name="documentNumber"
              keyboardLayout="numeric"
              :mask="documentMask"
              :label="`${$t('message.invoiceDoc')}*`"
              v-model="document"
              ref="flow_1"
              :validationRules="documentValidation"
              @confirmed="nextFieldHandler($refs.flow_2)"
              @blur="tryGetUserByCpf"
            />
          </div>
          <app-totem-input
            name="name"
            keyboardLayout="name"
            :label="`${$t('message.fullName')}*`"
            v-model="name"
            ref="flow_2"
            validationRules="required|fullName"
            @confirmed="nextFieldHandler($refs.flow_3)"
          />
          <app-totem-input
            name="birthDate"
            keyboardLayout="numeric"
            :mask="['##/##/####']"
            :placeholder="$t('message.dateFormat')"
            :label="`${$t('message.birth')}*`"
            v-model="birthDate"
            ref="flow_3"
            validationRules="required|date"
            @confirmed="nextFieldHandler($refs.flow_4)"
          />
          <app-totem-select
            name="gender"
            :label="`${$t('message.genre')}*`"
            :options="genderData"
            v-model="gender"
            ref="flow_4"
            validationRules="required"
            @confirmed="nextFieldHandler($refs.flow_5)"
          />
          <app-totem-input
            :telLib="true"
            name="phone"
            keyboardLayout="cel"
            :label="`${$t('message.celNumber')}*`"
            v-model="phoneNumber"
            validationRules="required|min-length:6"
            ref="flow_5"
            @confirmed="nextFieldHandler($refs.flow_6)"
          />
          <app-totem-input
            placement="top"
            name="email"
            keyboardLayout="email"
            :label="`${$t('message.email')}*`"
            v-model="email"
            ref="flow_6"
            validationRules="required|email"
            @confirmed="nextFieldHandler"
          />
        </keyboard-flow>
        <div class="btn-container">
          <b-button type="submit" variant="primary">{{ $t("message.next") }}</b-button>
        </div>
      </b-form>
    </ValidationObserver>
  </app-page>
</template>

<script>
export default {
  name: "PersonalForm",
  data() {
    return {
      name: "",
      birthDate: "",
      gender: "",
      document: "",
      phoneNumber: "",
      email: "",
      documentType: "",
      documentTypeData: [
        { label: this.$t("message.cpf"), value: "cpf" },
        { label: this.$t("message.passport"), value: "passport" }
      ],
      genderData: [
        { label: this.$t("message.male"), value: "M" },
        { label: this.$t("message.female"), value: "F" },
        { label: this.$t("message.neutral"), value: "O" }
      ]
    };
  },
  computed: {
    newUserName() {
      return this.$store.getters.newUserName;
    },
    userProfile() {
      return this.$store.getters.userProfile;
    },
    dateString() {
      return this.birthDate
        .split("/")
        .reverse()
        .join("-");
    },
    useBrazilianPhone() {
      return this.$i18n.locale === "pt-BR";
    },
    userId() {
      return this.$store.getters.getUserId;
    },
    useDocumentTypeField() {
      return this.userId === null;
    },
    computedReFlow3() {
      return this.useDocumentTypeField ? this.$refs.flow_3_optional : this.$refs.flow_3;
    },
    documentMask() {
      return this.documentType.value === "cpf" ? ["###.###.###-##"] : [];
    },
    documentValidation() {
      return this.documentType.value === "cpf" ? "required|cpf" : "required";
    }
  },
  methods: {
    tryGetUserByCpf() {
      this.$API.users
        .getUserByCPF(
          this.document
            .replaceAll(".", "")
            .replace(",", "")
            .replace("-", "")
        )
        .then(response => {
          this.$store.dispatch("SET_USER_PROFILE", { value: response.data.profile });
          this.$store.dispatch("SET_USER_ADDRESS", { value: response.data.address });
        })
        .then(() => {
          this.loadData();
        });
      // .catch(() => {
      //   this.isLoading = false;
      //   this.$alert("error", this.$t("alert.tryAgain"));
      // });
    },
    loadData() {
      if (this.newUserName) {
        this.name = this.newUserName;
      }
      if (!this.userProfile) {
        this.setDocumentDefaultOption();
        return;
      }
      const {
        name,
        birthDate,
        gender,
        document,
        phone,
        phoneNumber,
        email,
        firstName,
        lastName,
        documentNumber
      } = this.userProfile;
      this.name = name || `${firstName || ""} ${lastName || ""}`;
      this.birthDate = this.$d(new Date(birthDate), "short");
      this.gender = this.getGender(gender);
      this.document = document || documentNumber;
      // this.phoneNumber = `+${phoneNumber.countryCode || ""} (${phoneNumber.areaCode ||
      //   ""}) ${phoneNumber.phoneNumber || ""}`;

      if (phoneNumber)
        this.phoneNumber = `${phoneNumber.countryCode || ""} ${phoneNumber.areaCode ||
          ""} ${phoneNumber.phoneNumber || ""}`.trim();
      else if (phone)
        this.phoneNumber = `${phone.countryCode || ""} ${phone.areaCode ||
          ""} ${phone.phoneNumber || ""}`.trim();

      this.email = email;
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
      this.documentType = this.documentTypeData[0];
    },
    getGender(value) {
      return this.genderData.find(item => item.value === value) || null;
    },
    submitHandler() {
      this.$refs.validator.validate().then(res => {
        if (res) {
          this.saveUserForm();
        } else {
          this.$alert("warning", this.$t("alert.invalidFields"));
        }
      });
    },
    saveUserForm() {
      const firstName = this.name.split(" ")[0];
      const lastName = this.name.substr(this.name.indexOf(" ") + 1);
      const birthDate = `${this.dateString}T00:00:00`;
      // const phoneNumber = this.useBrazilianPhone ? this.phoneNumber.substring(9) : this.phoneNumber;
      // const areaCode = this.useBrazilianPhone ? this.phoneNumber.split(")")[0].substring(5) : null;
      // const countryCode = this.useBrazilianPhone ? this.phoneNumber.substring(1, 3) : null;

      const countryCode = this.useBrazilianPhone ? this.phoneNumber.split(" ")[0] : null;
      const areaCode = this.useBrazilianPhone ? this.phoneNumber.split(" ")[1] : null;
      const phoneNumber = this.useBrazilianPhone
        ? this.phoneNumber.trim().substring(countryCode.length + areaCode.length + 2)
        : this.phoneNumber.trim();

      const gender = this.gender.value;
      const documentNumber = this.document.replace(/\D/g, "");
      const email = this.email;
      const documentType = this.documentType;

      const data = {
        firstName,
        lastName,
        birthDate,
        gender,
        documentType,
        documentNumber,
        phone: {
          phoneNumber,
          areaCode,
          countryCode
        },
        email
      };
      this.$store.dispatch("SET_USER_PROFILE", { value: data });
      this.$router.push({ name: "AddressForm" });
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style lang="scss" scoped>
.document-line {
  display: flex;

  & > * {
    flex-grow: 1;
    margin-right: 20px;
    min-width: calc((100% - 20px) / 2);

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
