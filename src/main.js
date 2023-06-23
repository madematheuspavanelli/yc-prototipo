import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import vSelect from "vue-select";
import VueSweetalert2 from "vue-sweetalert2";
import VueTheMask from "vue-the-mask";
import ColorPicker from "@caohenghu/vue-colorpicker";
import VueTimepicker from "vue2-timepicker";
import { required, email } from "vee-validate/dist/rules";
import { extend } from "vee-validate";

import VueHtml2Canvas from "vue-html2canvas";

import toast from "toastr";
import * as faceApi from "face-api.js";

import { initializeApi, API } from "@/scripts/api/api";
import { HTTP, applyInterceptors } from "@/libs/axios";
import {
  validateMinTomorrow,
  validateMinLength,
  validateDate,
  validateFullName,
  validateCpf,
  validateTerms
} from "@/scripts/validation";
import { swal } from "@/libs/swal";
import { BootstrapVue } from "bootstrap-vue";
import AppPopper from "@/components/Base/AppPopper";
import AppPage from "@/components/Base/AppPage";
import AppTotemInput from "@/components/Base/AppTotemInput.vue";
import AppTotemSelect from "@/components/Base/AppTotemSelect.vue";
import AppRadioGroup from "@/components/Base/AppRadioGroup.vue";
import AppInput from "@/components/Base/AppInput.vue";
import AppSelect from "@/components/Base/AppSelect.vue";
import KeyboardFlow from "@/components/Base/KeyboardFlow.vue";
import TotemInput from "@/components/widgets/molecules/TotemInput.vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";

import Loader from "@/components/Loader";
import { i18n } from "@/i18n";

// import Loader from "@/components/Loader.vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "vue-select/dist/vue-select.css";
import "vue2-timepicker/dist/VueTimepicker.css";
// import "@/scss/styles.scss";
import "@/theme/global.css";
import "vue-popperjs/dist/vue-popper.css";
import "simple-keyboard/build/css/index.css";

import "core-js/stable";
import "regenerator-runtime/runtime";

Vue.config.productionTip = false;
Vue.prototype.$http = HTTP;
Vue.prototype.$API = API;

Vue.prototype.$toast = toast;
Vue.prototype.$faceApi = faceApi;
Vue.prototype.$alert = swal;

Vue.component("v-select", vSelect);
Vue.component("color-picker", ColorPicker);
Vue.component("vue-timepicker", VueTimepicker);
Vue.component("app-loader", Loader);
Vue.component("app-page", AppPage);
Vue.component("app-totem-input", AppTotemInput);
Vue.component("app-totem-select", AppTotemSelect);
Vue.component("app-radio-group", AppRadioGroup);
Vue.component("app-input", AppInput);
Vue.component("app-select", AppSelect);
Vue.component("keyboard-flow", KeyboardFlow);
Vue.component("v-popper", AppPopper);
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("TotemInput", TotemInput);

Vue.use(VueHtml2Canvas);
Vue.use(VueTheMask);
Vue.use(VueSweetalert2);
Vue.use(BootstrapVue);

extend("min-tomorrow", validateMinTomorrow);
extend("required", required);
extend("min-length", validateMinLength);
extend("email", email);
extend("date", validateDate);
extend("fullName", validateFullName);
extend("cpf", validateCpf);
extend("terms", validateTerms);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  beforeCreate() {
    initializeApi(this);
    applyInterceptors(this);
  }
}).$mount("#app");
