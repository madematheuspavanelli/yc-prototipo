<template>
  <div class="full-width pos-r">
    <LanguageChanger v-if="languageChanger" class="language-change" />
    <div v-if="adminEdit" class="page-blocker"></div>
    <img :src="backgroundImg" alt="Background Image" class="background-img img" />
    <button
      v-if="adminEdit"
      class="edit-background edit"
      @click="emitChange('homeBackgroundImage')"
    ></button>
    <button
      v-if="showRemoveBackgroundImg"
      class="edit-background edit reset"
      @click="emitReset('homeBackgroundImage')"
    ></button>
    <div class="linear-gradient"></div>
    <img :src="topImage" alt="Top Image" class="top-img img" />
    <button v-if="adminEdit" class="edit-top edit" @click="emitChange('homeScreenTheme')"></button>
    <button
      v-if="showRemoveTopImg"
      class="edit-top edit reset"
      @click="emitReset('homeScreenTheme')"
    ></button>
    <img :src="hotelGroupImg" alt="Hotel Group Logo" class="hotel-group img" />
    <button
      v-if="adminEdit"
      class="edit-hotel-group edit"
      @click="emitChange('homeHotelGroupLogo')"
    ></button>
    <button
      v-if="showRemoveHotelGroupLogo"
      class="edit-hotel-group edit reset"
      @click="emitReset('homeHotelGroupLogo')"
    ></button>
    <div class="content" :class="{ 'admin-index': adminEdit }">
      <slot name="before-logo"></slot>
      <img :src="hotelLogoImg" alt="Hotel Logo Image" class="hotel-logo" />
      <button
        v-if="adminEdit"
        class="edit-hotel-logo edit"
        @click="emitChange('homeHotelLogo')"
      ></button>
      <button
        v-if="showRemoveHotelLogo"
        class="edit-hotel-logo edit reset"
        @click="emitReset('homeHotelLogo')"
      ></button>
      <slot name="after-logo"></slot>
    </div>
    <div class="powered-by">
      <span>© Powered by youcheck.in &reg; {{ new Date().getFullYear() }}</span>
    </div>
    <transition name="fade">
      <Loader v-if="isLoading" />
    </transition>
  </div>
</template>
<script>
import LanguageChanger from "@/components/LanguageChanger";
import Loader from "@/components/Loader";

export default {
  name: "BaseStructureEntreLeave",
  components: {
    LanguageChanger,
    Loader
  },
  props: {
    languageChanger: {
      default: false
    },
    adminEdit: {
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    showRemoveTopImg: {
      type: Boolean,
      default: false
    },
    showRemoveHotelLogo: {
      type: Boolean,
      default: false
    },
    showRemoveHotelGroupLogo: {
      type: Boolean,
      default: false
    },
    showRemoveBackgroundImg: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    topImage() {
      return this.$store.getters.hotelCustomizationTopCenter;
    },
    backgroundImg() {
      return this.$store.getters.hotelCustomizationHomeBackgroundImage;
    },
    hotelGroupImg() {
      return this.$store.getters.hotelCustomizationGroupLogo;
    },
    hotelLogoImg() {
      return this.$store.getters.hotelCustomizationLogo;
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
.full-width {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .page-blocker {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 5;
  }

  .edit {
    padding: 0;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 7;
    cursor: pointer;
    background: url("../assets/icons/ic_edit.svg") no-repeat center;
    background-size: 15px;
    background-color: $yckDarkGrey;
    position: absolute;

    &.reset {
      background: url("../assets/icons/trash-fill.svg") no-repeat center;
      background-color: $yckDarkGrey;
    }

    &:hover {
      background-color: $yckLightGrey;
    }

    &.edit-hotel-logo {
      top: 50%;
      transform: translateY(-50%);
      right: 100px;

      &.reset {
        transform: translateY(calc(-50% + 50px));
      }
    }

    &.edit-hotel-group {
      right: 200px;
      bottom: 20px;
      transform: translateY(-50px);

      &.reset {
        transform: none;
      }
    }
    &.edit-top {
      top: 20px;
      right: 200px;

      &.reset {
        transform: translateY(50px);
      }
    }
    &.edit-background {
      top: 20px;
      left: 20px;

      &.reset {
        transform: translateY(50px);
      }
    }
  }

  .language-change {
    position: absolute;
    top: 0;
    right: 0;
  }

  .linear-gradient {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: linear-gradient(360deg, black 5%, transparent);
  }

  .img {
    position: absolute;
    z-index: 0;

    &.hotel-group,
    &.top-img {
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
    }
    &.top-img {
      max-width: 60%;
    }
    &.hotel-group {
      bottom: 0;
    }

    &.top-img {
      top: 0;
    }

    &.background-img {
      height: 100%;
      width: 100%;
    }
  }

  .hotel-logo {
    max-width: 70%;
    align-self: center;
  }

  .content {
    display: flex;
    flex-direction: column;
    width: fit-content;
    z-index: 2;
  }

  .powered-by {
    position: absolute;
    width: fit-content;
    left: 0;
    bottom: 0;
    padding: 5px 10px;
    border-top-right-radius: 4px;
    background-color: rgba(255, 255, 255, 0.6);

    span {
      color: black;
      font-size: 1.4rem;
    }
  }

  .admin-index {
    z-index: 5;
  }
}
</style>
