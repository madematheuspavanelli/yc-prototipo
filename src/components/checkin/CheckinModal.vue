<template>
  <div class="checkin-modal">
    <Modal>
      <span class="title" slot="title">{{ $t("message.doCheckin") }}</span>
      <AppTotemInput
        slot="center"
        name="checkin-input"
        keyboardLayout="name"
        :label="`${$t('message.reportName')}`"
        v-model="input"
        @confirmed="startCheckin"
      />
      <div class="select-button" slot="bottom">
        <button @click="exit">{{ $t("message.exit") }}</button>
        <button class="checkout" @click="startCheckin">{{ $t("message.next") }}</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal";
import AppTotemInput from "@/components/Base/AppTotemInput.vue";
import { validate } from "vee-validate";

export default {
  name: "ModalCheckin",
  components: {
    Modal,
    AppTotemInput
  },
  data() {
    return {
      input: null
    };
  },

  methods: {
    startCheckin() {
      validate(this.input, "required|min-length:2").then(result => {
        if (result.valid) {
          this.$emit("startCheckin", this.input);
        } else {
          this.$alert("warning", this.$t("alert.fillInputName"));
          return;
        }
      });
    },

    exit() {
      this.$router.push({ name: "Home" });
    }
  }
};
</script>
<style lang="scss" scoped>
.checkin-modal {
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
  }

  .checkout {
    background: black;
    border: 0.2rem solid black;
    color: $white;
  }

  .select-button {
    display: flex;
    margin-bottom: 1.5rem;
    margin-top: 1.5rem;
    justify-content: center;
  }
}
</style>
