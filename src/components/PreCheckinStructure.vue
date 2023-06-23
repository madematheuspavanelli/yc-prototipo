<template>
  <div class="pre-checkin-content">
    <div class="navbar" :style="{ backgroundColor: navbarColor }">
      <img
        v-if="backButton"
        class="back-button"
        src="@/assets/icons/ic_back_grey.svg"
        alt="Back button"
        @click="goToPreviousRoute"
      />
      <img :src="hotelLogo" alt="Youcheckin Logo" class="logo" />
    </div>
    <div class="content-scroll">
      <div class="content-wrapper">
        <div class="container pre-checkin">
          <div class="dots-group">
            <span :class="dotActive == 'one' ? 'dot dot-active' : 'dot'"></span>
            <span :class="dotActive == 'two' ? 'dot dot-active' : 'dot'"></span>
            <span :class="dotActive == 'three' ? 'dot dot-active' : 'dot'"></span>
            <span :class="dotActive == 'four' ? 'dot dot-active' : 'dot'"></span>
            <span :class="dotActive == 'five' ? 'dot dot-active' : 'dot'"></span>
            <span :class="dotActive == 'six' ? 'dot dot-active' : 'dot'"></span>
            <span :class="dotActive == 'seven' ? 'dot dot-active' : 'dot'"></span>
            <span :class="dotActive == 'eight' ? 'dot dot-active' : 'dot'"></span>
          </div>
          <div class="pre-checkin-inner-content">
            <slot name="title"></slot>
            <slot name="center"></slot>
            <slot name="bottom"></slot>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <Loader v-show="isLoading" />
    </transition>
    <img :src="backgroundImg" alt="bg" class="background-img" />
    <div class="linear-gradient"></div>
  </div>
</template>

<script>
import Loader from "@/components/Loader";

export default {
  name: "PreCheckinStructure",
  components: {
    Loader
  },
  props: {
    dotActive: {
      type: String
    },
    form: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    backButton: {
      type: Boolean
    }
  },
  computed: {
    navbarColor() {
      return this.$store.getters.hotelCustomizationPreCheckinNavColor;
    },
    backgroundImg() {
      return this.$store.getters.hotelCustomizationPreCheckinBgImage;
    },
    hotelLogo() {
      return this.$store.getters.hotelCustomizationPreCheckinLogo;
    }
  },
  methods: {
    goToPreviousRoute() {
      this.$router.back();
    }
  }
};
</script>
<style lang="scss" scoped>
.pre-checkin-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .content-scroll {
    height: 100%;
    overflow-y: auto;
    position: relative;
    z-index: 2;
  }

  .content-wrapper {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .navbar {
    display: flex;
    padding: 10px 20px;
    width: 100%;
    height: 60px;
    min-height: 60px;
    position: relative;
    z-index: 1;
    justify-content: space-between;
    flex-wrap: nowrap;
    align-items: center;

    .back-button {
      width: 35px;
      cursor: pointer;
    }

    .logo {
      height: 100%;
      object-fit: contain;
    }
  }

  .container {
    position: relative;
    z-index: 1;
    flex-grow: 1;
    padding: 10px 20px;
    overflow-y: auto;

    .dots-group {
      margin: 25px auto 10px;

      margin-left: auto;
      margin-right: auto;

      .dot {
        margin: 5px;
        height: 12px;
        width: 12px;
        background-color: transparent;
        border-radius: 50%;
        border: 1px solid $white;
        display: inline-block;
      }

      .dot-active {
        background-color: $white;
      }
    }
  }

  .background-img {
    min-width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    object-fit: cover;
    height: 100%;
  }

  .pre-checkin-inner-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    margin-bottom: calc(50px + 22px);
  }

  .linear-gradient {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: linear-gradient(360deg, black 5%, transparent);
  }
}

@media screen and (min-width: 992px) {
  .pre-checkin-content {
    .container {
      overflow-y: hidden;
    }
  }
}
</style>
