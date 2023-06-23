<template>
  <transition name="modal">
    <div class="transition" v-show="showModal">
      <div class="absolute inset-0 h-screen w-screen bg-black/50"></div>
      <div
        class="modal-container absolute inset-0 m-auto h-[335px] w-[558px] rounded-[10px] bg-white transition"
      >
        <button class="ml-auto block p-[20px] outline-none" @click="handleClose">
          <Close />
        </button>

        <div>
          <h3
            class="mt-1 text-center text-[26px] font-medium"
            v-text="$t('pages.home.selectLanguage')"
          ></h3>

          <div class="mt-14 flex justify-center gap-10">
            <button @click="selectLanguage('pt-BR')">
              <Brazil />
            </button>
            <button @click="selectLanguage('es-ES')">
              <Spain />
            </button>
            <button @click="selectLanguage('en-US')">
              <USA />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Brazil from "@/assets/icons/brazil.vue";
import USA from "@/assets/icons/usa.vue";
import Spain from "@/assets/icons/spain.vue";
import Close from "@/assets/icons/close.vue";

export default {
  name: "LanguageSelectorModal",
  components: {
    Brazil,
    Spain,
    USA,
    Close
  },
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectLanguage(language) {
      this.$i18n.locale = language;
      this.handleClose();
    },
    handleClose() {
      this.$emit("close");
    }
  }
};
</script>

<style>
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(0.9);
  transform: scale(0.9);
}
</style>
