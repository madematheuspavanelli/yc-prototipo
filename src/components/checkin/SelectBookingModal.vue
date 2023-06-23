<template>
  <div class="select-booking-date-modal">
    <Modal>
      <span class="title required" slot="title">{{ $t("message.selectBookingModal") }}</span>
      <div class="input-group" slot="center">
        <div
          class="guest"
          v-for="booking in bookingList"
          :key="booking.bookingId"
          @click="selectBookingHandler(booking)"
        >
          <span>{{ booking.fullName }}</span>
        </div>
      </div>
      <div class="select-button" slot="bottom">
        <button @click="back">{{ $t("message.back") }}</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal";

export default {
  name: "SelectBookingModal",
  props: ["bookingList"],
  components: {
    Modal
  },
  methods: {
    back() {
      this.$emit("close");
    },
    selectBookingHandler(booking) {
      this.$emit("booking-selected", {
        bookingId: booking.bookingId,
        guestId: booking.guestId
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.select-booking-date-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  height: 100vh;
  width: 100vw;

  .title {
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 1.5rem;
    max-width: 700px;
  }

  .input-group {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .guest {
    border: 1px solid $yckLightGrey;
    padding: 10px;
    border-radius: 5px;
    margin-top: 10px;
    text-align: center;
    min-width: 300px;
    width: 100%;
    margin-bottom: 10px;
    cursor: pointer;

    span {
      font-size: 1.5rem;
      padding: 20px;
      text-transform: uppercase;
    }
  }
  .select-button {
    display: flex;
    margin-bottom: 1.5rem;
    margin-top: 4rem;
    justify-content: center;
    width: 100%;

    button {
      width: 100%;
      margin: 0;
    }

    .custom-select {
      margin-right: 1.5rem;
    }
  }
}
</style>
