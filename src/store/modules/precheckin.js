const state = {
  reservationId: null,
  guestId: null,
  userId: null,
  photoId: null,
  documentData: null,
  guests: [],
  userForm: null,
  userAddress: null
};

const getters = {
  precheckinReservationId: state => state.reservationId,
  precheckinGuestId: state => state.guestId,
  precheckinUserId: state => state.userId,
  precheckinPhotoId: state => state.photoId,
  precheckinDocumentData: state => state.documentData,
  precheckinGuestList: state => state.guests,
  precheckinUserForm: state => state.userForm,
  precheckinUserAddress: state => state.userAddress
};

const actions = {
  SET_PRECHECKIN_RESERVATION_ID: ({ commit }, payload) => {
    commit("SET_PRECHECKIN_RESERVATION_ID", payload.value);
  },
  SET_PRECHECKIN_USER_ID: ({ commit }, payload) => {
    commit("SET_PRECHECKIN_USER_ID", payload.value);
  },
  SET_PRECHECKIN_PHOTO_ID: ({ commit }, payload) => {
    commit("SET_PRECHECKIN_PHOTO_ID", payload.value);
  },
  SET_PRECHECKIN_DOCUMENT_DATA: ({ commit }, payload) => {
    commit("SET_PRECHECKIN_DOCUMENT_DATA", payload.value);
  },
  SET_PRECHECKIN_GUEST_ID: ({ commit }, payload) => {
    commit("SET_PRECHECKIN_GUEST_ID", payload.value);
  },
  SET_PRECHECKIN_GUEST_LIST: ({ commit }, payload) => {
    commit("SET_PRECHECKIN_GUEST_LIST", payload.value);
  },
  SET_PRECHECKIN_USER_PROFILE: ({ commit }, payload) => {
    commit("SET_PRECHECKIN_USER_PROFILE", payload.value);
  },
  SET_PRECHECKIN_USER_ADDRESS: ({ commit }, payload) => {
    commit("SET_PRECHECKIN_USER_ADDRESS", payload.value);
  },
  RESET_ALL: ({ commit }) => {
    commit("SET_PRECHECKIN_RESERVATION_ID", null);
    commit("SET_PRECHECKIN_GUEST_ID", null);
    commit("SET_PRECHECKIN_USER_ID", null);
    commit("SET_PRECHECKIN_PHOTO_ID", null);
    commit("SET_PRECHECKIN_GUEST_LIST", null);
    commit("SET_PRECHECKIN_USER_PROFILE", null);
    commit("SET_PRECHECKIN_USER_ADDRESS", null);
  }
};

const mutations = {
  SET_PRECHECKIN_RESERVATION_ID: (state, value) => {
    state.reservationId = value;
  },
  SET_PRECHECKIN_GUEST_ID: (state, value) => {
    state.guestId = value;
  },
  SET_PRECHECKIN_USER_ID: (state, value) => {
    state.userId = value;
  },
  SET_PRECHECKIN_PHOTO_ID: (state, value) => {
    state.photoId = value;
  },
  SET_PRECHECKIN_DOCUMENT_DATA: (state, value) => {
    state.documentData = value;
  },
  SET_PRECHECKIN_GUEST_LIST: (state, value) => {
    state.guests = value;
  },
  SET_PRECHECKIN_USER_PROFILE: (state, value) => {
    state.userForm = value;
  },
  SET_PRECHECKIN_USER_ADDRESS: (state, value) => {
    state.userAddress = value;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
