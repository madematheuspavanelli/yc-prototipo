<template>
  <ValidationProvider :rules="validationRules" v-slot="{ errors }" slim>
    <div class="virtual-keyboard-input">
      <v-popper
        trigger="clickToOpen"
        :options="popperSettings"
        @show="eventEmissionFocus"
        @hide="eventEmissionBlur"
        ref="popper"
      >
        <div
          class="popper-keyboard-container popper"
          :class="{ 'numeric-keyboard': useNumericKeyboardClass }"
        >
          <AppVirtualKeyboard
            v-model="model"
            :keyboardInstance="keyboardInstance"
            :keyboardType="keyboardLayout"
            :keyboardConfirmText="keyboardConfirmText"
            @onKeyPress="keyPressedHandler"
          />
        </div>
        <b-form-group
          :id="`${inputId}-group`"
          :label="label"
          :label-for="inputId"
          slot="reference"
          :invalid-feedback="errors[0]"
          :state="!errors.length"
        >
          <b-form-input
            autocomplete="off"
            :id="inputId"
            :value="model"
            :name="name"
            type="text"
            :placeholder="placeholder"
            v-if="!telLib"
            trim
          ></b-form-input>
          <vue-tel-input
            autocomplete="off"
            v-model="model"
            v-if="telLib"
            defaultCountry="BR"
            class="input-phone"
            mode="international"
            :autoFormat="true"
            :inputOptions="{
              showDialCode: true
            }"
            :dropdownOptions="{
              width: '550px',
              height: '400px',
              showFlags: true
            }"
            @close="telLib"
          >
            <template slot="arrow-icon">
              <span class="vti__dropdown-arrow">&nbsp;▼</span>
            </template>
          </vue-tel-input>
          <input type="hidden" v-if="useMask" v-model="model" v-mask="mask" />
        </b-form-group>
      </v-popper>
      <img
        v-if="hasHideButtons && isHide"
        class="password-icon"
        src="@/assets/icons/eye-slash.svg"
        alt=""
        @click="handleEventShow"
      />
      <img
        v-if="hasHideButtons && !isHide"
        class="password-icon"
        src="@/assets/icons/eye.svg"
        alt=""
        @click="handleEventHide"
      />
    </div>
  </ValidationProvider>
</template>

<script>
import AppVirtualKeyboard from "@/components/Base/AppVirtualKeyboard.vue";
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/dist/vue-tel-input.css";

export default {
  name: "AppTotemInput",
  components: {
    AppVirtualKeyboard,
    VueTelInput
  },
  props: {
    hasHideButtons: {
      type: Boolean,
      default: false
    },
    telLib: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    keyboardLayout: {
      type: String
    },
    mask: {
      type: Array,
      default: () => []
    },
    keyboardConfirmText: {
      type: String
    },
    value: {
      required: true
    },
    placeholder: {
      type: String,
      default: ""
    },
    validationRules: {
      type: String,
      default: ""
    },
    placement: {
      type: String,
      default: "Placement"
    }
  },
  data() {
    return {
      isHide: true,
      popperSettings: {
        placement: this.placement,
        positionFixed: true,
        modifiers: {
          offset: {
            offset: "0, 20px"
          }
        }
      }
    };
  },
  computed: {
    inputId() {
      return `input-${this.name}`;
    },
    keyboardInstance() {
      return `keyboard-${this.name}`;
    },
    model: {
      get() {
        return this.value;
      },
      set(model) {
        this.$emit("input", model);
      }
    },
    useNumericKeyboardClass() {
      return this.keyboardLayout === "numeric" || this.keyboardLayout === "cel";
    },
    useMask() {
      return this.mask.length > 0;
    }
  },
  mounted() {
    setTimeout(() => {
      this.model2 = "11912345678";
    }, 5000);
  },
  methods: {
    keyPressedHandler(pressedButton) {
      if (pressedButton === "{enter}") {
        this.forceKeyboardCloseHandler();
        this.$emit("confirmed");
        this.$emit("blur");
      }
    },
    forceKeyboardCloseHandler() {
      // this case was handled like that because the component API did not provided a way
      // of closing the popped element programmatically. Feel free to check if a
      // new version was published that enables it,
      // or you can also get the source and add the feature yourself
      this.$refs.popper.doClose();
    },
    eventEmissionFocus() {
      this.$emit("focus");
    },
    eventEmissionBlur() {
      this.$emit("blur");
    },
    handleEventShow() {
      this.$emit("show-data");
      this.isHide = !this.isHide;
    },
    handleEventHide() {
      this.$emit("hide-data");
      this.isHide = !this.isHide;
    }
  }
};
</script>

<style lang="scss">
.virtual-keyboard-input {
  display: flex;
  width: 100%;

  & > span {
    width: 100%;
  }

  .password-icon {
    cursor: pointer;
  }

  .popper-keyboard-container {
    z-index: 100;
    padding: 0;
    border: none;
    border-radius: 5px;

    &.popper[x-placement^="bottom"] {
      box-shadow: rgb(0 0 0 / 35%) 0px 5px 15px;

      .popper__arrow {
        border-color: transparent transparent #ececec transparent;
        border-width: 0 20px 20px 20px;
        top: -20px;
      }
    }

    &.popper[x-placement^="top"] {
      box-shadow: rgb(0 0 0 / 35%) 0px -5px 15px;
      .popper__arrow {
        border-color: #ececec transparent transparent transparent;
        border-width: 20px 20px 0 20px;
        bottom: -20px;
      }
    }
  }
}

.input-phone {
  border: none;
  border-radius: 0;
  border-bottom: 1px solid #343639;
  padding-bottom: 5px;

  .input-phone:focus {
    outline: none;
  }

  .vti__dropdown {
    z-index: 100;
    padding-bottom: 5px;
    font-size: 20px;
  }

  .vti__input {
    text-align: left;
    font-size: 20px;
    border: none;
  }
}

.vti__dropdown-list {
  max-height: 300px;
}

.vue-tel-input:focus-within {
  -webkit-box-shadow: none;
  box-shadow: none;
  border-color: #343639;
}
</style>
