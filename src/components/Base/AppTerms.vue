<template>
  <div>
    <ValidationProvider rules="terms" v-slot="{ errors }" slim>
      <b-form-group
        id="input-terms-group"
        class="terms-input"
        :invalid-feedback="errors[0]"
        :state="!errors.length"
      >
        <b-form-checkbox
          id="input-terms"
          v-model="model"
          name="terms"
          type="checkbox"
          :value="true"
          :unchecked-value="false"
          size="lg"
        >
          <span>
            {{ $t("message.readAndAgree") }}
            <span class="link-style " v-b-modal.terms-modal @click.prevent="">{{
              $t("message.terms")
            }}</span>
            e a
            <span class="link-style " v-b-modal.privacy-modal @click.prevent="">{{
              $t("message.privacy")
            }}</span>
          </span>
        </b-form-checkbox>
        <b-form-checkbox
          id="input-lgpd"
          v-model="model"
          name="lgpd"
          type="checkbox"
          :value="true"
          :unchecked-value="false"
          size="lg"
        >
          <span>
            {{ $t("message.lgpd") }}
          </span>
        </b-form-checkbox>
      </b-form-group>
    </ValidationProvider>

    <TermsModal />
    <PrivacyModal />
  </div>
</template>

<script>
import TermsModal from "@/components/terms/TermsModal.vue";
import PrivacyModal from "@/components/terms/PrivacyModal.vue";

export default {
  name: "AppInput",
  props: {
    value: {
      required: true
    }
  },
  components: {
    TermsModal,
    PrivacyModal
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(model) {
        this.$emit("input", model);
      }
    }
  }
};
</script>

<style lang="scss">
.link-style {
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: $black;
  }

  .terms-input {
    display: flex;
    flex-direction: row;

    span {
      font-size: 15px;
    }
  }
}
</style>
