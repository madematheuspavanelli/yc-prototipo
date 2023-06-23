<template>
  <transition name="modal">
    <div class="transition" v-show="showModal">
      <div class="bg-black/60 w-[120vw] h-[120vh] top-[-140px] -left-24 fixed z-20"></div>
      <div
        class="modal-container bg-white fixed inset-0 w-[784px] z-20 h-[463px] rounded-xl m-auto pt-12 pb-8 px-9"
      >
        <h2 class="font-medium text-[28px] text-center mb-7">
          Termos e condições e política de privacidade
        </h2>

        <div class="h-[238px] overflow-scroll pr-4">
          <p class="text-xs font-medium">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Felis non convallis egestas
            quis aliquet. Pretium pharetra, arcu diam consequat faucibus. Tellus vitae fusce
            sagittis at pellentesque et eget suspendisse sit. Enim mattis sit iaculis nec odio nibh
            semper. Ac adipiscing purus blandit curabitur lacus ut lorem eu. In quis mauris sit
            dignissim egestas. At libero dui ultrices ultricies vulputate tortor. Convallis erat
            ullamcorper sed at nibh malesuada diam. Placerat tincidunt magna cum in. Tristique
            curabitur ac nibh ut ut vel montes, velit in. Purus, sit morbi turpis pharetra, proin
            interdum vitae id netus. Sed quis in vulputate nulla. Mauris in nisl sit vulputate
            turpis.
          </p>
        </div>

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
export default {
  name: "TermsModal",
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
