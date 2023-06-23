<template>
  <PreCheckinStructure :dotActive="'one'" :isLoading="isLoading" :backButton="false">
    <div class="title" v-show="!isLoading" slot="title">
      <span>{{ `${$t("message.hello")} ${name.toLowerCase()}` }},</span>
      <span>{{ hotel }}</span>
    </div>
    <div class="btn-container" v-show="!isLoading && showStartButton" slot="center">
      <button @click="startPreCheckin" class="squared">{{ $t("message.startPreCheckin") }}</button>
    </div>
  </PreCheckinStructure>
</template>
<script>
import PreCheckinStructure from "@/components/PreCheckinStructure";

export default {
  name: "StartPreCheckin",
  components: {
    PreCheckinStructure
  },
  data() {
    return {
      name: "",
      hotelName: null,
      reservationId: null,
      guestId: null,
      isLoading: false
    };
  },
  computed: {
    showStartButton() {
      return this.reservationId !== null && typeof this.reservationId !== "undefined";
    },
    hotel() {
      return `${this.$t("message.preCheckinWelcome")} ${this.hotelName ||
        this.$t("message.yourHotel")}`;
    },
    hasMultipleGuests() {
      return this.$store.getters.precheckinGuestList.length > 1;
    }
  },
  methods: {
    loadReservationData() {
      this.isLoading = true;
      this.$store.dispatch("RESET_ALL");
      this.getReservationParams();
      this.$API.booking
        .searchGuestReserve(this.reservationId, "checkin")
        .then(response => {
          const data = response.data || {};
          const users = data.guests || [];
          this.hotelName = data.hotelName || "";
          this.storeReservationData(users);
          this.loadUserName(users);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getReservationParams() {
      this.reservationId = this.$route.query.idReserva;
      this.guestId = this.$route.query.idHospede;
    },
    storeReservationData(users) {
      this.$store.dispatch("SET_PRECHECKIN_GUEST_ID", { value: this.guestId });
      this.$store.dispatch("SET_PRECHECKIN_RESERVATION_ID", { value: this.reservationId });
      this.$store.dispatch("SET_PRECHECKIN_GUEST_LIST", { value: users });
    },
    startPreCheckin() {
      if (this.hasMultipleGuests) {
        this.$router.push({ name: "RegisterGuest" });
      } else {
        this.$router.push({ name: "SelfieGuest" });
      }
    },
    loadUserName(users) {
      users.forEach(user => {
        const { guestId, firstName, lastName } = user.profile || {};
        if (guestId == this.guestId) {
          this.name = `${firstName} ${lastName}`;
        }
      });
    }
  },
  mounted() {
    this.loadReservationData();
  }
};
</script>
<style lang="scss" scoped>
.title {
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  span {
    font-size: 30px;
    color: $white;
    font-weight: 500;
    text-align: center;

    &:first-child {
      text-transform: capitalize;
    }

    &:last-child {
      font-size: 18px;
      margin: 0 auto;
      font-weight: 300;
      max-width: 992px;
    }
  }
}

.btn-container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 50px;
}

@media (min-width: 768px) {
  .title {
    span {
      font-size: 60px;
    }
    span:last-child {
      font-size: 30px;
    }
  }
  .btn-container {
    button {
      font-size: 30px;
      padding: 5px 30px;
    }
  }
}

@media (min-width: 1400px) {
  .title {
    span {
      font-size: 100px;
    }
    span:last-child {
      font-size: 40px;
    }
  }
  .btn-container {
    button {
      font-size: 40px;
      padding: 10px 40px;
    }
  }
}
</style>
