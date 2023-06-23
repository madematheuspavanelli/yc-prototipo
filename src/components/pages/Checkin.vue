<template>
  <div>
    <Layout title="Check-In" previousPageName="Home" :footerButtonAction="searchBooking">
      <div class="mx-auto h-full max-w-5xl transition">
        <div class="h-full flex justify-center items-center flex-col w-[650px] mx-auto">
          <p class="text-youcheckin-gray-dark mb-11 font-medium text-2xl w-[488px] text-center">
            Informe o nome e/ou sobrenome para identificarmos sua reserva
          </p>
          <TotemInput />
        </div>
      </div>
    </Layout>
    <SearchMessageDisplay v-show="showSearchMessage" />
    <SuccessMessageDisplay v-show="showSuccessMessage" />
  </div>
</template>

<script>
import Layout from "@/components/widgets/layouts/Default.vue";
import SuccessMessageDisplay from "@/components/widgets/organisms/SuccessMessageDisplay.vue";
import SearchMessageDisplay from "@/components/widgets/organisms/SearchMessageDisplay.vue";

export default {
  name: "CheckinPage",
  components: {
    Layout,
    SuccessMessageDisplay,
    SearchMessageDisplay
  },
  data() {
    return {
      isSearchingBooking: false,
      hasFoundBooking: false
    };
  },
  computed: {
    showSearchMessage() {
      return this.isSearchingBooking;
    },
    showSuccessMessage() {
      return this.hasFoundBooking;
    }
  },
  methods: {
    searchBooking() {
      this.isSearchingBooking = true;

      setTimeout(() => {
        this.isSearchingBooking = false;
        this.hasFoundBooking = true;
      }, 2000);

      setTimeout(() => {
        this.hasFoundBooking = false;
        this.$router.push({ name: "PersonalForm" });
      }, 4000);
    }
  }
};
</script>
