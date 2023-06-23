const state = {
  token: null
};

const getters = {
  token: state => state.token,
  isUserAuthenticated: state => state.token !== null
};

const actions = {
  SET_TOKEN: ({ commit }, payload) => {
    commit("SET_TOKEN", payload.value);
  },
  LOGOUT: ({ commit }) => {
    commit("SET_TOKEN", null);
  }
};

const mutations = {
  SET_TOKEN: (state, value) => {
    state.token = value;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
