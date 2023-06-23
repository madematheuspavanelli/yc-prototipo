<template>
  <div class="details-box">
    <div class="info-item">
      <span>{{ $t("message.cardOwner") }}</span>
      <p>{{ name || "-" }}</p>
    </div>
    <div class="info-item">
      <span>{{ $t("message.reservationStatus") }}</span>
      <p>{{ status || "-" }}</p>
    </div>
    <div class="info-item">
      <span>{{ $t("message.scheduledCheckin") }}</span>
      <p>{{ dateFilter(reservationCheckinDate) }}</p>
    </div>
    <div class="info-item">
      <span>{{ $t("message.checkinMade") }}</span>
      <p>{{ dateFilter(checkinDate) }}</p>
    </div>
    <div class="info-item">
      <span>{{ $t("message.scheduledCheckout") }}</span>
      <p>{{ dateFilter(reservationCheckoutDate) }}</p>
    </div>
    <div class="info-item">
      <span>{{ $t("message.checkoutMade") }}</span>
      <p>{{ dateFilter(checkoutDate) }}</p>
    </div>
    <div class="info-item">
      <span>{{ $t("message.wasPreCheckinMade") }}</span>
      <p>{{ dateFilter(preCheckinDate) }}</p>
    </div>
    <div class="info-item">
      <span>{{ $t("message.roomNumber") }}</span>
      <p>{{ roomNumber || "-" }}</p>
    </div>
    <div class="info-item">
      <span>{{ $t("message.paymentStatus") }}</span>
      <p>{{ paymentStatus || "-" }}</p>
    </div>
    <div class="info-item">
      <span>{{ $t("message.amount") }} </span>
      <p>{{ "R$" + (transactions[0].amount / 100).toFixed(2).replace(".", ",") || "-" }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReservationInfo",
  props: [
    "checkinDate",
    "checkoutDate",
    "name",
    "preCheckinDate",
    "reservationCheckinDate",
    "reservationCheckoutDate",
    "status",
    "roomNumber",
    "paymentStatus",
    "transactions"
  ],
  methods: {
    dateFilter(value) {
      if (!value) {
        return "-";
      }
      return this.$d(new Date(value), "short");
    }
  }
};
</script>

<style lang="scss" scoped>
.details-box {
  padding: 20px 25px 0 25px;
  background-color: $yckLightGrey;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;

  .info-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 20px;

    span {
      font-size: 1.4rem;
      color: $background;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 1.6rem;
      color: $background;
      margin-bottom: 0;
    }
  }
}

@media screen and (min-width: 992px) {
  .details-box {
    .info-item {
      width: calc((100% - 10px) / 2);
      margin-right: 10px;

      &:nth-child(2n) {
        margin-right: 0;
      }
    }
  }
}

@media screen and (min-width: 1200px) {
  .details-box {
    .info-item {
      width: calc((100% - 20px) / 3);
      margin-right: 10px;

      &:nth-child(2n) {
        margin-right: 10px;
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
}

@media screen and (min-width: 1600px) {
  .details-box {
    .info-item {
      width: calc((100% - 30px) / 4);
      margin-right: 10px;

      &:nth-child(3n) {
        margin-right: 10px;
      }
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
}
</style>
