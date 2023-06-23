<template>
  <ValidationProvider :rules="validationRules" v-slot="{ errors }" slim>
    <b-form-group
      :id="`${inputId}-group`"
      :label="label"
      :label-for="inputId"
      :invalid-feedback="errors[0]"
      :state="!errors.length"
      :class="placement"
    >
      <v-select
        :disabled="disabled"
        :id="inputId"
        :name="name"
        :options="options"
        :clearable="false"
        :searchable="false"
        ref="flow_target"
        v-model="model"
        @option:selecting="confirmedHandler"
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
    placement: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
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
  },
  methods: {
    confirmedHandler() {
      this.$emit("confirmed");
    }
  }
};
</script>
<style lang="scss">
.form-group.top .v-select .vs__dropdown-menu {
  top: unset !important;
  bottom: 40px !important;
}
</style>
