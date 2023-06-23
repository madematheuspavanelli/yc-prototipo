const state = {
  userId: null,
  guestId: null,
  photoId: null,
  userProfile: null,
  userAddress: null,
  documentData: null,
  newUserName: null,
  userDocument: null
};

const getters = {
  getUserId: state => state.userId,
  guestId: state => state.guestId,
  getPhotoId: state => state.photoId,
  userProfile: state => state.userProfile,
  getUserAddress: state => state.userAddress,
  documentData: state => state.documentData,
  newUserName: state => state.newUserName,
  userDocument: state => state.userDocument
};

const actions = {
  USER_DOCUMENT: ({ commit }, payload) => {
    commit("USER_DOCUMENT", payload.value);
  },
  SET_USER_ID: ({ commit }, payload) => {
    commit("SET_USER_ID", payload.value);
  },
  SET_GUEST_ID: ({ commit }, payload) => {
    commit("SET_GUEST_ID", payload.value);
  },
  SET_PHOTO_ID: ({ commit }, payload) => {
    commit("SET_PHOTO_ID", payload.value);
  },
  CLEAR_PHOTO_ID: ({ commit }) => {
    commit("SET_PHOTO_ID", null);
  },
  SET_USER_PROFILE: ({ commit }, payload) => {
    commit("SET_USER_PROFILE", payload.value);
  },
  SET_USER_ADDRESS: ({ commit }, payload) => {
    commit("SET_USER_ADDRESS", payload.value);
  },
  SET_DOCUMENT_DATA: ({ commit }, payload) => {
    commit("SET_DOCUMENT_DATA", payload.value);
  },
  SET_NEW_USER_NAME: ({ commit }, payload) => {
    commit("SET_NEW_USER_NAME", payload.value);
  },
  RESET_ALL: ({ commit }) => {
    commit("SET_USER_ID", null);
    commit("SET_PHOTO_ID", null);
    commit("SET_USER_PROFILE", null);
    commit("SET_USER_ADDRESS", null);
    commit("SET_DOCUMENT_DATA", null);
    commit("SET_NEW_USER_NAME", null);
  }
};

const mutations = {
  USER_DOCUMENT: (state, value) => {
    state.userDocument = value;
  },
  SET_PHOTO_ID: (state, value) => {
    state.photoId = value;
  },
  SET_USER_ID: (state, value) => {
    state.userId = value;
  },
  SET_GUEST_ID: (state, value) => {
    state.guestId = value;
  },
  SET_USER_PROFILE: (state, value) => {
    state.userProfile = value;
  },
  SET_USER_ADDRESS: (state, value) => {
    state.userAddress = value;
  },
  SET_DOCUMENT_DATA: (state, value) => {
    state.documentData = value;
  },
  SET_NEW_USER_NAME: (state, value) => {
    state.newUserName = value;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
