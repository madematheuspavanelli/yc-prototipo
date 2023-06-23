<template>
  <div class="pre-checkin">
    <div class="iphonex">
      <div class="front">
        <div class="screen">
          <div class="screen__view">
            <div class="iphone-symbols">
              <span>12:00</span>
              <div class="cellphone-icons">
                <img src="@/assets/icons/wi-fi.svg" alt="wifi icon" />
                <img src="@/assets/icons/battery.svg" class="battery" alt="battery icon" />
              </div>
            </div>
            <div
              class="precheckin-preview"
              :style="{
                'background-image': `url(${preCheckinBackgroundSrc})`
              }"
            >
              <div class="precheckin-navbar" :style="{ 'background-color': this.colorValue }">
                <div class="change-precheckin-logo">
                  <img :src="preCheckinLogoSrc" class="pre_checkin_logo" alt="hotel logo" />
                  <button
                    v-if="hasPreCheckingLogo"
                    class="change-image reset"
                    id="reset_pre_checkin_logo"
                    title="Limpar"
                    type="button"
                    @click="resetImage('preCheckinLogo')"
                  ></button>
                  <button
                    class="change-image"
                    id="change_pre_checkin_logo"
                    title="Editar"
                    type="button"
                    @click="uploadHandler('preCheckinLogo')"
                  ></button>
                </div>
                <button
                  v-if="hasColor"
                  class="change-image reset"
                  id="reset_pre_checkin_nav_color"
                  title="Limpar"
                  type="button"
                  @click="resetColor"
                ></button>
                <button
                  class="change-image"
                  id="change_pre_checkin_nav_color"
                  title="Editar"
                  type="button"
                  v-b-modal.color-modal
                ></button>
              </div>
              <button
                v-if="hasPreCheckinBackground"
                class="change-image reset"
                id="reset_pre_checkin_bg_image"
                title="Limpar"
                type="button"
                @click="resetImage('preCheckinBgImage')"
              ></button>
              <button
                class="change-image"
                id="change_pre_checkin_bg_image"
                title="Editar"
                type="button"
                @click="uploadHandler('preCheckinBgImage')"
              ></button>
            </div>
            <transition name="fade">
              <Loader v-if="isLoading" :isAdmin="true" />
            </transition>
          </div>
          <div class="screen__front">
            <div class="screen__front-speaker"></div>
            <div class="screen__front-camera"></div>
          </div>
        </div>
        <div class="front__line"></div>
        <div class="front__line front__line-second"></div>
      </div>
      <div class="phoneButtons phoneButtons-right"></div>
      <div class="phoneButtons phoneButtons-left"></div>
      <div class="phoneButtons phoneButtons-left2"></div>
      <div class="phoneButtons phoneButtons-left3"></div>
      <div class="back"></div>
    </div>
    <b-form-file
      v-model="preCheckinLogo"
      accept="image/*"
      ref="preCheckinLogo"
      class="d-none"
      @input="updateBase64Handler($event, 'preCheckinLogo')"
    ></b-form-file>
    <b-form-file
      v-model="preCheckinBgImage"
      ref="preCheckinBgImage"
      accept="image/*"
      class="d-none"
      @input="updateBase64Handler($event, 'preCheckinBgImage')"
    ></b-form-file>
    <b-modal
      id="color-modal"
      header-bg-variant="dark"
      header-text-variant="dark"
      header-border-variant="dark"
      body-bg-variant="dark"
      body-text-variant="dark"
      footer-bg-variant="dark"
      footer-text-variant="dark"
      footer-border-variant="dark"
      ok-variant="primary"
      size="sm"
      button-size="lg"
      centered
      title="Escolher cor da navegação"
      cancel-title="Cancelar"
      ok-title="Confirmar"
      hide-header-close
      modal-class="admin-wrapper"
      class="admin-wrapper"
      @show="syncTempColor"
      @ok="syncColor"
    >
      <color-picker
        theme="dark"
        :color="tempColor"
        :sucker-hide="true"
        :colors-default="[]"
        @changeColor="changeColor"
      />
    </b-modal>
  </div>
</template>

<script>
import { toBase64 } from "@/scripts/commonScripts";
import Loader from "@/components/Loader.vue";

export default {
  name: "PreCheckinSettings",
  components: {
    Loader
  },
  data() {
    return {
      preCheckinLogo: null,
      preCheckinBgImage: null,
      base64Src: {
        preCheckinLogo: null,
        preCheckinBgImage: null
      },
      tempColor: null,
      color: null,
      isLoading: true
    };
  },
  computed: {
    preCheckinLogoSrc() {
      return this.base64Src.preCheckinLogo || this.logoDefault;
    },
    preCheckinBackgroundSrc() {
      return this.base64Src.preCheckinBgImage || this.backgroundDefault;
    },
    colorValue() {
      return this.color || this.colorDefault;
    },
    hasPreCheckingLogo() {
      return this.base64Src.preCheckinLogo !== null;
    },
    hasPreCheckinBackground() {
      return this.base64Src.preCheckinBgImage !== null;
    },
    hasColor() {
      return this.color !== null;
    },
    logoDefault() {
      return this.$store.getters.hotelCustomizationPreCheckinLogoDefault;
    },
    backgroundDefault() {
      return this.$store.getters.hotelCustomizationPreCheckinBgImageDefault;
    },
    colorDefault() {
      return this.$store.getters.hotelCustomizationPreCheckinNavColorDefault;
    }
  },
  methods: {
    uploadHandler(target) {
      this.$refs[target].$refs.input.click();
    },
    updateBase64Handler(value, target) {
      toBase64(value)
        .then(data => {
          this.base64Src[target] = data;
          this.updateSettings(target, this.base64Src[target]);
        })
        .catch(() => {
          this.resetImage(target);
        });
    },
    changeColor(color) {
      this.tempColor = color.hex;
    },
    syncTempColor() {
      this.tempColor = this.color;
    },
    syncColor() {
      this.color = this.tempColor;
      this.updateSettings("preCheckinNavColor", this.color);
    },
    resetColor() {
      this.color = null;
      this.updateSettings("preCheckinNavColor", this.color);
    },
    resetImage(target) {
      this.base64Src[target] = null;
      this[target] = null;
      this.updateSettings(target, this.base64Src[target]);
    },
    loadData() {
      this.isLoading = true;
      this.$API.admin.getHotelSettings().then(data => {
        this.base64Src.preCheckinLogo = data.customization.preCheckinLogo || null;
        this.base64Src.preCheckinBgImage = data.customization.preCheckinBgImage || null;
        this.color = data.customization.preCheckinNavColor || null;
        this.isLoading = false;
      });
    },
    updateSettings(target, value) {
      const data = {
        customization: {}
      };
      data.customization[target] = value === null ? "" : value;
      this.$API.admin.updateHotelSettings(data);
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/adminSettings.scss";

.pre-checkin {
  display: flex;
  justify-content: center;
}
</style>
