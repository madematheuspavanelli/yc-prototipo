<template>
  <ValidationProvider :rules="validationRules" v-slot="{ errors }" slim>
    <b-form-group
      :label="label"
      :label-for="inputId"
      :invalid-feedback="errors[0]"
      :state="!errors.length"
      :id="`${inputId}-group`"
    >
      <v-select
        :id="inputId"
        :name="name"
        :options="options"
        :clearable="false"
        :searchable="false"
        v-model="model"
      ></v-select>
    </b-form-group>
  </ValidationProvider>
</template>

<script>
export default {
  name: "AppTotemSelect",
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
    options: {
      type: Array,
      default: () => []
    },
    validationRules: {
      type: String,
      default: ""
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
    }
  }
};
</script>
