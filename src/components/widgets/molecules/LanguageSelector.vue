<template>
  <div>
    <button class="flex items-center gap-3" @click="openModal">
      <Brazil class="h-auto w-12" v-if="currentLanguage === 'brazil'" />
      <Spain class="h-auto w-12" v-if="currentLanguage === 'spain'" />
      <USA class="h-auto w-12" v-if="currentLanguage === 'usa'" />
      <Dropdown :color="color" />
    </button>
    <LanguageSelectorModal :showModal="showModal" @close="closeModal" />
  </div>
</template>

<script>
import Brazil from "@/assets/icons/brazil.vue";
import Spain from "@/assets/icons/spain.vue";
import USA from "@/assets/icons/usa.vue";
import Dropdown from "@/assets/icons/dropdown.vue";
import LanguageSelectorModal from "@/components/widgets/molecules/LanguageSelectorModal.vue";

export default {
  name: "LanguageSelector",
  components: {
    Brazil,
    Spain,
    USA,
    Dropdown,
    LanguageSelectorModal
  },
  props: {
    color: {
      type: String,
      default: "#000"
    }
  },
  data: () => ({
    showModal: false
  }),
  computed: {
    currentLanguage() {
      switch (this.$i18n.locale) {
        case "en-US":
          return "usa";
        case "es-ES":
          return "spain";
        case "pt-BR":
        default:
          return "brazil";
      }
    }
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  }
};
</script>
