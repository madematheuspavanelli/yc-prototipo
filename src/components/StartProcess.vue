<template>
  <BaseStructure
    @photoChange="photoChange"
    @photoReset="photoReset"
    :adminEdit="adminEdit"
    :languageChanger="true"
    :isLoading="isLoading"
    :showRemoveTopImg="showRemoveTopImg"
    :showRemoveHotelLogo="showRemoveHotelLogo"
    :showRemoveHotelGroupLogo="showRemoveHotelGroupLogo"
    :showRemoveBackgroundImg="showRemoveBackgroundImg"
  >
    <div class="after-logo" slot="after-logo">
      <span class="message">{{ $t("message.doCheckinCheckout") }}</span>
      <button class="start" @click="start" :disabled="adminEdit">{{ $t("message.start") }}</button>
      <span class="cpf-service">{{ $t("message.cpfService") }}</span>
    </div>
  </BaseStructure>
</template>
<script>
import BaseStructure from "@/components/BaseStructureEnterLeave";

export default {
  name: "StartProcess",
  components: {
    BaseStructure
  },
  props: {
    adminEdit: {
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
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    start() {
      if (this.adminEdit) {
        return;
      }
      this.$store.dispatch("RESET_ALL");
      this.loadHotelSettings();
    },
    photoChange(position) {
      this.$emit("photoChange", position);
    },
    photoReset(position) {
      this.$emit("photoReset", position);
    },
    loadHotelSettings() {
      this.isLoading = true;
      this.$API.hotel
        .getSettings()
        .then(response => {
          const settings = (response.data || {}).options || {
            configs: {},
            customization: {}
          };
          this.$store.dispatch("SET_HOTEL_SETTINGS", settings);
          this.$router.push({ name: "Recognition" });
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.after-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4rem;

  span {
    color: #ffffff;
    font-size: 2rem;
  }

  .start {
    border: 0.1rem solid $white;
    background-color: rgba(0, 0, 0, 0.5);
    color: $white;
    padding: 2rem 8rem;
    border-radius: 0.4rem;
    font-size: 1.7rem;
    margin: 1.5rem 0;
    text-decoration: none;
  }

  .checkin-time {
    margin-bottom: 1rem;
  }
}
</style>
