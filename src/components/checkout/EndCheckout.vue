<template>
  <BaseStructure :languageChanger="false">
    <div class="after-logo" slot="after-logo">
      <span class="welcome">{{ $t("message.thankYouCaps") }}</span>
      <span class="message">{{ $t("message.seeYouSoon") }}</span>
    </div>
  </BaseStructure>
</template>
<script>
import BaseStructure from "@/components/BaseStructureEnterLeave";
export default {
  name: "EndCheckout",
  components: {
    BaseStructure
  },
  mounted() {
    setTimeout(() => {
      this.$store.dispatch("RESET_ALL");
      this.$router.push("/");
    }, 3000);
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

    &.welcome {
      font-size: 5rem;
      font-weight: 500;
      margin-bottom: 1.5rem;
    }
  }
}
</style>
