<template>
  <form @submit.prevent="submit" autocomplete="off" class="w-100">
    <ValidationObserver slim ref="validator">
      <app-radio-group
        name="personContact"
        :label="$t('message.personCovid')"
        v-model="value"
        validationRules="required"
      />
      <div v-show="shouldAnswerFields">
        <app-totem-input
          name="when"
          keyboardLayout="numeric"
          :mask="['##/##/####']"
          :label="`${$t('message.when')}*`"
          :placeholder="$t('message.dateFormat')"
          v-model="when"
          :validationRules="dateValidation"
          @confirmed="submit"
        />
        <span class="required-text">{{ $t("message.requiredField") }}</span>
      </div>
      <div class="btn-container">
        <b-button type="submit" variant="primary">{{ $t("message.next") }}</b-button>
      </div>
    </ValidationObserver>
  </form>
</template>

<script>
export default {
  name: "PersonForm",
  data() {
    return {
      value: null,
      when: null
    };
  },
  computed: {
    dateString() {
      return (this.when || "")
        .split("/")
        .reverse()
        .join("-");
    },
    shouldAnswerFields() {
      return this.value === "Y";
    },
    dateValidation() {
      if (this.shouldAnswerFields) {
        return "required|date";
      }
      return "";
    }
  },
  methods: {
    submit() {
      this.$refs.validator.validate().then(res => {
        if (res) {
          const data = {
            mainQuestion: this.value,
            when: this.value ? `${this.dateString}T00:00:00` : null
          };
          this.$emit("next", data);
        } else {
          this.$alert("warning", this.$t("alert.invalidFields"));
        }
      });
    }
  }
};
</script>
