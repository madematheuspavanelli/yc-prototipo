<template>
  <form @submit.prevent="submit" autocomplete="off" class="w-100">
    <ValidationObserver slim ref="validator">
      <app-radio-group
        name="travel"
        :label="$t('message.recentTravel')"
        v-model="value"
        validationRules="required"
      />
      <keyboard-flow v-slot="{ nextFieldHandler }" v-show="shouldAnswerFields" @done="submit">
        <app-totem-input
          name="country"
          keyboardLayout="name"
          :label="`${$t('message.countryVisited')}*`"
          v-model="country"
          ref="flow_1"
          :validationRules="countryValidation"
          @confirmed="nextFieldHandler($refs.flow_2)"
        />
        <div class="line-group">
          <app-totem-input
            name="startDate"
            keyboardLayout="numeric"
            :mask="['##/##/####']"
            :placeholder="$t('message.dateFormat')"
            :label="`${$t('message.tripPeriod')}*`"
            v-model="startDate"
            ref="flow_2"
            :validationRules="dateValidation"
            @confirmed="nextFieldHandler($refs.flow_3)"
          />
          <span class="separator">{{ $t("message.dateTo") }}</span>
          <app-totem-input
            name="endDate"
            keyboardLayout="numeric"
            :mask="['##/##/####']"
            :placeholder="$t('message.dateFormat')"
            label=""
            v-model="endDate"
            ref="flow_3"
            :validationRules="dateValidation"
            @confirmed="nextFieldHandler($refs.flow_4)"
          />
        </div>
        <app-totem-input
          name="arrival"
          keyboardLayout="numeric"
          :mask="['##/##/####']"
          :placeholder="$t('message.dateFormat')"
          :label="`${$t('message.arrivalBrazil')}*`"
          v-model="arrival"
          ref="flow_4"
          :validationRules="dateValidation"
          @confirmed="nextFieldHandler"
        />
        <span class="required-text">{{ $t("message.requiredField") }}</span>
      </keyboard-flow>
      <div class="btn-container">
        <b-button type="submit" variant="primary">{{ $t("message.next") }}</b-button>
      </div>
    </ValidationObserver>
  </form>
</template>

<script>
export default {
  name: "TravelForm",
  data() {
    return {
      country: null,
      startDate: null,
      endDate: null,
      arrival: null,
      value: null
    };
  },
  computed: {
    shouldAnswerFields() {
      return this.value === "Y";
    },
    dateValidation() {
      if (this.shouldAnswerFields) {
        return "required|date";
      }
      return "";
    },
    countryValidation() {
      if (this.shouldAnswerFields) {
        return "required";
      }
      return "";
    }
  },
  methods: {
    submit() {
      this.$refs.validator.validate().then(res => {
        if (res) {
          const travel = {
            mainQuestion: this.value,
            subQuestions: {
              period: {
                initial: this.shouldAnswerFields
                  ? `${this.getDateString(this.startDate)}T00:00:00`
                  : null,
                final: this.shouldAnswerFields
                  ? `${this.getDateString(this.endDate)}T00:00:00`
                  : null
              },
              country: this.shouldAnswerFields ? this.country : null,
              arrival: this.shouldAnswerFields
                ? `${this.getDateString(this.arrival)}T00:00:00`
                : null
            }
          };
          this.$emit("next", travel);
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
    }
  }
};
</script>
<style lang="scss" scoped>
.line-group {
  display: flex;
  align-items: flex-end;

  .form-group {
    flex-grow: 1;
  }

  .separator {
    font-size: 14px;
    margin: 0 10px 10px 10px;
  }
}
</style>
