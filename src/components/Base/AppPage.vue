<template>
  <div class="app-page">
    <BackButton :useCustomClick="useCustomClick" @click="returnClickHandler" />
    <div class="app-page-content">
      <div class="title">
        <h1>{{ pageTitle }}</h1>
        <div class="border-bottom-black"></div>
      </div>

      <b-container class="page-container">
        <slot></slot>
        <span class="required-text" v-show="showRequired">{{ $t("message.requiredField") }}</span>
      </b-container>
    </div>
    <img v-if="useTopRightImg" class="top-right" :src="topRightImg" alt="" />
    <img v-if="useCenterLeftImg" class="center-left" :src="centerLeftImg" alt="" />
    <img v-if="useBottomLeftImg" class="bottom-left" :src="centerLeftImg" alt="" />
    <app-loader v-if="isLoading" />
  </div>
</template>

<script>
import BackButton from "@/components/BackButton";

export default {
  name: "AppPage",
  props: {
    pageTitle: {
      type: String,
      default: ""
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String,
      default: "center"
    },
    useCustomClick: {
      type: Boolean,
      default: false
    },
    showRequired: {
      type: Boolean,
      default: false
    },
    lg: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BackButton
  },
  computed: {
    centerLeftImg() {
      return this.$store.getters.hotelCustomizationCenterLeft;
    },
    topRightImg() {
      return this.$store.getters.hotelCustomizationTopRight;
    },
    bottomLeftImg() {
      return this.$store.getters.hotelCustomizationBottomLeft;
    },
    useTopRightImg() {
      return this.variant === "top-bottom" || this.variant === "top";
    },
    useCenterLeftImg() {
      return this.variant === "center";
    },

    useBottomLeftImg() {
      return this.variant === "top-bottom";
    }
  },
  methods: {
    returnClickHandler() {
      this.$emit("return-click");
    }
  }
};
</script>

<style lang="scss" scoped>
.app-page {
  width: 100%;
  height: 100%;
  background: $white;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
}

.app-page-content {
  overflow-y: auto;
  position: relative;
  z-index: 2;
  padding: 15px 50px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.page-container {
  width: 50%;
  min-width: 600px;
  padding: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // position: relative;
  z-index: 2;
  padding-bottom: 45px;
  &.large {
    min-width: 800px;
  }
}

.title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;

  h1 {
    display: block;
    font-size: 25px;
    color: $yckLightGrey;
    max-width: 450px;
    text-align: center;
  }

  .border-bottom-black {
    width: 45px;
    border-bottom: 8px solid $yckLightGrey;
    border-radius: 10px;
    margin-top: 10px;
  }
}

.top-right {
  position: absolute;
  right: 0;
  top: 0;
  max-height: calc(100% / 5);
}

.center-left {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  max-height: calc(100% / 3);
}

.bottom-left {
  position: fixed;
  left: 0;
  top: 90%;
  max-width: 100%;
  max-height: calc(100% / 2);
  z-index: 3;
}

::v-deep .required-text {
  display: flex;
  justify-content: center;
  font-size: 14px;
}

.required-text {
  margin-top: 20px;
  margin-left: 73%;
}

::v-deep .btn-container {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  position: fixed;
  bottom: 20px;
  right: 20px;

  button {
    background-color: $yckLightGrey;
    padding: 5px 20px;
    border: 2px solid $yckLightGrey;
    border-radius: 5px;
    font-size: 25px;
    color: $white;
    box-shadow: $btn-box-shadow;
    margin: 0;
    margin-right: 20px;
    min-width: 150px;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }

    &:active,
    &:focus,
    &:active:focus {
      color: $white;
      border-color: $yckLightGrey;

      &:not(.active) {
        background-color: $yckLightGrey;
        border-color: $yckLightGrey;
        color: $white;
      }
    }

    &.btn-secondary {
      background-color: $white;
      color: $yckLightGrey;

      &:active,
      &:focus,
      &:active:focus {
        color: $yckLightGrey;

        &:not(.active) {
          background-color: $white;
          color: $yckLightGrey;
        }
      }
    }
  }
}

::v-deep .processing-message {
  text-align: center;
  font-size: 25px;
  color: $yckLightGrey;
}

::v-deep .loader-holder {
  position: relative;
  height: 80px;
  width: 100%;
}
</style>
