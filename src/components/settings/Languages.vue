<template>
  <div class="language">
    <Modal>
      <span class="title" slot="title">{{ $t("message.systemLangugeTitle") }}</span>
      <div class="label-select" slot="center">
        <label for="language">{{ $t("message.languagePlaceHolder") }}</label>
        <v-select
          id="language"
          label="label"
          :options="languageOptions"
          :reduce="option => option.val"
          v-model="language"
          :placeholder="languagePlaceHolder"
          class="custom-select"
          :clearable="false"
        />
      </div>
      <div class="action" slot="bottom">
        <button @click="saveLanguage()">{{ $t("message.save") }}</button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Modal from "@/components/Modal";
export default {
  name: "LanguageSettings",
  components: {
    Modal
  },
  computed: {
    languageOptions() {
      return [
        {
          label: this.$i18n.t("message.portuguese"),
          val: "pt-BR"
        },
        {
          label: this.$i18n.t("message.english"),
          val: "en-US"
        },
        {
          label: this.$i18n.t("message.spanish"),
          val: "es-ES"
        }
      ];
    },
    languagePlaceHolder() {
      return this.$i18n.t("message.languagePlaceHolder");
    }
  },
  data() {
    return {
      language: null
    };
  },
  mounted() {
    if (localStorage.getItem("systemLanguage")) {
      this.language = localStorage.getItem("systemLanguage");
    }
  },
  methods: {
    saveLanguage() {
      if (this.language == null) {
        this.$alert("warning", this.$t("message.languagePlaceHolder"));
        return;
      }

      if (this.$i18n.locale !== this.language) {
        this.$i18n.locale = this.language;
        localStorage.setItem("systemLanguage", this.language);

        this.$toast.success(this.$i18n.t("message.successSave"));
      } else {
        this.$toast.success(this.$i18n.t("message.sameLanguage"));
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.language {
  display: flex;
  justify-content: center;

  .title {
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .label-select {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;

    label {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
    }
  }
  .action {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;

    button {
      background-color: transparent;
      padding: 0.5rem 6rem;
      border: 0.1rem solid $yckLightGrey;
      border-radius: 0.4rem;
    }
  }
}
</style>
