import Vue from "vue";
import Vuex from "vuex";
import User from "./modules/user";
import Booking from "./modules/booking";
import Hotel from "./modules/hotel";
import Admin from "./modules/admin";
import Precheckin from "./modules/precheckin";
import Card from "./modules/card";
import Document from "./modules/document";
import Keyboard from "./modules/keyboard";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user: User,
    card: Card,
    booking: Booking,
    hotel: Hotel,
    admin: Admin,
    precheckin: Precheckin,
    document: Document,
    keyboard: Keyboard
  }
});

store.subscribe((mutation, state) => {
  switch (mutation.type) {
    case "SET_TOKEN":
      localStorage.setItem("token", state.admin.token);
      break;
    case "LOGOUT":
      localStorage.removeItem("token");
      break;
    default:
  }
});

export default store;
