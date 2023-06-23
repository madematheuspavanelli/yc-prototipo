<template>
  <ValidationProvider :rules="validationRules" v-slot="{ errors }" slim>
    <b-form-group
      :id="`${inputId}-group`"
      :label="label"
      :label-for="inputId"
      :class="{ center: alignCenter }"
      :invalid-feedback="errors[0]"
      :state="!errors.length"
    >
      <b-form-radio-group
        size="lg"
        :id="inputId"
        :options="options"
        :name="name"
        v-model="model"
      ></b-form-radio-group>
    </b-form-group>
  </ValidationProvider>
</template>

<script>
export default {
  name: "AppRadioGroup",
  props: {
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    value: {
      required: true
    },
    alignCenter: {
      type: Boolean,
      default: true
    },
    validationRules: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      options: [
        { text: this.$t("message.yes"), value: "Y" },
        { text: this.$t("message.no"), value: "N" }
      ]
    };
  },
  computed: {
    inputId() {
      return `input-${this.name}`;
    },
    model: {
      get() {
        return this.value;
      },
      set(model) {
        this.$emit("input", model);
      }
    }
  }
};
</script>
