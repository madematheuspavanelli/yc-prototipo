<template>
  <div class="languages pos-r" :class="{ open: hoverLanguages }">
    <div class="language-icon selected" @click="hoverLanguages = !hoverLanguages">
      <img :src="systemLanguage.icon" :alt="systemLanguage.label + 'icon'" />
      <span>{{ systemLanguage.label }}</span>
    </div>
    <div v-if="hoverLanguages" class="other-languages">
      <div
        class="language-icon"
        v-for="language in languagesNotSelected"
        :key="language.locale"
        @click="changeLanguage(language.locale)"
      >
        <img :src="language.icon" :alt="language.label + 'icon'" />
        <span>{{ language.label }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "LanguageChanger",
  computed: {
    systemLanguage() {
      return this.languageOptions.filter(el => this.$i18n.locale == el.locale)[0];
    },
    languagesNotSelected() {
      return this.languageOptions.filter(el => this.$i18n.locale != el.locale);
    }
  },
  data() {
    return {
      hoverLanguages: false,
      languageOptions: [
        {
          label: "Português",
          locale: "pt-BR",
          icon: this.getImgUrl("brazil")
        },
        {
          label: "English",
          locale: "en-US",
          icon: this.getImgUrl("usa")
        },
        {
          label: "Español",
          locale: "es-ES",
          icon: this.getImgUrl("spain")
        }
      ]
    };
  },
  methods: {
    getImgUrl(icon) {
      var images = require.context("@/assets/flags", false, /\.png$/);
      return images("./" + icon + ".png");
    },
    changeLanguage(locale) {
      this.$i18n.locale = locale;
      this.hoverLanguages = !this.hoverLanguages;
    }
  }
};
</script>
<style lang="scss" scoped>
.languages {
  display: flex;
  flex-direction: column;
  z-index: 3;
  justify-content: flex-start;

  .other-languages {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(50%);
  }

  .language-icon {
    display: flex;
    align-items: center;
    padding: 1rem 3rem;
    background-color: rgba(0, 0, 0, 0.4);
    min-width: 180px;
    cursor: pointer;

    span {
      font-size: 1.6rem;
      color: $white;
    }

    img {
      width: 2.5rem;
      margin-right: 1rem;
    }

    &.selected {
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 0px 0 4px 4px;
    }

    &:not(.selected) {
      &:hover {
        background-color: rgba(255, 255, 255, 0.4);
      }
    }
  }

  &.open {
    .other-languages {
      .language-icon:last-child {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }

    .language-icon {
      display: flex;
      align-items: center;
      padding: 1rem 3rem;
      background-color: rgba(0, 0, 0, 0.4);

      &.selected {
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 0;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }

      &:not(.selected) {
        &:hover {
          background-color: rgba(255, 255, 255, 0.4);
        }
      }
    }
  }
}
</style>
