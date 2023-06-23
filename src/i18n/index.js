import Vue from "vue";
import VueI18n from "vue-i18n";
import { configure } from "vee-validate";
import messages from "@/i18n/messages";
import dateTimeFormats from "@/scripts/dateTimeFormats";

Vue.use(VueI18n);

const currentLocale = localStorage.getItem("systemLanguage") || "pt-BR";

export const i18n = new VueI18n({
  locale: currentLocale,
  fallbackLocale: "pt-BR",
  messages,
  dateTimeFormats
});

configure({
  defaultMessage: (field, values) => {
    return i18n.t(`validation.${values._rule_}`, values);
  }
});
