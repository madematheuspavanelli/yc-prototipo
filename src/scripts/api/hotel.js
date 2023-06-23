import { getUUID } from "@/scripts/commonScripts";

const hotel = instance => ({
  covidForm: data =>
    new Promise((resolve, reject) =>
      instance.$http
        .post("/form/covid19", data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  getSettings: () =>
    new Promise((resolve, reject) => {
      localStorage.setItem("settings.traceId", getUUID());
      instance.$http
        .get("/hotel/info")
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error));
    }),
  checkin: data =>
    new Promise((resolve, reject) =>
      instance.$http
        .post("/checkin", data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  checkout: data =>
    new Promise((resolve, reject) =>
      instance.$http
        .post("/checkout", data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  precheckin: data =>
    new Promise((resolve, reject) =>
      instance.$http
        .post("/pre-checkin", data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  sendPrecheckin: () =>
    new Promise((resolve, reject) =>
      instance.$http
        .post("/pre-checkin/send-mails?toHotel=true")
        .then(() => {
          resolve();
        })
        .catch(error => reject(error))
    )
});

export default hotel;
