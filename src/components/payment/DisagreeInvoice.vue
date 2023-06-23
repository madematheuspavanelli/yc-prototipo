<template>
  <app-page :pageTitle="$t('alert.invoiceError')" variant="top-bottom">
    <div class="content">
      <img width="150" src="@/assets/icons/desk.svg" />
      <span> {{ $t("message.dontAgree") }} </span>
    </div>
    <div class="btn-container">
      <b-button variant="primary" @click="finish">{{ $t("message.finish") }}</b-button>
    </div>
  </app-page>
</template>

<script>
export default {
  name: "DisagreeInvoice",
  methods: {
    finish() {
      this.$store.dispatch("RESET_ALL");
      this.$router.push({ name: "Home" });
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  align-items: center;

  span {
    font-size: 25px;
    margin-top: 20px;
    color: $yckLightGrey;
  }
}
</style>
