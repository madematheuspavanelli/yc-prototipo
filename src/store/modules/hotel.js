const state = {
  hotelSettings: {
    configs: {},
    customization: {}
  },
  currentProcess: null,
  paymentType: null,
  allowInstallments: null
};

const getters = {
  hotelSettingUseCovidForm: state => state.hotelSettings.configs.covid,
  hotelSettingPaymentByGuest: state => state.hotelSettings.configs.paymentByGuest,
  hotelSettingUsePayOnCheckin: state => state.hotelSettings.configs.payOnCheckin,
  hotelSettingUseSignature: state => state.hotelSettings.configs.signature,
  hotelSettingUseDocumentPhoto: state => state.hotelSettings.configs.documentPhoto,
  hotelSettingUsePreCheckinPet: state => state.hotelSettings.configs.includePreCheckinPet,
  hotelSettingFaceRekognition: state => state.hotelSettings.configs.includeFaceRekognition,
  hotelSettingUpdateKey: state => state.hotelSettings.configs.hotelSettingUpdateKey,
  hotelSettingConsultStatement: state => state.hotelSettings.configs.hotelSettingConsultStatement,
  currentProcess: state => state.currentProcess,
  hotelCustomizationHomeBackgroundImage: state =>
    state.hotelSettings.customization
      .homeBackgroundImage /*  ||
    require("@/assets/defaultImages/background.jpeg") */,
  hotelCustomizationLogo: (state, getters) =>
    state.hotelSettings.customization.homeHotelLogo || getters.hotelCustomizationLogoDefault,
  hotelCustomizationGroupLogo: (state, getters) =>
    state.hotelSettings.customization.homeHotelGroupLogo ||
    getters.hotelCustomizationGroupLogoDefault,
  hotelCustomizationTopCenter: (state, getters) =>
    state.hotelSettings.customization.homeScreenTheme || getters.hotelCustomizationTopCenterDefault,
  hotelCustomizationCenterLeft: (state, getters) =>
    state.hotelSettings.customization.midPagesScreenTheme ||
    getters.hotelCustomizationCenterLeftDefault,
  hotelCustomizationTopRight: (state, getters) =>
    state.hotelSettings.customization.topPagesScreenTheme ||
    getters.hotelCustomizationTopRightDefault,
  hotelCustomizationBottomLeft: (state, getters) =>
    state.hotelSettings.customization.bottomPagesScreenTheme ||
    getters.hotelCustomizationBottomLeftDefault,
  hotelCustomizationPreCheckinBgImage: (state, getters) =>
    state.hotelSettings.customization.preCheckinBgImage ||
    getters.hotelCustomizationPreCheckinBgImageDefault,
  hotelCustomizationPreCheckinLogo: (state, getters) =>
    state.hotelSettings.customization.preCheckinLogo ||
    getters.hotelCustomizationPreCheckinLogoDefault,
  hotelCustomizationPreCheckinNavColor: (state, getters) =>
    state.hotelSettings.customization.preCheckinNavColor ||
    getters.hotelCustomizationPreCheckinNavColorDefault,
  hotelCustomizationHomeBackgroundImageDefault: () =>
    require("@/assets/defaultImages/background.jpeg"),
  hotelCustomizationLogoDefault: () => require("@/assets/youcheckin_logo_full_white.svg"),
  hotelCustomizationGroupLogoDefault: () => require("@/assets/youcheckin_logo_full_white.svg"),
  hotelCustomizationTopCenterDefault: () => require("@/assets/defaultImages/top_center.svg"),
  hotelCustomizationCenterLeftDefault: () => require("@/assets/defaultImages/center_left.svg"),
  hotelCustomizationTopRightDefault: () => require("@/assets/defaultImages/top_right.svg"),
  hotelCustomizationBottomLeftDefault: () => require("@/assets/defaultImages/bottom_left.svg"),
  /* hotelCustomizationPreCheckinBgImageDefault: () =>
    require("@/assets/defaultImages/preCheckinBackground.png"), */
  hotelCustomizationPreCheckinLogoDefault: () => require("@/assets/youcheckin_logo_full_white.svg"),
  hotelCustomizationPreCheckinNavColorDefault: () => "#2a2c2e",
  hotelInstallmentsOption: () => state.allowInstallments
};

const actions = {
  SET_HOTEL_SETTINGS: ({ commit }, payload) => {
    commit("SET_HOTEL_SETTINGS", payload);
  },
  SET_CURRENT_PROCESS: ({ commit }, payload) => {
    commit("SET_CURRENT_PROCESS", payload);
  },
  RESET_ALL: ({ commit }) => {
    commit("SET_CURRENT_PROCESS", null);
  },
  SET_PAYMENT_TYPE: ({ commit }, payload) => {
    commit("SET_PAYMENT_TYPE", payload);
  },
  SET_INSTALLMENTS: ({ commit }, payload) => {
    commit("SET_INSTALLMENTS", payload);
  }
};

const mutations = {
  SET_HOTEL_SETTINGS: (state, value) => {
    state.hotelSettings = value;
  },
  SET_CURRENT_PROCESS: (state, value) => {
    state.currentProcess = value;
  },
  SET_PAYMENT_TYPE: (state, value) => {
    state.paymentType = value;
  },
  SET_INSTALLMENTS: (state, value) => {
    state.allowInstallments = value;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
