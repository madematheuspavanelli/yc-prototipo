<template>
  <div class="checkin-modal">
    <Modal>
      <span class="title" slot="title">{{ $t("message.selectCheckin") }}</span>
      <div slot="center">
        <table id="table-checkin">
          <thead>
            <tr>
              <th>{{ $t("message.guestName") }}</th>
              <th>{{ $t("message.reservationNumber") }}</th>
              <th>{{ $t("message.apartmentType") }}</th>
              <th>{{ $t("message.apartmentNumber") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in reservationList" :key="item"></tr>
          </tbody>
        </table>
      </div>
      <div class="select-button" slot="bottom">
        <button>{{ $t("message.back") }}</button>
        <button class="btn-continue">{{ $t("message.continue") }}</button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Modal from "@/components/Modal";
export default {
  name: "ReserveListModal",
  components: {
    Modal
  },
  data() {
    return {
      reservationList: []
    };
  },
  mounted() {
    // this.toggleLoader();
  },
  methods: {
    toggleLoader() {
      this.$emit("toggleLoader");
    }
  }
};
</script>
<style lang="scss" scoped>
.checkin-modal {
  display: flex;
  align-content: center;
  justify-content: center;

  #table-checkin {
    border-collapse: collapse;
    width: 100%;

    td,
    th {
      font-size: 14px;
      padding: 12px 8px 12px 8px;
      text-align: center;
      border-top: 1px solid #ddd;
    }

    tr:hover {
      background-color: #ddd;
    }
  }

  .title {
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .select-button {
    display: flex;
    margin-bottom: 1.5rem;
    margin-top: 1.5rem;
    justify-content: center;

    button {
      background-color: transparent;
      padding: 0.5rem 2rem;
      border: 0.1rem solid $yckLightGrey;
      margin-left: 5px;
      margin-right: 5px;
      font-size: 14px;
    }

    .custom-select {
      margin-right: 1.5rem;
    }

    .btn-continue {
      background-color: #000;
      color: white;
    }
  }
}
</style>
