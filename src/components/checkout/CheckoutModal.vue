<template>
  <div class="checkout-modal">
    <Modal>
      <span class="title" slot="title">{{ $t("message.doCheckout") }}</span>
      <div slot="center">
        <app-totem-select
          name="documentType"
          :label="`${$t('message.documentType')}`"
          :options="documentData"
          v-model="documentType"
        />
        <AppTotemInput
          name="checkou-input"
          keyboardLayout="numeric"
          :mask="documentMask"
          :label="`${$t('message.reportDocument')}`"
          v-model="input"
          @confirmed="startCheckout"
        />
      </div>
      <div class="select-button" slot="bottom">
        <button @click="exit">{{ $t("message.exit") }}</button>
        <button class="black-btn" @click="startCheckout">{{ $t("message.next") }}</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal";
import AppTotemInput from "@/components/Base/AppTotemInput.vue";

export default {
  name: "ModalCheckout",
  components: {
    Modal,
    AppTotemInput
  },
  data() {
    return {
      input: null,
      documentData: [
        { label: this.$t("message.apartmentType"), value: "apartment" },
        { label: this.$t("message.cpf"), value: "cpf" },
        { label: this.$t("message.passport"), value: "passport" }
      ],
      documentType: ""
    };
  },
  computed: {
    documentMask() {
      return this.documentType.value === "cpf" ? ["###.###.###-##"] : [];
    }
  },
  methods: {
    startCheckout() {
      if (this.input) {
        const doc = this.input.replace(/[^\w\s]/gi, "");
        this.$emit("startCheckout", this.documentType.value, doc);
      } else {
        this.$alert("warning", this.$t("alert.fillInput"));
        return;
      }
    },

    exit() {
      this.$router.push({ name: "Home" });
    },

    setFirstOption() {
      this.documentType = this.documentData[0];
    }
  },
  mounted() {
    this.setFirstOption();
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

  .title {
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 1.5rem;
    max-width: 700px;
    width: 500px;
  }

  .select-button {
    display: flex;
    margin-bottom: 1.5rem;
    margin-top: 1.5rem;
    justify-content: center;

    .black-btn {
      background: black;
      border: 0.2rem solid black;
      color: #ffffff;
    }

    button {
      background-color: transparent;
      padding: 0.5rem 2rem;
      border: 0.2rem solid $yckLightGrey;
      border-radius: 5px;
      margin-left: 5px;
      margin-right: 5px;
      font-size: 14px;
    }

    .custom-select {
      margin-right: 1.5rem;
    }
  }
}
</style>
