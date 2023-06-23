<template>
  <div class="totem-settings-wrapper">
    <app-page :pageTitle="$t('message.info')" :variant="variant">
      <StubForm />
    </app-page>
    <div class="overlay"></div>

    <div v-if="useTopRight" class="controls top-right">
      <button @click="emitChange('topPagesScreenTheme')"></button>
      <button v-if="showRemoveTopRight" @click="emitReset('topPagesScreenTheme')"></button>
    </div>
    <div v-if="useCenterLeft" class="controls center-left">
      <button @click="emitChange('midPagesScreenTheme')"></button>
      <button v-if="showRemoveCenterLeft" @click="emitReset('midPagesScreenTheme')"></button>
    </div>
    <div v-if="useBottomLeft" class="controls bottom-left">
      <button @click="emitChange('bottomPagesScreenTheme')"></button>
      <button v-if="showRemoveBottomLeft" @click="emitReset('bottomPagesScreenTheme')"></button>
    </div>
  </div>
</template>

<script>
import StubForm from "@/components/admin/StubForm";

export default {
  name: "TotemSettingsWrapper",
  components: {
    StubForm
  },
  props: {
    variant: {
      type: String,
      default: "center"
    },
    showRemoveTopRight: {
      type: Boolean,
      default: false
    },
    showRemoveCenterLeft: {
      type: Boolean,
      default: false
    },
    showRemoveBottomLeft: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    useTopRight() {
      return this.variant === "top-bottom" || this.variant === "top";
    },
    useCenterLeft() {
      return this.variant === "center";
    },
    useBottomLeft() {
      return this.variant === "top-bottom";
    }
  },
  methods: {
    emitChange(position) {
      this.$emit("photoChange", position);
    },
    emitReset(position) {
      this.$emit("photoReset", position);
    }
  }
};
</script>

<style lang="scss" scoped>
.totem-settings-wrapper {
  height: 100%;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.controls {
  transform: translateY(-50%);
  z-index: 3;

  button {
    padding: 0;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 7;
    cursor: pointer;
    background: url("../../assets/icons/ic_edit.svg") no-repeat center;
    background-size: 15px;
    background-color: $yckDarkGrey;

    &:hover {
      background-color: $yckLightGrey;
    }

    &:nth-child(2) {
      margin-top: 10px;
      background: url("../../assets/icons/trash-fill.svg") no-repeat center;
      background-color: $yckDarkGrey;
    }
  }
}

.top-right {
  position: absolute;
  right: 200px;
  top: 0;
  transform: translateY(50%);
}

.center-left {
  position: absolute;
  left: 200px;
  top: 50%;
}

.bottom-left {
  position: absolute;
  left: 200px;
  bottom: 0;
}
</style>
