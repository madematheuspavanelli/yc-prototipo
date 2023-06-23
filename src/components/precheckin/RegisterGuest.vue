<template>
  <PreCheckinStructure :dotActive="'two'" :backButton="true">
    <div class="title" slot="title">
      <span>{{ $t("message.registerGuestPreCheckin") }} </span>
    </div>
    <div class="guest-list" slot="center">
      <div
        class="guest"
        @click="selectGuest(guest.guestId)"
        v-for="guest in guestList"
        :key="guest.guestId"
      >
        <span>{{ guest.firstName }} {{ guest.lastName }}</span>
      </div>
    </div>
  </PreCheckinStructure>
</template>
<script>
import PreCheckinStructure from "@/components/PreCheckinStructure";

export default {
  name: "RegisterGuest",
  components: {
    PreCheckinStructure
  },
  computed: {
    guestList() {
      return this.$store.getters.precheckinGuestList.map(item => item.profile);
    }
  },
  methods: {
    selectGuest(guestId) {
      this.$store.dispatch("SET_PRECHECKIN_GUEST_ID", { value: guestId });
      this.$router.push({ name: "SelfieGuest" });
    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  span {
    font-size: 16px;
    color: $white;
    text-align: center;
  }
}

.guest-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 60px;

  .guest {
    color: $white;
    box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    border: 0.1rem solid #ffffff;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 2rem 8rem;
    border-radius: 0.4rem;
    margin-bottom: 20px;
    text-align: center;

    &:last-child {
      margin-bottom: 0;
    }

    &.active,
    &:hover {
      background-color: $white;

      span {
        color: $yckLightGrey;
      }
    }

    span {
      text-transform: uppercase;
      font-size: 18px;
      color: $white;
      text-align: center;
      width: 100%;
    }
  }
}

@media (min-width: 768px) {
  .title {
    span {
      font-size: 20px;
    }
  }
}

@media (min-width: 1400px) {
  .title {
    span {
      font-size: 24px;
    }
  }
}
</style>
