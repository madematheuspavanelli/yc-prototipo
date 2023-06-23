<template>
  <app-page
    style="overflowy: hidden"
    :pageTitle="$t('message.selectGuestTitle')"
    variant="top-bottom"
    :isLoading="isLoading"
  >
    <div class="content w-100">
      <div class="guest-list w-100">
        <div
          v-for="item in guestList"
          :key="item.id"
          class="guest w-100"
          @click="selectGuestHandler(item)"
        >
          <span>{{ item.profile.firstName }} {{ item.profile.lastName }}</span>
        </div>
      </div>
    </div>
  </app-page>
</template>

<script>
export default {
  name: "SelectGuestPage",
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    guestList() {
      return this.$store.getters.bookingGuestList;
    },
    shouldGetUserDocument() {
      return this.$store.getters.hotelSettingUseDocumentPhoto;
    }
  },
  methods: {
    selectGuestHandler(guest) {
      const { profile } = guest || {};
      const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`;
      this.$store.dispatch("SET_GUEST_ID", { value: profile.guestId });
      this.$store.dispatch("SET_NEW_USER_NAME", { value: fullName });

      if (!this.shouldGetUserDocument) {
        this.$router.push({
          name: "PersonalForm"
        });
      } else {
        this.$router.push({
          name: "DocumentPage"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  align-items: center;
  font-size: 1.8rem;

  .guest {
    border: 1px solid $yckLightGrey;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    margin-bottom: 10px;

    span {
      font-size: 1.5rem;
      padding: 20px;
      text-transform: uppercase;
    }
  }
}
</style>
