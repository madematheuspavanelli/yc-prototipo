import users from "./users";
import booking from "./booking";
import hotel from "./hotel";
import key from "./key";
import card from "./card";
import admin from "./admin";
import document from "./document";
import transaction from "./transaction";

export const API = {
  users: null,
  booking: null,
  hotel: null,
  key: null,
  card: null,
  admin: null,
  document: null,
  transaction: null
};

export const initializeApi = instance => {
  API.instance = instance;
  API.users = users(instance);
  API.booking = booking(instance);
  API.hotel = hotel(instance);
  API.card = card(instance);
  API.admin = admin(instance);
  API.document = document(instance);
  API.transaction = transaction(instance);
  API.key = key();
};
