<template>
  <div class="totem-preview-holder">
    <div class="totem-preview">
      <button class="left-arrow arrow" @click="lastPage()" v-if="actualIndex !== 0"></button>
      <div class="totem-pages" :style="{ transform: 'translateX(-' + actualIndex * 100 + '%)' }">
        <div class="one home">
          <StartProcess
            class="home"
            :adminEdit="true"
            :showRemoveTopImg="showRemoveTopImg"
            :showRemoveHotelLogo="showRemoveHotelLogo"
            :showRemoveHotelGroupLogo="showRemoveHotelGroupLogo"
            :showRemoveBackgroundImg="showRemoveBackgroundImg"
            @photoChange="position => photoChange(position, 'home')"
            @photoReset="photoReset($event, 'home')"
          />
        </div>
        <div class="two form-one">
          <TotemSettingsWrapper
            @photoChange="photoChange($event, 'personal')"
            @photoReset="photoReset($event, 'personal')"
            :showRemoveCenterLeft="showRemovePersonalImg"
          />
        </div>
        <div class="three form-two">
          <TotemSettingsWrapper
            variant="top-bottom"
            @photoChange="photoChange($event, 'address')"
            @photoReset="photoReset($event, 'address')"
            :showRemoveTopRight="showRemoveTopImgAddress"
            :showRemoveBottomLeft="showRemoveBotImgAddress"
          />
        </div>
      </div>
      <button
        class="right-arrow arrow"
        @click="nextPage()"
        v-if="actualIndex !== maxIndex"
      ></button>
      <input type="file" class="d-none" ref="imgUpload" @input="changeImg" />
    </div>
    <transition name="fade">
      <Loader v-if="isLoading" :isAdmin="true" />
    </transition>
  </div>
</template>

<script>
import StartProcess from "@/components/StartProcess";
import Loader from "@/components/Loader.vue";
import TotemSettingsWrapper from "@/components/admin/TotemSettingsWrapper.vue";

export default {
  name: "TotemSettings",
  components: {
    StartProcess,
    Loader,
    TotemSettingsWrapper
  },
  computed: {
    maxIndex() {
      return Object.keys(this.form).length - 1;
    },
    bgDefault() {
      return this.$store.getters.hotelCustomizationHomeBackgroundImageDefault;
    },
    logoDefault() {
      return this.$store.getters.hotelCustomizationLogoDefault;
    },
    groupLogoDefault() {
      return this.$store.getters.hotelCustomizationGroupLogoDefault;
    },
    topCenterDefault() {
      return this.$store.getters.hotelCustomizationTopCenterDefault;
    },
    showRemoveTopImg() {
      return this.form.home.homeScreenTheme !== null;
    },
    showRemoveHotelLogo() {
      return this.form.home.homeHotelLogo !== null;
    },
    showRemoveHotelGroupLogo() {
      return this.form.home.homeHotelGroupLogo !== null;
    },
    showRemoveBackgroundImg() {
      return this.form.home.homeBackgroundImage !== null;
    },
    showRemoveTopImgAddress() {
      return this.form.address.topPagesScreenTheme !== null;
    },
    showRemoveBotImgAddress() {
      return this.form.address.bottomPagesScreenTheme !== null;
    },
    showRemovePersonalImg() {
      return this.form.personal.midPagesScreenTheme !== null;
    }
  },
  data() {
    return {
      actualIndex: 0,
      position: null,
      screen: null,
      form: {
        home: {
          homeScreenTheme: null,
          homeHotelLogo: null,
          homeHotelGroupLogo: null,
          homeBackgroundImage: null
        },
        personal: {
          midPagesScreenTheme: null
        },
        address: {
          topPagesScreenTheme: null,
          bottomPagesScreenTheme: null
        }
      },
      isLoading: true
    };
  },
  methods: {
    nextPage() {
      if (this.actualIndex === this.maxIndex) {
        return;
      }

      this.actualIndex += 1;
    },
    lastPage() {
      if (this.actualIndex === 0) {
        return;
      }

      this.actualIndex -= 1;
    },
    photoChange(position, screen) {
      this.screen = screen;
      this.position = position;

      this.$refs.imgUpload.click();
    },
    photoReset(position, screen) {
      this.form[screen][position] = null;
      this.$refs.imgUpload.value = null;
      this.updateSettings(screen, position);
    },
    changeImg(event) {
      this.isLoading = true;
      if (event.target.files) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
          this.form[this.screen][this.position] = reader.result;
          this.updateSettings(this.screen, this.position);
          this.$refs.imgUpload.value = "";
        };
        reader.readAsDataURL(file);
      }
    },
    loadData() {
      this.isLoading = true;
      this.$API.admin.getHotelSettings().then(data => {
        const images = data.customization;
        this.form.home.homeScreenTheme = images.homeScreenTheme || null;
        this.form.home.homeHotelLogo = images.homeHotelLogo || null;
        this.form.home.homeHotelGroupLogo = images.homeHotelGroupLogo || null;
        this.form.home.homeBackgroundImage = images.homeBackgroundImage || null;
        this.form.address.topPagesScreenTheme = images.topPagesScreenTheme || null;
        this.form.address.bottomPagesScreenTheme = images.bottomPagesScreenTheme || null;
        this.form.personal.midPagesScreenTheme = images.midPagesScreenTheme || null;
        this.$store.dispatch("SET_HOTEL_SETTINGS", data);
        this.isLoading = false;
      });
    },
    updateSettings(screen, position) {
      const data = {
        customization: {}
      };
      const value = this.form[screen][position];
      data.customization[position] = value === null ? "" : value;
      this.$API.admin.updateHotelSettings(data).then(() => {
        this.loadData();
      });
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/adminSettings.scss";
.totem-preview-holder {
  width: 100%;
  overflow: auto;
  position: relative;
  height: 810px;
}

.totem-preview {
  margin: 0 auto;
  width: 1280px;
  height: 800px;
  /* position: absolute; */
}

.totem-pages {
  transition: transform 0.5s;
}

.home,
.address,
.personal {
  width: 100%;
  height: 100%;
}
</style>
