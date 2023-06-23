const state = {
  document: {}
};

const getters = {
  document: state => state.document
};

const actions = {
  SET_DOCUMENT_DATA: ({ commit }, payload) => {
    commit("SET_DOCUMENT_DATA", payload.value);
  },
  RESET_ALL: ({ commit }) => {
    commit("SET_DOCUMENT_DATA", null);
  }
};

const mutations = {
  SET_DOCUMENT_DATA: (state, value) => {
    state.document = value;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
