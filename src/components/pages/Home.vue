<template>
  <Layout>
    <div class="mx-auto h-full max-w-5xl">
      <Hotel class="mx-auto mb-20" />
      <div class="grid grid-cols-2 gap-x-9 gap-y-6">
        <button class="option bg-youcheckin-yellow" @click="handleCheckin">Check-in</button>
        <button class="option bg-white">Check-out</button>
        <button
          v-show="showUpdateKeyOption"
          class="option border border-white text-white"
          :class="{ 'col-span-2': hasOnlyOneOptionsToShow }"
          v-text="$t('pages.home.updateKey')"
        ></button>
        <button
          v-show="showConsultStatement"
          class="option border border-white text-white"
          :class="{ 'col-span-2': hasOnlyOneOptionsToShow }"
          v-text="$t('pages.home.consultStatement')"
        ></button>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/widgets/layouts/Home.vue";
import Hotel from "@/assets/icons/logo-hotel-gramado.vue";

export default {
  name: "HomePage",
  components: {
    Layout,
    Hotel
  },
  computed: {
    showUpdateKeyOption() {
      return this.$store.getters.hotelSettingUpdateKey || true;
    },
    showConsultStatement() {
      return this.$store.getters.hotelSettingConsultStatement || true;
    },
    hasOnlyOneOptionsToShow() {
      return !(this.showUpdateKeyOption && this.showConsultStatement);
    }
  },
  methods: {
    handleCheckin() {
      this.$router.push({ name: "Checkin" });
    }
  }
};
</script>

<style scoped>
.option {
  @apply h-[100px] rounded-[10px] text-3xl font-semibold;
}
</style>
