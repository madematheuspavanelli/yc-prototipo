<template>
  <div ref="input" class="flex flex-col w-full">
    <label
      v-if="label"
      class="font-semibold text-lg leading-3"
      :class="[invalid ? 'text-youcheckin-red' : 'text-youcheckin-gray-dark']"
      for=""
      >{{ label }}</label
    >
    <input
      class="h-20 px-[30px] border-2  text-3xl rounded outline-none"
      :class="[invalid ? 'border-youcheckin-red' : 'border-youcheckin-gray-dark']"
      @blur="handleBlur"
      @focus="handleFocus"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "TotemInput",
  props: {
    label: {
      type: String,
      default: ""
    },
    invalid: {
      type: Boolean,
      default: false
    },
    fieldType: {
      type: String,
      default: "letter"
    }
  },
  data() {
    return {
      offsetHeight: null
    };
  },
  computed: {
    keyboardInstance() {
      return `keyboard-${this.name}`;
    }
  },
  mounted() {
    let { bottom } = this.$refs.input.getBoundingClientRect();
    this.offsetHeight = bottom;
  },
  methods: {
    ...mapActions(["activeLetterInput", "activeNumberInput", "inactiveInput"]),
    handleFocus() {
      switch (this.fieldType) {
        case "number":
          this.activeNumberInput({ offset: this.offsetHeight });
          break;
        case "letter":
        default:
          this.activeLetterInput({ offset: this.offsetHeight });
          break;
      }
    },
    handleBlur() {
      this.inactiveInput({
        element: this.$refs.input,
        isLast: this.last
      });
    }
  }
};
</script>

checko
