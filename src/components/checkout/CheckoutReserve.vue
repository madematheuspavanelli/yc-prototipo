<template>
  <div class="checkout-modal">
    <Modal class="modal-size">
      <div class="img-container" slot="center">
        <img v-if="showImage" :src="photoUrl" width="250" height="250" />
        <span class="title">{{ $t("message.wannaCheckout") }}</span>
        <span class="subtitle">{{ $t("message.documentRegistered") }}: </span>
        <span class="subtitle">{{ document | formatReadonlyCPF }} - {{ name }}</span>
      </div>
      <div class="select-button" slot="bottom">
        <button @click="closeCheckoutReserve">{{ $t("message.isNotMe") }}</button>
        <button @click="startCheckoutHandler" class="dark-btn">
          {{ $t("message.yesContinue") }}
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal";
import { formatReadonlyCPF } from "@/scripts/commonScripts";

export default {
  name: "CheckoutReserve",
  components: {
    Modal
  },
  props: {
    photoUrl: {
      default: null,
      required: true
    }
  },
  computed: {
    document() {
      return (this.$store.getters.userProfile || {}).document || "";
    },
    name() {
      return (this.$store.getters.userProfile || {}).name || "";
    }
  },
  methods: {
    closeCheckoutReserve() {
      this.$emit("closeCheckoutReserve");
    },

    startCheckoutHandler() {
      this.$emit("startCheckout");
    },

    filters: {
      formatReadonlyCPF
    }
  }
};
</script>

<style lang="scss" scoped>
.checkout-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  height: 100vh;
  width: 100vw;

  .modal-size {
    max-width: 480px;
  }

  .img-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    img {
      border: 1px solid $white;
      border-radius: 5px;
      box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.5);
    }

    .title {
      font-size: 3rem;
      text-align: center;
      margin: 1.5rem;
      max-width: 700px;
    }

    .subtitle {
      font-size: 1.5rem;
      text-align: center;
    }
  }

  .select-button {
    display: flex;
    margin-bottom: 1.5rem;
    margin-top: 1.5rem;
    justify-content: center;

    button {
      background-color: transparent;
      padding: 0.5rem 2rem;
      border: 0.2rem solid $yckLightGrey;
      border-radius: 5px;
      margin-left: 5px;
      margin-right: 5px;
      font-size: 22px;
    }
  }
}
</style>
