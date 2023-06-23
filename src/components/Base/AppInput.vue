<template>
  <ValidationProvider :rules="validationRules" v-slot="{ errors }" slim>
    <b-form-group
      :id="`${inputId}-group`"
      :label="label"
      :label-for="inputId"
      slot="reference"
      :invalid-feedback="errors[0]"
      :state="!errors.length"
    >
      <b-form-input
        v-if="useMask"
        :id="inputId"
        v-model="model"
        :name="name"
        :type="inputType"
        :placeholder="placeholder"
        v-mask="mask"
        :key="maskedInputKey"
        trim
      ></b-form-input>
      <b-form-input
        v-else
        :id="inputId"
        v-model="model"
        :name="name"
        :type="inputType"
        :placeholder="placeholder"
        :key="inputId"
        trim
      ></b-form-input>
    </b-form-group>
  </ValidationProvider>
</template>

<script>
export default {
  name: "AppInput",
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
    validationRules: {
      type: String,
      default: ""
    },
    mask: {
      default: () => []
    },
    placeholder: {
      type: String,
      default: ""
    },
    inputType: {
      type: String,
      default: "text"
    }
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
    },
    useMask() {
      return this.mask.length > 0;
    },
    maskedInputKey() {
      return `${this.inputId}-mask`;
    }
  }
};
</script>
