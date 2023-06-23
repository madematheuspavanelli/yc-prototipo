<template>
  <div class="search-by-date-modal">
    <Modal>
      <span class="title" slot="title">{{ $t("message.checkoutModalTitle") }}</span>
      <AppTotemInput
        slot="center"
        name="checkin-search-input"
        keyboardLayout="numeric"
        :mask="['##/##/####']"
        :label="$t('message.checkoutDate')"
        :placeholder="$t('message.dateFormat')"
        v-model="input"
        @confirmed="retrySearch"
      />
      <div class="select-button" slot="bottom">
        <button @click="back">{{ $t("message.back") }}</button>
        <button class="checkout" @click="retrySearch">{{ $t("message.next") }}</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal";
import AppTotemInput from "@/components/Base/AppTotemInput.vue";
import { validate } from "vee-validate";

export default {
  name: "SearchByDateModal",
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
    retrySearch() {
      validate(this.input, "required|date|min-tomorrow").then(result => {
        if (result.valid) {
          this.$emit("retry-search", this.input);
        } else {
          this.$alert("warning", this.$t("alert.validDate"));
        }
      });
    },
    back() {
      this.$emit("close-date-modal");
    }
  }
};
</script>

<style lang="scss" scoped>
.search-by-date-modal {
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

    .custom-select {
      margin-right: 1.5rem;
    }
  }
}
</style>
