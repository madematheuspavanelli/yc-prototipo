<template>
  <transition name="modal">
    <div class="transition" v-show="showModal">
      <div class="bg-black/60 w-[120vw] h-[120vh] top-[-140px] -left-24 fixed z-20"></div>
      <div
        class="modal-container bg-white fixed inset-0 w-[536px] z-20 h-[350px] rounded-xl m-auto pt-12 pb-8 px-9"
      >
        <Info class="mx-auto mb-8" />

        <p class="text-base font-medium text-center mb-[20px] w-[420px] mx-auto">
          Ao clicar em concordo, você declara estar de acordo com as cobranças que serão
          automaticamente debitadas em seu cartão de crédito.
        </p>

        <div class="flex gap-4 justify-center">
          <button
            class="text-youcheckin-gray-dark font-semibold border-2 leading-5 border-youcheckin-gray-dark rounded px-[30px] py-[20px] text-[26px]"
            @click="handleNotAgree"
          >
            Não concordo
          </button>
          <button
            class="text-youcheckin-gray-dark bg-youcheckin-yellow font-semibold border-2 leading-5 border-youcheckin-yellow rounded px-[30px] py-[20px] text-[26px]"
            @click="handleAgree"
          >
            Concordo
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Info from "@/assets/icons/info.vue";

export default {
  name: "BillingConfirmationModal",
  components: {
    Info
  },
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleAgree() {
      this.$emit("agree");
    },
    handleNotAgree() {
      this.$emit("notAgree");
    }
  }
};
</script>
