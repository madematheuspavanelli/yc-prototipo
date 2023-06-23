<template>
  <ValidationObserver slim ref="validator">
    <form @submit.prevent="submit" autocomplete="off" class="flex-row w-100">
      <div class="subtitle">
        <span> {{ $t("message.symptomsCovid") }} </span>
      </div>
      <div class="symptomns" v-for="symptom in options" :key="symptom.name">
        <app-radio-group
          :name="symptom.name"
          :label="symptom.label"
          v-model="symptom.value"
          :alignCenter="false"
          validationRules="required"
        />
        <app-totem-input
          v-show="symptom.value === 'Y'"
          keyboardLayout="numeric"
          :mask="['##/##/####']"
          :keyboardConfirmText="$t('keyboard.ok')"
          :placeholder="$t('message.dateFormat')"
          :name="`${symptom.name}-date`"
          :label="`${$t('message.when')}*`"
          v-model="symptom.date"
          :validationRules="symptom.value === 'Y' ? 'required|date' : ''"
        />
      </div>
      <span class="required-text" v-show="hasSomeSymptom">{{ $t("message.requiredField") }}</span>
      <div class="btn-container">
        <b-button type="submit" variant="primary">{{ $t("message.next") }}</b-button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
export default {
  name: "SymptomModal",
  data() {
    return {
      options: [
        {
          name: "fever",
          label: this.$t("message.symptomFever"),
          value: null,
          date: null
        },
        {
          name: "soreThroat",
          label: this.$t("message.symptomThroat"),
          value: null,
          date: null
        },
        {
          name: "cough",
          label: this.$t("message.symptomCough"),
          value: null,
          date: null
        },
        {
          name: "shortnessOfBreath",
          label: this.$t("message.symptomBreathe"),
          value: null,
          date: null
        },
        {
          name: "muscleAche",
          label: this.$t("message.symptomMuscle"),
          value: null,
          date: null
        },
        {
          name: "diarrhea",
          label: this.$t("message.symptomDiarrhea"),
          value: null,
          date: null
        }
      ]
    };
  },
  computed: {
    hasSomeSymptom() {
      return this.options.some(symptom => symptom.value === "Y");
    }
  },
  methods: {
    submit() {
      this.$refs.validator.validate().then(res => {
        if (res) {
          const data = {};
          this.options.forEach(symptom => {
            data[symptom.name] = {
              mainQuestion: symptom.value,
              when: this.formatDate(symptom.date)
            };
          });
          this.$emit("next", data);
        } else {
          this.$alert("warning", this.$t("alert.invalidFields"));
        }
      });
    },
    getDateString(date) {
      return (date || "")
        .split("/")
        .reverse()
        .join("-");
    },
    formatDate(date) {
      return `${this.getDateString(date)}T00:00:00`;
    }
  }
};
</script>
<style lang="scss" scoped>
.subtitle {
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 2rem;
  max-width: 700px;
  width: 100%;
}

.symptomns {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1.5rem;
  margin-bottom: 1.5rem;
  width: calc(100% / 3);
}

.flex-row {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
</style>
