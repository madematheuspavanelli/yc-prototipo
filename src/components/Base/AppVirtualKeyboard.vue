<template>
  <div
    ref="keyboard"
    class="absolute bottom-0 left-0 right-0 transition z-10"
    :class="{ 'translate-y-full': !showKeyboard }"
  >
    <div ref="keyboard" :class="keyboardClass"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";
import Layouts from "@/libs/keyboard/virtualKeyboardLayout.js";

export default {
  name: "SimpleKeyboard",
  props: {
    keyboardClass: {
      default: "simple-keyboard",
      type: String
    },
    input: {
      type: String
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.updateKeyboardHeightValue();
    this.initKeyboard();
  },
  data() {
    return {
      keyboard: null
    };
  },
  computed: {
    ...mapGetters(["showKeyboard", "keyboardType"]),
    keyboardLayout() {
      return Layouts[this.keyboardType || "letter"];
    }
  },
  methods: {
    ...mapActions(["setKeyboardHeight"]),
    initKeyboard() {
      const options = this.getKeyboardOptions();
      this.keyboard = new Keyboard(this.keyboardClass, options);
      this.updateKeyboardHeight();
    },
    updateKeyboardHeight() {
      const { y: offsetTop } = this.$refs.keyboard.getBoundingClientRect();
      this.setKeyboardHeight(offsetTop);
    },
    updateKeyboardHeightValue() {
      const { offsetTop } = this.$refs.keyboard;
      this.setKeyboardHeight(offsetTop);
    },
    getKeyboardOptions() {
      return {
        onChange: this.onChange,
        onKeyPress: this.onKeyPress,
        disableCaretPositioning: true,
        theme: "hg-theme-default hg-layout-default",
        layout: {
          default: this.keyboardLayout
        },
        buttonTheme: [
          { class: "space-key", buttons: "{space}" },
          { class: "arrow-left", buttons: "{bksp}" },
          { class: "shift", buttons: "{shift}" },
          { class: "enter-key", buttons: "{enter}" }
        ],
        display: {
          "{bksp}": " ",
          "{enter}": this.keyboardConfirmText || this.$t("keyboard.enter"),
          "{tab}": this.$t("keyboard.tab"),
          "{space}": " ",
          "{shift}": " "
        },
        preventMouseDownDefault: true,
        stopMouseDownPropagation: true
      };
    },
    onChange(input) {
      this.$emit("onChange", input);
    },
    onKeyPress(button) {
      this.$emit("onKeyPress", button);

      if (button === "{shift}" || button === "{lock}") this.handleShift();
    },
    handleShift() {
      let currentLayout = this.keyboard.options.layoutName;
      let shiftToggle = currentLayout === "default" ? "shift" : "default";

      this.keyboard.setOptions({
        layoutName: shiftToggle
      });
    }
  },
  watch: {
    input(input) {
      this.keyboard.setInput(input);
    },
    showKeyboard() {
      this.updateKeyboardHeight();
    },
    keyboardLayout() {
      this.initKeyboard();
    }
  }
};
</script>

<style lang="scss">
.hg-theme-default {
  .hg-row {
    justify-content: center;
  }
  .hg-button {
    max-width: 6rem;
    min-height: 6rem;

    font-size: 26px;
    font-weight: bold;
    margin: 0.25rem 0.5rem;
    box-shadow: none;

    &.enter-key {
      width: 145px;
      max-width: 145px;
      min-width: 145px;
      background-color: $yckLightGrey;

      &.hg-activeButton {
        background-color: $yckLightGrey;
      }

      span {
        color: $white;
        font-size: 16px;
      }
    }

    &.space-key {
      max-width: unset;
    }

    &.arrow-left {
      span::after {
        content: "\21E6";
      }
    }
  }
}

.numeric-keyboard {
  .hg-theme-default {
    .hg-row {
      justify-content: center;
    }
    .hg-button {
      width: 140px;
      max-width: 140px;
      min-width: 140px;
    }
  }
}
</style>
