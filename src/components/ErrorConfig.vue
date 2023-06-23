<template>
  <BaseStructure
    :adminEdit="adminEdit"
    :topImg="topImg"
    :hotelLogo="hotelLogo"
    :hotelGroup="hotelGroup"
    :background="background"
    :languageChanger="false"
  >
    <div class="before-logo" slot="before-logo">
      <span class="error">{{ $t("message.error") }}</span>
      <span class="mb-5">{{ $t("message.fixSettings") }}</span>
    </div>
  </BaseStructure>
</template>
<script>
import BaseStructure from "@/components/BaseStructureEnterLeave";
export default {
  name: "ErrorConfig",
  components: {
    BaseStructure
  },
  mounted() {
    setTimeout(() => {
      this.$router.push({ name: "FaceCamera" });
    }, 3000);
  },
  props: {
    adminEdit: {
      default: false
    },
    topImg: {
      required: false,
      default: null
    },
    hotelLogo: {
      required: false,
      default: null
    },
    hotelGroup: {
      required: false,
      default: null
    },
    background: {
      required: false,
      default: null
    }
  }
};
</script>
<style lang="scss" scoped>
.before-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4rem;

  span {
    color: #ffffff;
    font-size: 2rem;
  }

  .mb-5 {
    margin-bottom: 5rem;
  }

  .error {
    font-size: 8rem;
    font-weight: bold;
  }
}
</style>
