const MINIMAL_KEYBOARD_INPUT_DISTANCE = 20;

const state = {
  inputActive: false,
  keyboardType: null,
  keyboardHeight: null,
  selectedInputHeightOffset: null,
  currentOffset: 0
};

const getters = {
  showKeyboard(state) {
    return state.inputActive;
  },
  keyboardType(state) {
    return state.keyboardType;
  },
  verticalOffset(state) {
    return state.inputActive ? state.currentOffset : 0;
  }
};

const mutations = {
  updateInput(state, payload) {
    const { isActive, type, inputHeightOffset } = payload;
    state.keyboardType = type;
    state.selectedInputHeightOffset = inputHeightOffset;
    state.inputActive = isActive;
    if (!isActive) {
      state.currentOffset = 0;
    }
  },
  setKeyboardHeight(state, payload) {
    state.keyboardHeight = payload;
  },
  updateKeyboardOffset(state) {
    const keyboardCoversInput =
      state.keyboardHeight <
      state.selectedInputHeightOffset + MINIMAL_KEYBOARD_INPUT_DISTANCE + state.currentOffset;

    if (keyboardCoversInput) {
      const offset =
        state.selectedInputHeightOffset -
        state.keyboardHeight +
        MINIMAL_KEYBOARD_INPUT_DISTANCE +
        (state.currentOffset !== 0 ? 0 : state.currentOffset);

      state.currentOffset = offset;
      return;
    }
  }
};

const actions = {
  setKeyboardHeight({ commit }, height) {
    commit("setKeyboardHeight", height);
  },
  activeLetterInput({ commit }, { offset }) {
    setTimeout(() => {
      commit("updateInput", {
        isActive: true,
        type: "letter",
        inputHeightOffset: offset
      });
      commit("updateKeyboardOffset");
    }, 0);
  },
  activeNumberInput({ commit }, { offset }) {
    commit("updateInput", {
      isActive: true,
      type: "numeric",
      inputHeightOffset: offset
    });
    commit("updateKeyboardOffset");
  },
  inactiveInput({ commit }, payload) {
    const { element } = payload;
    const { bottom } = element.getBoundingClientRect();
    const inputHeightOffset = bottom;

    commit("updateInput", {
      isActive: false,
      type: "",
      inputHeightOffset
    });
    commit("updateKeyboardOffset");
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
