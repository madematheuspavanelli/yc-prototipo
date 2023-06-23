<template>
  <div class="hotel-config">
    <Modal class="hotel-settings">
      <span class="title" slot="title">{{ $t("message.hotelConfigTitle") }}</span>
      <div class="content" slot="center">
        <div class="key-selection">
          <div class="label-input">
            <label class="required" for="slug">{{ $t("message.slug") }}</label>
            <input id="slug" type="text" v-model="slug" />
          </div>
        </div>

        <div class="checkin-checkout">
          <div class="checkin">
            <div class="label-select">
              <label class="required" for="checkinHour">{{ $t("message.blockCheckin") }}</label>
              <v-select
                id="checkinHour"
                label="label"
                :options="checkinCheckoutOptions"
                :reduce="option => option.value"
                v-model="checkin"
                :class="{ mr: !!checkin }"
                :placeholder="selectAnOptionLabel"
                class="custom-select-vs"
                :clearable="false"
              />
            </div>
            <vue-timepicker
              v-if="checkin"
              format="HH:mm"
              input-width="150px"
              v-model="checkinHour"
            ></vue-timepicker>
          </div>
          <div class="checkout">
            <div class="label-select">
              <label class="required" for="checkoutHour">{{ $t("message.blockCheckout") }}</label>
              <v-select
                id="checkoutHour"
                label="label"
                :options="checkinCheckoutOptions"
                :reduce="option => option.value"
                v-model="checkout"
                :class="{ mr: !!checkout }"
                :placeholder="selectAnOptionLabel"
                class="custom-select-vs"
                :clearable="false"
              />
            </div>
            <vue-timepicker
              v-if="checkout"
              format="HH:mm"
              input-width="150px"
              v-model="checkoutHour"
            ></vue-timepicker>
          </div>
        </div>
        <!-- <div class="checkin-checkout">
          <div class="checkout">
            <div class="label-select">
              <label class="required" for="checkoutHour">{{
                $t("message.doFacialRecognition")
              }}</label>
              <v-select
                id="recognition"
                label="label"
                :options="checkinCheckoutOptions"
                :reduce="option => option.value"
                v-model="doFacialRecognition"
                :placeholder="selectAnOptionLabel"
                class="custom-select-vs"
                :clearable="false"
              />
            </div>
          </div>
        </div> -->
        <div class="key-selection">
          <div class="label-select">
            <label class="required" for="should-magnetize">{{
              $t("message.magnetizeOnTotem")
            }}</label>
            <v-select
              id="magnetize"
              label="label"
              :options="checkinCheckoutOptions"
              :reduce="option => option.value"
              v-model="shouldMagniteze"
              :placeholder="selectAnOptionLabel"
              class="custom-select-vs"
              :clearable="false"
            />
          </div>
        </div>
        <div class="key-selection" v-if="shouldMagniteze">
          <div class="label-select">
            <label class="required" for="keySelection">{{ $t("message.magnetizeSystem") }}</label>
            <v-select
              id="keySelection"
              label="label"
              :options="keysOptions"
              :reduce="option => option.value"
              v-model="keySelected"
              :placeholder="selectAKeyLabel"
              class="custom-select-vs"
              :clearable="false"
            />
          </div>
          <div class="label-select">
            <label class="required" for="keySelection">{{ $t("message.keyTech") }}</label>
            <v-select
              id="keySelection"
              label="label"
              :options="keyTypeOptions"
              :reduce="option => option.value"
              v-model="keyType"
              :placeholder="selectAKeyLabel"
              class="custom-select-vs"
              :clearable="false"
            />
          </div>
        </div>
        <div v-if="shouldMagniteze && (hasEncoder || hasKeyServerUrl)" class="key-selection">
          <div v-if="hasEncoder" class="label-input">
            <label class="required" for="encoder">{{ $t("message.encoderAddress") }}</label>
            <input id="encoder" type="text" class="encoder" v-model="encoder" />
          </div>
          <div v-if="hasKeyServerUrl" class="label-input key-server-group">
            <label class="required" for="keyServer">{{ $t("message.serverUrlSettings") }}</label>
            <input
              id="keyServer"
              type="text"
              class="keyServer"
              v-model="keyServerUrl"
              :placeholder="$t('message.serverUrlSettingsPLaceholder')"
            />
          </div>
        </div>
      </div>
      <div class="action" slot="bottom">
        <button class="save" @click="saveHotelSettings()">{{ $t("message.save") }}</button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Modal from "@/components/Modal";
export default {
  name: "HotelSettings",
  components: {
    Modal
  },
  data() {
    return {
      checkin: null,
      checkinHour: {
        HH: "",
        mm: ""
      },
      checkout: null,
      checkoutHour: {
        HH: "",
        mm: ""
      },
      // doFacialRecognition: null,
      keyType: "rfid",
      shouldMagniteze: null,
      keySelected: null,
      encoder: null,
      keyServerUrl: null,
      slug: null
    };
  },
  computed: {
    checkinCheckoutOptions() {
      return [
        { value: 0, label: "Desabilitado" },
        { value: 1, label: "Habilitado" }
      ];
    },
    keysOptions() {
      return [
        { value: "dormakaba_atlas", label: "Dormakaba-ATLAS" },
        { value: "assaabloy", label: "Assaabloy" },
        { value: "onity", label: "Onity" },
        { value: "saga", label: "Saga" },
        { value: "orbita", label: "Orbita" },
        { value: "omnitec", label: "Omnitec" }
      ];
    },
    keyTypeOptions() {
      return [
        { value: "rfid", label: "RFID" },
        { value: "magnetic", label: this.$t("message.magnecticStripe") }
      ];
    },
    hasEncoder() {
      return (
        this.keySelected == "dormakaba_atlas" ||
        this.keySelected == "saga" ||
        this.keySelected == "orbita" ||
        this.keySelected == "assaabloy" ||
        this.keySelected == "omnitec"
      );
    },
    selectAnOptionLabel() {
      return this.$i18n.messages[this.$i18n.fallbackLocale].message.selectAnOption;
    },
    selectAKeyLabel() {
      return this.$i18n.messages[this.$i18n.fallbackLocale].message.selectAnOption;
    },
    hasKeyServerUrl() {
      return this.keySelected === "dormakaba";
    }
  },
  mounted() {
    const storageObject = Object.keys(localStorage);

    const settingsProperties = storageObject.filter(el => el.includes("settings"));

    settingsProperties.forEach(prop => {
      switch (prop) {
        case "settings.blockedCheckin":
          this.checkin = parseInt(localStorage.getItem(prop));
          break;
        case "settings.blockedCheckout":
          this.checkout = parseInt(localStorage.getItem(prop));
          break;
        case "settings.checkinTime":
          this.checkinHour = JSON.parse(localStorage.getItem(prop));
          break;
        case "settings.checkoutTime":
          this.checkoutHour = JSON.parse(localStorage.getItem(prop));
          break;
        // case "settings.doFacialRecognition":
        //   this.doFacialRecognition = JSON.parse(localStorage.getItem(prop));
        //   break;
        case "settings.keySystem":
          this.keySelected = localStorage.getItem(prop);
          break;
        case "settings.addressEncoder":
          this.encoder = localStorage.getItem(prop);
          break;
        case "settings.keyServerUrl":
          this.keyServerUrl = localStorage.getItem(prop);
          break;
        case "settings.shouldMagniteze":
          this.shouldMagniteze = parseInt(localStorage.getItem(prop));
          break;
        case "settings.keyType":
          this.keyType = parseInt(localStorage.getItem(prop));
          break;
        case "settings.slug":
          this.slug = localStorage.getItem(prop);
          break;
      }
    });
  },
  methods: {
    saveHotelSettings() {
      if (
        this.checkin == null ||
        this.checkout == null ||
        this.shouldMagniteze == null
        // ||
        // this.doFacialRecognition == null
      ) {
        this.$alert("warning", this.$t("alert.fillRequired"));
        return;
      }

      if (
        (this.checkin == 1 && (!this.checkinHour.HH || !this.checkinHour.mm)) ||
        (this.checkout == 1 && (!this.checkoutHour.HH || !this.checkoutHour.mm)) ||
        (this.shouldMagniteze && (!this.keySelected || !this.keyType)) ||
        (this.keySelected != null && this.hasEncoder && !this.encoder) ||
        (this.keySelected != null && this.hasKeyServerUrl && !this.keyServerUrl) ||
        !this.slug
      ) {
        this.$alert("warning", this.$t("alert.fillRequired"));
        return;
      }

      this.checkin != null ? localStorage.setItem("settings.blockedCheckin", this.checkin) : "";
      this.checkout != null ? localStorage.setItem("settings.blockedCheckout", this.checkout) : "";
      this.checkin === 1
        ? localStorage.setItem("settings.checkinTime", JSON.stringify(this.checkinHour))
        : "";
      this.checkout === 1
        ? localStorage.setItem("settings.checkoutTime", JSON.stringify(this.checkoutHour))
        : "";
      // this.doFacialRecognition != null
      //   ? localStorage.setItem("settings.doFacialRecognition", this.doFacialRecognition)
      //   : "";
      this.keySelected ? localStorage.setItem("settings.keySystem", this.keySelected) : "";
      this.encoder ? localStorage.setItem("settings.addressEncoder", this.encoder) : "";
      this.keyServerUrl ? localStorage.setItem("settings.keyServerUrl", this.keyServerUrl) : "";
      this.keyType ? localStorage.setItem("settings.keyType", this.keyType) : "";
      this.shouldMagniteze !== null
        ? localStorage.setItem("settings.shouldMagniteze", this.shouldMagniteze)
        : "";

      if (this.checkin == 0) {
        localStorage.removeItem("settings.checkinTime");
      }

      if (this.checkout == 0) {
        localStorage.removeItem("settings.checkoutTime");
      }

      this.slug ? localStorage.setItem("settings.slug", this.slug) : "";

      this.$toast.success(this.$i18n.t("message.successSave"));
    }
  }
};
</script>
<style lang="scss" scoped>
.hotel-config {
  display: flex;
  justify-content: center;

  .title {
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .checkin-checkout {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;

    .checkin {
      display: flex;
      margin-bottom: 2rem;
      align-items: flex-end;

      .custom-select-vs.mr {
        margin-right: 2rem;
      }
    }
    .checkout {
      display: flex;
      align-items: flex-end;

      .custom-select-vs.mr {
        margin-right: 2rem;
      }
    }
    .label-select {
      flex-grow: 1;
    }
  }

  .magnetize-key {
    margin-bottom: 2rem;
  }

  .key-selection {
    margin-bottom: 2rem;
    display: flex;
    flex-wrap: nowrap;
    width: 100%;

    .custom-select-vs {
      min-width: unset;
    }

    & > * {
      width: calc((100% - 2rem) / 2);

      &:first-child {
        margin-right: 2rem;
      }
    }
  }

  .label-select,
  .label-input {
    display: flex;
    flex-direction: column;

    label {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
    }
  }

  input {
    border-radius: 0.4rem;
    padding: 0.4rem 1.5rem;
    border: 0.1rem solid $yckDarkGrey;
    min-width: 15rem;
    height: fit-content;
    text-transform: none !important;
    height: 3rem;
    font-size: 13px;
    color: $yckDarkGrey;
  }

  .action {
    display: flex;
    justify-content: center;

    button {
      background-color: transparent;
      padding: 0.5rem 6rem;
      border: 0.1rem solid $yckLightGrey;
      border-radius: 0.4rem;
      width: 100%;
      margin: 0;
    }
  }

  .hotel-settings {
    width: 600px;
  }
}
</style>
