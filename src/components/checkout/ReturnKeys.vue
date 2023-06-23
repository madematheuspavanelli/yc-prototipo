<template>
  <app-page :pageTitle="$t('message.okCheckout')" variant="top-bottom">
    <div class="content">
      <img width="150" src="@/assets/icons/desk.svg" />
      <span> {{ $t("message.returnKeys") }} </span>
    </div>
    <div class="btn-container">
      <b-button variant="primary" @click="finish">{{ $t("message.finish") }}</b-button>
    </div>
  </app-page>
</template>

<script>
export default {
  name: "ReturnKeys",
  methods: {
    finish() {
      this.$router.push({ name: "EndCheckout" });
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
