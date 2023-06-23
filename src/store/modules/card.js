const state = {
  cardHolderName: "",
  cardNumber: "",
  expirationMonth: "",
  expirationYear: "",
  securityCode: "",
  cardBrand: "",
  installments: 1
};

const getters = {
  credicCardData: state => {
    return {
      cardHolderName: state.cardHolderName,
      cardNumber: state.cardNumber,
      expirationMonth: state.expirationMonth,
      expirationYear: state.expirationYear,
      securityCode: state.securityCode,
      cardBrand: state.cardBrand,
      installments: state.installments
    };
  }
};

const actions = {
  SET_CREDIT_CARD: ({ commit }, payload) => {
    commit("SET_CREDIT_CARD", payload);
  }
};

const mutations = {
  SET_CREDIT_CARD: (state, payload) => {
    const value = payload.value;

    state.cardHolderName = value.cardHolderName;
    state.cardNumber = value.cardNumber;
    state.expirationMonth = value.expirationMonth;
    state.expirationYear = value.expirationYear;
    state.securityCode = value.securityCode;
    state.cardBrand = value.cardBrand;
    state.installments = value.installments;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
