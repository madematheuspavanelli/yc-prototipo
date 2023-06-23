<template>
  <app-page :pageTitle="$t('message.hostingData')" :isLoading="isLoading" variant="top-bottom">
    <div class="content w-100">
      <h2 class="room-type">{{ roomDescription }}</h2>
      <span class="subtitle"> {{ $t("message.hostDate") }} </span>
      <div class="row">
        <div class="input-group">
          <span> {{ dateFilter(startDate) }} </span>
        </div>
        <div class="between">
          <span>{{ $t("message.dateTo") }}</span>
        </div>
        <div class="input-group">
          <span> {{ dateFilter(endDate) }} </span>
        </div>
      </div>
      <div class="input-group">
        <span> {{ $t("message.apartmentIs") }} {{ roomNumber }}</span>
      </div>
    </div>
    <div class="btn-container">
      <button @click="confirmReservationHandler">{{ $t("message.next") }}</button>
    </div>
  </app-page>
</template>

<script>
export default {
  name: "DataConfirmation",
  data() {
    return {
      roomDescription: null,
      roomType: null,
      startDate: null,
      endDate: null,
      roomNumber: null,
      apartmentType: null,
      bookingData: null,
      isLoading: false,
      retryCounter: 0,
      hasACard: false
    };
  },
  computed: {
    bookingId() {
      return this.$store.getters.getBookingId;
    },
    getLista() {
      return this.$store.getters.bookingGuestList;
    },

    getGuestId() {
      return this.$store.getters.guestId;
    },
    userId() {
      return this.$store.getters.getUserId;
    },
    currentProcess() {
      return this.$store.getters.currentProcess;
    }
  },
  methods: {
    loadBookingData() {
      this.isLoading = true;
      this.$API.booking
        .getBooking(this.bookingId, this.currentProcess)
        .then(response => {
          const data = response.data || {};
          const {
            checkinDate,
            checkoutDate,
            roomNumber,
            roomType,
            hasChild,
            roomDescription
          } = data;
          if (roomNumber === null) {
            this.roomNotFoundHandler(roomType);
            return;
          }
          if (hasChild) {
            this.childFound(hasChild);
            return;
          }
          this.startDate = checkinDate;
          this.endDate = checkoutDate;
          this.roomNumber = roomNumber;
          this.roomType = roomType;
          this.roomDescription = roomDescription;
          this.hasChild = hasChild;
          this.storeBookingData(data);
          this.isLoading = false;
        })
        .catch(() => {
          this.retryHandler();
        });
    },
    dateFilter(value) {
      return value !== null ? this.$d(new Date(value), "short") : "";
    },
    confirmReservationHandler() {
      this.isLoading = true;
      this.$API.booking
        .getBooking(this.bookingId, this.currentProcess)
        .then(response => {
          const { guestEnabledFor, shouldPayOnCheckin, requirePrimaryPayment } = response.data;

          if (guestEnabledFor.includes("CHECKIN") && shouldPayOnCheckin && requirePrimaryPayment) {
            this.$router.push({ name: "InvoicePage" });
          } else if (shouldPayOnCheckin) {
            if (this.hasACard) {
              this.$router.push({ name: "SavedCard" });
            } else {
              this.$router.push({ name: "CardRegistration" });
            }
          } else {
            this.skipPaymentHandler();
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    storeBookingData(data) {
      this.$store.dispatch("SET_BOOKING_DATA", { value: data });
    },
    retryHandler() {
      if (this.retryCounter === 5) {
        this.bookingNotFoundHandler();
        return;
      }
      this.retryCounter += 1;
      setTimeout(() => {
        this.loadBookingData();
      }, 5000);
    },
    roomNotFoundHandler(roomType) {
      this.$alert("alert", this.$t("alert.noRoom", { roomType })).then(() => {
        this.showErrorPage();
      });
    },

    childFound(hasChild) {
      this.$alert("error", this.$t("alert.hasChild", { hasChild })).then(() => {
        this.$router.push({ name: "Home" });
      });
    },

    bookingNotFoundHandler() {
      this.$alert("error", this.$t("alert.bookingRegisterError")).then(() => {
        this.showErrorPage();
      });
    },
    showErrorPage() {
      this.$router.push({ name: "DisagreeInvoice" });
    },
    loadCard() {
      this.isLoading = true;
      this.$API.users
        .getCard(this.userId)
        .then(() => {
          this.hasACard = true;
        })
        .catch(() => {
          this.hasACard = false;
        });
    },
    skipPaymentHandler() {
      if (this.currentProcess === "checkin") {
        this.$router.push({ name: "CheckinPage" });
      } else {
        this.$router.push({ name: "CheckoutPage" });
      }
    }
  },
  created() {
    this.loadBookingData();
    this.loadCard();
  }
};
</script>
<style lang="scss" scoped>
.room-type {
  font-size: 25px;
  color: $yckLightGrey;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 2rem;
  text-align: center;
}

.subtitle {
  font-size: 20px;
  margin-bottom: 20px;
  color: $yckLightGrey;
  text-align: center;
}

.input-group {
  width: 100%;
  border-bottom: 1px solid $yckLightGrey;
  margin-top: 1.5rem;
  height: 33px;

  span {
    display: block;
    text-align: center;
    font-size: 18px;
    margin: 0 20px 5px 20px;
  }
}

.row {
  display: flex;
  margin-top: 15px;
  flex-wrap: nowrap;
  margin: 0 0 1.5rem 0;
  align-items: flex-end;
  width: 100%;

  span {
    font-style: italic;
    margin: 0 20px 5px 20px;
    font-size: 18px;
  }

  .input-group {
    width: unset;
    flex-grow: 1;
  }
}
</style>
