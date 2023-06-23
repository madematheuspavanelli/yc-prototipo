const state = {
  bookingId: null,
  bookingData: null,
  guestId: null,
  bookingInvoiceValue: null,
  guestList: null,
  transactionId: null,
  isPrincipal: null
};

const getters = {
  getBookingId: state => state.bookingId,
  getBookingData: state => state.bookingData,
  guestId: state => state.guestId,
  bookingExpenses: state => (state.bookingData || {}).expenses || [],
  bookingInvoiceValue: state => state.bookingInvoiceValue,
  bookingGuestList: state => state.guestList || [],
  transactionId: state => state.transactionId,
  getPrincipal: state => state.isPrincipal
};

const actions = {
  SET_BOOKING_ID: ({ commit }, payload) => {
    commit("SET_BOOKING_ID", payload.value);
  },
  SET_BOOKING_DATA: ({ commit }, payload) => {
    commit("SET_BOOKING_DATA", payload.value);
  },
  SET_GUEST_ID: ({ commit }, payload) => {
    commit("SET_GUEST_ID", payload.value);
  },
  SET_BOOKING_INVOICE_VALUE: ({ commit }, payload) => {
    commit("SET_BOOKING_INVOICE_VALUE", payload.value);
  },
  SET_BOOKING_GUEST_LIST: ({ commit }, payload) => {
    commit("SET_BOOKING_GUEST_LIST", payload.value);
  },
  SET_BOOKING_TRANSACTION_ID: ({ commit }, payload) => {
    commit("SET_BOOKING_TRANSACTION_ID", payload.value);
  },
  SET_BOOKING_PRINCIPAL: ({ commit }, payload) => {
    commit("SET_BOOKING_PRINCIPAL", payload.value);
  },
  RESET_ALL: ({ commit }) => {
    commit("SET_BOOKING_ID", null);
    commit("SET_BOOKING_DATA", null);
    commit("SET_GUEST_ID", null);
    commit("SET_BOOKING_INVOICE_VALUE", null);
    commit("SET_BOOKING_GUEST_LIST", null);
    commit("SET_BOOKING_TRANSACTION_ID", null);
  }
};

const mutations = {
  SET_BOOKING_ID: (state, value) => {
    state.bookingId = value;
  },
  SET_BOOKING_DATA: (state, value) => {
    state.bookingData = value;
  },
  SET_GUEST_ID: (state, value) => {
    state.guestId = value;
  },
  SET_BOOKING_INVOICE_VALUE: (state, value) => {
    state.bookingInvoiceValue = value;
  },
  SET_BOOKING_GUEST_LIST: (state, value) => {
    state.guestList = value;
  },
  SET_BOOKING_TRANSACTION_ID: (state, value) => {
    state.transactionId = value;
  },
  SET_BOOKING_PRINCIPAL: (state, value) => {
    state.isPrincipal = value;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
