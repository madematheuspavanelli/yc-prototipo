<template>
  <Layout
    :title="$t('message.signature')"
    :footerButtonLabel="$t('message.payment')"
    :footerButtonEnabled="canGoToPayment"
    previousPageName="AddressForm"
  >
    <div class="relative flex justify-center mt-20">
      <canvas id="canvas" width="1080" height="240"></canvas>
      <hr class=" absolute bottom-12 border-2 border-black w-[827px]" />
    </div>

    <button
      @click="resetCanvas"
      class="bg-youcheckin-yellow leading-4 py-[20px] px-[30px] text-[26px] font-medium rounded mx-auto block mt-14 disabled:bg-youcheckin-gray-light disabled:text-youcheckin-gray"
      :disabled="!canReset"
    >
      {{ this.$t("pages.signature.erase") }}
    </button>
  </Layout>
</template>

<script>
import SignaturePad from "signature_pad";
import Layout from "@/components/widgets/layouts/Default.vue";

export default {
  name: "SignaturePage",
  components: {
    Layout
  },
  data() {
    return {
      isLoading: false,
      signatureCanvas: null
    };
  },
  computed: {
    isCanvasBlank() {
      return this.signatureCanvas?.isEmpty();
    },
    canReset() {
      return !this.isCanvasBlank;
    },
    canGoToPayment() {
      return !this.isCanvasBlank;
    }
  },
  methods: {
    setupCanvas() {
      const canvas = document.querySelector("#canvas");
      this.signatureCanvas = new SignaturePad(canvas);
    },
    resetCanvas() {
      this.signatureCanvas.clear();
    }
  },
  mounted() {
    this.setupCanvas();
  }
};
</script>
