<template>
  <Layout
    :title="`${$t('message.address')}`"
    :footerButtonEnabled="canGoToNextPage"
    :footerButtonAction="goToInvoice"
    previousPageName="PersonalForm"
  >
    <div
      class="mx-auto h-full max-w-5xl transition"
      :style="{ transform: `translateY(-${verticalOffset}px)` }"
    >
      <div class="space-y-[30px] mb-10">
        <div class="flex gap-[30px]">
          <TotemInput label="País" />
          <TotemInput label="CEP" />
        </div>
        <TotemInput label="Endereço" />
        <div class="flex gap-[30px]">
          <TotemInput label="Número" />
          <TotemInput label="Estado" />
        </div>
        <div class="flex gap-[30px]">
          <TotemInput label="Cidade" />
          <TotemInput label="Complemento" />
        </div>
      </div>

      <div class="space-y-5">
        <div class="flex gap-4 items-center">
          <Slider :checked="terms" @change="handleChangeTerms" />
          <p class="font-medium text-xl" @click="openModal">
            Li e aceito os Termos e Condições de Uso e Política de Privacidade
          </p>
        </div>
        <div class="flex gap-4 items-center">
          <Slider :checked="lgpd" @change="handleChangeLGPD" />
          <p class="font-medium text-xl">
            Todas as informações protegidas de acordo com a lei LGPD
          </p>
        </div>
      </div>
    </div>

    <TermsModal :showModal="showTermsModal" @agree="handleAgree" @notAgree="closeModal" />
  </Layout>
</template>

<script>
import { mapGetters } from "vuex";
import Layout from "@/components/widgets/layouts/Default.vue";
import Slider from "@/components/widgets/atoms/Slider.vue";
import TermsModal from "@/components/widgets/molecules/TermsModal.vue";

export default {
  name: "AddressForm",
  components: {
    Layout,
    Slider,
    TermsModal
  },
  data() {
    return {
      showTermsModal: false,
      terms: false,
      lgpd: false
    };
  },
  computed: {
    ...mapGetters(["verticalOffset"]),
    canGoToNextPage() {
      return this.terms && this.lgpd;
    }
  },
  methods: {
    openModal() {
      this.showTermsModal = true;
    },
    closeModal() {
      this.showTermsModal = false;
    },
    handleAgree() {
      this.terms = true;
      this.closeModal();
    },
    handleChangeTerms(status) {
      this.terms = status;
    },
    handleChangeLGPD(status) {
      this.lgpd = status;
    },
    goToInvoice() {
      this.$router.push({ name: "InvoicePage" });
    }
  }
};
</script>
