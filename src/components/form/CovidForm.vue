<template>
  <app-page
    :pageTitle="$t('message.formCorona')"
    :isLoading="isLoading"
    useCustomClick
    variant="top-bottom"
    @return-click="returnHandler"
  >
    <TravelForm v-if="showTravelForm" @next="submittedTravelFormHandler" />
    <PersonForm v-if="showPersonForm" @next="submittedPersonFormHandler" />
    <SymptomForm v-if="showSymptomForm" @next="submittedSymptomFormHandler" />
  </app-page>
</template>

<script>
import TravelForm from "@/components/covid/TravelForm";
import PersonForm from "@/components/covid/PersonForm";
import SymptomForm from "@/components/covid/SymptomForm";

export default {
  name: "CovidForm",
  components: {
    TravelForm,
    PersonForm,
    SymptomForm
  },
  data() {
    return {
      form: {},
      showTravelForm: true,
      showPersonForm: false,
      showSymptomForm: false,
      isLoading: false
    };
  },
  computed: {
    userId() {
      return this.$store.getters.getUserId;
    }
  },
  methods: {
    submittedTravelFormHandler(value) {
      this.form.questionOne = value;
      this.showTravelForm = false;
      this.showPersonForm = true;
    },
    submittedPersonFormHandler(value) {
      this.form.questionTwo = value;
      this.showPersonForm = false;
      this.showSymptomForm = true;
    },
    submittedSymptomFormHandler(value) {
      this.form.questionThree = value;
      this.formCompletedHandler();
    },
    formCompletedHandler() {
      this.isLoading = true;
      const data = {
        userId: this.userId,
        answer: JSON.stringify(this.form)
      };

      this.$API.hotel
        .covidForm(data)
        .then(() => {
          this.$router.push({ name: "DataConfirmation" });
        })
        .catch(() => {
          this.isLoading = false;
          this.$alert("error", this.$t("alert.tryAgain"));
        });
    },
    returnHandler() {
      if (this.showSymptomForm) {
        this.showSymptomForm = false;
        this.showPersonForm = true;
      } else if (this.showPersonForm) {
        this.showPersonForm = false;
        this.showTravelForm = true;
      } else {
        this.$router.back();
      }
    }
  }
};
</script>
